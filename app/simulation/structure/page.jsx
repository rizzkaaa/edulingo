"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Alert from "../../components/Alert";

import { FaClock, FaFlag } from "react-icons/fa";

import AudioQuestion from "../../components/question_type_component/audio_question";
import BasicQuestion from "../../components/question_type_component/basic_question";
import ImageQuestion from "../../components/question_type_component/image_question";
import LongTextQuestion from "../../components/question_type_component/long_text_question";
import TrueFalseQuestion from "../../components/question_type_component/true_false_question";

// Path disesuaikan dengan struktur folder Anda
import { db } from "../../../lib/firebase"; 
import { doc, setDoc } from "firebase/firestore";

// Menggunakan import langsung karena folder data ada di root
import simulasiData from "../../../data/simulasi.json";

const questionComponents = {
  audio: AudioQuestion,
  basic: BasicQuestion,
  image: ImageQuestion,
  long_text: LongTextQuestion,
  true_false: TrueFalseQuestion,
};

export default function StructurePage() {
  const router = useRouter();

  const [questions, setQuestions]     = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  
  // State untuk menyimpan User ID dari session login
  const [userId, setUserId]           = useState("");

  const [current, setCurrent]         = useState(0);
  const [answers, setAnswers]         = useState({});
  const [flagged, setFlagged]         = useState({});
  const [submitError, setSubmitError] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    show: false, text: "", isAlert: true, onOke: () => {},
  });

  // Waktu 80 menit (80 * 60 detik = 4800 detik)
  const [timeLeft, setTimeLeft] = useState(80 * 60);

  // Fungsi untuk mengacak array
  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // PERBAIKAN: Mengambil ID user yang sedang login (Sama dengan Reading)
  useEffect(() => {
    // Pastikan "user_id" sesuai dengan key token/id login di aplikasi Anda
    let loggedInUser = localStorage.getItem("user_id") || sessionStorage.getItem("user_id");
    
    if (loggedInUser) {
      setUserId(loggedInUser);
    } else {
      console.warn("Data login tidak ditemukan di sesi Structure. Menggunakan ID Guest.");
      let storedId = sessionStorage.getItem("toefl_guest_id");
      if (!storedId) {
        storedId = "guest_" + Math.random().toString(36).substring(2, 15);
        sessionSessionStorage.setItem("toefl_guest_id", storedId);
      }
      setUserId(storedId);
    }
  }, []);

  // Load soal dari JSON, Normalisasi struktur, Acak, dan Batasi maksimal 36 soal
  useEffect(() => {
    try {
      let structureSession = null;
      if (Array.isArray(simulasiData)) {
        structureSession = simulasiData.find(item => item.session_id === "Structure");
      } else if (simulasiData.session_id === "Structure") {
        structureSession = simulasiData;
      }

      if (structureSession && structureSession.questions) {
        
        let normalizedQuestions = structureSession.questions.map(q => {
          let mappedType = q.type;
          if (mappedType === "TrueOrFalse") mappedType = "true_false";
          if (mappedType === "FillInTheBlank") mappedType = "basic";

          let flatOptions = q.options || [];
          let correctAns = q.correct_answer !== undefined ? q.correct_answer : (q.answer !== undefined ? q.answer : null);
          let correctIdx = q.index_answer !== undefined ? parseInt(q.index_answer) : null;

          if (Array.isArray(q.options) && q.options.length > 0) {
            if (q.options[0] && typeof q.options[0] === 'object' && q.options[0].option) {
              flatOptions = q.options[0].option; 
              const idx = q.options[0].index_answer; 
              if (idx !== undefined && idx !== null) {
                correctIdx = parseInt(idx);
                if (flatOptions[correctIdx] !== undefined) {
                  correctAns = flatOptions[correctIdx]; 
                }
              }
            }
          }

          return {
            ...q,
            type: mappedType,
            options: flatOptions,
            correctAnswer: correctAns,
            correctIndex: correctIdx 
          };
        });
        
        if (normalizedQuestions.length > 36) {
          normalizedQuestions = shuffleArray(normalizedQuestions).slice(0, 36);
        }
        
        setQuestions(normalizedQuestions);
      } else {
        console.error("Data Structure session tidak ditemukan di file simulasi.json");
      }
    } catch (error) {
      console.error("Gagal memproses data soal:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Timer countdown & auto-submit jika waktu habis
  useEffect(() => {
    if (isLoading || questions.length === 0) return;

    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, isLoading, questions.length]);

  // Fungsi menghitung skor dan menyimpannya ke Firebase berdasarkan ID Login
  const saveDataToFirebase = async () => {
    if (!userId) return; 

    const timeSpent = (80 * 60) - timeLeft;
    
    let correctCount = 0;
    
    questions.forEach((q, index) => {
      let ans = answers[index];
      if (ans === undefined) {
        ans = answers[String(index)];
      }

      if (ans !== undefined && ans !== null) {
        let isCorrect = false;
        let userAns = ans;

        // 1. Ekstraksi nilai jika ans berupa objek event radio button ({target: {value}} / {value} / {index})
        if (ans && typeof ans === 'object') {
          if (ans.target && ans.target.value !== undefined) {
            userAns = ans.target.value;
          } else if (ans.value !== undefined) {
            userAns = ans.value;
          } else if (ans.index !== undefined) {
            userAns = ans.index;
          }
        }

        // 2. Tentukan kunci teks dan indeks jawaban dari berbagai kemungkinan fallback struktur
        let targetAnsText = q.correctAnswer;
        let targetAnsIdx = q.correctIndex;

        if (targetAnsIdx === undefined || targetAnsIdx === null) {
          if (q.index_answer !== undefined) {
            targetAnsIdx = parseInt(q.index_answer);
          } else if (Array.isArray(q.options) && q.options[0] && typeof q.options[0] === 'object' && q.options[0].index_answer !== undefined) {
            targetAnsIdx = parseInt(q.options[0].index_answer);
          }
        }

        if (targetAnsText === undefined || targetAnsText === null) {
          if (q.correct_answer !== undefined) targetAnsText = q.correct_answer;
          else if (q.answer !== undefined) targetAnsText = q.answer;
          else if (targetAnsIdx !== null) {
            if (Array.isArray(q.options)) {
              if (typeof q.options[0] === 'object' && Array.isArray(q.options[0].option)) {
                targetAnsText = q.options[0].option[targetAnsIdx];
              } else if (typeof q.options[targetAnsIdx] === 'string') {
                targetAnsText = q.options[targetAnsIdx];
              }
            }
          }
        }

        // 3. Pengecekan kecocokan nilai langsung (Exact Match)
        if (targetAnsText !== null && targetAnsText !== undefined && userAns === targetAnsText) {
          isCorrect = true;
        }

        // 4. Pengecekan indeks langsung (Angka atau String Angka)
        if (targetAnsIdx !== null && targetAnsIdx !== undefined && (userAns === targetAnsIdx || String(userAns) === String(targetAnsIdx))) {
          isCorrect = true;
        }

        // 5. Pengecekan Teks Case-Insensitive & Trimmed (Menghindari beda spasi/huruf kapital)
        if (userAns !== undefined && userAns !== null && targetAnsText !== undefined && targetAnsText !== null) {
          if (String(userAns).trim().toLowerCase() === String(targetAnsText).trim().toLowerCase()) {
            isCorrect = true;
          }
        }

        // 6. Pengecekan Karakter Huruf Pilihan (A, B, C, D) atau Format "A. Teks" bawaan beberapa template komponen
        if (typeof userAns === 'string' && targetAnsIdx !== null && targetAnsIdx !== undefined) {
          const cleanAns = userAns.trim().toUpperCase();
          const letterIndices = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
          if (letterIndices[cleanAns] !== undefined && letterIndices[cleanAns] === targetAnsIdx) {
            isCorrect = true;
          }
          if (cleanAns.startsWith('A.') && targetAnsIdx === 0) isCorrect = true;
          if (cleanAns.startsWith('B.') && targetAnsIdx === 1) isCorrect = true;
          if (cleanAns.startsWith('C.') && targetAnsIdx === 2) isCorrect = true;
          if (cleanAns.startsWith('D.') && targetAnsIdx === 3) isCorrect = true;
        }

        // 7. Pengecekan nilai teks berdasarkan urutan indeks opsi array alternatif
        if (targetAnsText !== null && targetAnsText !== undefined) {
          let userAnsInt = parseInt(userAns);
          if (!isNaN(userAnsInt)) {
            let currentOptions = [];
            if (Array.isArray(q.options)) {
              if (q.options[0] && typeof q.options[0] === 'object' && Array.isArray(q.options[0].option)) {
                currentOptions = q.options[0].option;
              } else {
                currentOptions = q.options;
              }
            }
            if (currentOptions[userAnsInt] !== undefined) {
              if (String(currentOptions[userAnsInt]).trim().toLowerCase() === String(targetAnsText).trim().toLowerCase()) {
                isCorrect = true;
              }
            }
          }
        }

        if (isCorrect) {
          correctCount++;
        }
      }
    });

    const totalQ = questions.length;
    const scorePercentage = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;

    try {
      // Menggunakan userId hasil login, digabung menggunakan { merge: true }
      await setDoc(doc(db, "exam_sessions", userId), {
        structure_time_left: timeLeft,
        structure_time_spent: timeSpent,
        structure_correct_answers: correctCount,
        structure_total_questions: totalQ,
        structure_score_percentage: scorePercentage,
        updatedAt: new Date()
      }, { merge: true }); 
      console.log(`Waktu dan skor Structure berhasil disimpan ke Akun Login ID: ${userId}`);
    } catch (error) {
      console.error("Gagal menyimpan data ke Firebase: ", error);
    }
  };

  const handleTimeUp = async () => {
    await saveDataToFirebase();
    router.push("/simulation_rule/reading");
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const totalQuestions = questions.length;
  const allAnswered = questions.length > 0 && questions.every((_, i) => answers[i] !== undefined);

  function showAlert(text, isAlert = true, onOke = () => {}) {
    setAlertConfig({ show: true, text, isAlert, onOke });
  }

  function closeAlert() {
    setAlertConfig(prev => ({ ...prev, show: false }));
  }

  function handleExit() {
    showAlert(
      "Yakin ingin keluar? Kamu harus memulai lagi dari awal.",
      false,
      () => router.back()
    );
  }

  function handleSubmit() {
    showAlert(
      "Sudah yakin mau submit? Jawaban tidak bisa diubah setelah submit.",
      false,
      async () => {
        await saveDataToFirebase();
        router.push("/simulation_rule/reading");
      }
    );
  }

  function handleNext() {
    if (current === totalQuestions - 1) {
      showAlert("Ini adalah soal terakhir. Silakan klik tombol 'SUBMIT EXAM' di panel kanan untuk menyelesaikan sesi.", false);
    } else {
      setCurrent(prev => prev + 1);
    }
  }

  function handleFlag() {
    setFlagged(prev => ({ ...prev, [current]: !prev[current] }));
  }

  function getQuestionClass(index) {
    if (index === current)             return styles.activeQuestion;
    if (flagged[index])               return styles.reviewQuestion;
    if (answers[index] !== undefined) return styles.answeredQuestion;
    return styles.unansweredQuestion;
  }

  if (isLoading) {
    return <div className={styles.container} style={{ color: 'white', textAlign: 'center', paddingTop: '20vh' }}>Loading questions...</div>;
  }

  if (questions.length === 0) {
    return <div className={styles.container} style={{ color: 'white', textAlign: 'center', paddingTop: '20vh' }}>Soal tidak tersedia. Cek file simulasi.json Anda.</div>;
  }

  const q = questions[current];
  const QuestionComponent = questionComponents[q.type];

  return (
    <div className={styles.container}>

      {alertConfig.show && (
        <Alert
          isAlert={alertConfig.isAlert}
          text={alertConfig.text}
          handleClick={() => { closeAlert(); alertConfig.onOke(); }}
          handleCancel={closeAlert}
        />
      )}

      <div className={styles.topDecoration}></div>
      <div className={styles.bottomDecoration}></div>

      <div className={styles.headerSection}>
        <div>
          <h1>TOEFL Exam Simulation</h1>
          <div className={styles.line}></div>
          <p>Session: Structure</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.timerBox}><FaClock />{formatTime(timeLeft)}</div>
          <button className={styles.exitBtn} onClick={handleExit}>EXIT SESSION</button>
        </div>
      </div>

      <div className={styles.lineDivider}></div>

      <div className={styles.contentLayout}>
        <div className={styles.leftSection}>
          <div className={styles.questionContainer}>
            {QuestionComponent ? (
              <QuestionComponent
                {...q}
                questionNumber={current + 1}
                totalQuestions={totalQuestions}
                selectedAnswer={answers[current]}
                onAnswer={(val) => {
                  setAnswers(prev => ({ ...prev, [current]: val }));
                  setSubmitError(false);
                }}
              />
            ) : (
              <div style={{ padding: "20px", color: "red", border: "2px dashed red", background: "#ffe6e6", borderRadius: "8px" }}>
                <h3 style={{ margin: "0 0 10px 0" }}>⚠️ Error Merender Soal No. {current + 1}</h3>
                <p style={{ margin: 0 }}>
                  Sistem tidak menemukan komponen untuk tipe soal <strong><code>"{q.type}"</code></strong>.
                </p>
              </div>
            )}
          </div>

          <div className={styles.bottomActions}>
            <button className={styles.prevBtn} onClick={() => {}} disabled={true}>← PREVIOUS</button>
            <button className={`${styles.reviewBtn} ${flagged[current] ? styles.reviewBtnActive : ""}`} onClick={handleFlag}>
              <FaFlag />{flagged[current] ? "FLAGGED" : "MARK FOR REVIEW"}
            </button>
            <button className={styles.nextBtn} onClick={handleNext}>NEXT QUESTION →</button>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.questionPanel}>
            <div className={styles.questionPanelHeader}>
              <h2>Question<br />Panel</h2>
              <span>{current + 1} /<br />{totalQuestions}</span>
            </div>
            <div className={styles.lineDivider}></div>
            <div className={styles.questionGrid}>
              {questions.map((_, index) => {
                return (
                  <div key={index} className={getQuestionClass(index)} onClick={() => {}} style={{ cursor: "pointer" }}>
                    {index + 1}
                  </div>
                );
              })}
            </div>
            <div className={styles.legendBox}>
              <div><span className={styles.legendAnswered}></span>Answered</div>
              <div><span className={styles.legendReview}></span>Marked for Review</div>
              <div><span className={styles.legendUnanswered}></span>Unanswered</div>
            </div>
          </div>

          <div className={styles.submitBox}>
            <p>Please review all your answers before finishing the examination.</p>
            <button
              className={`${styles.submitBtn} ${!allAnswered ? styles.submitBtnDisabled : ""}`}
              onClick={handleSubmit}
            >
              SUBMIT EXAM
            </button>
          </div>

          <div className={styles.decorShapes}>
            <div className={styles.circle}></div>
            <div className={styles.square}></div>
            <div className={styles.diamond}></div>
          </div>
        </div>
      </div>

    </div>
  );
}