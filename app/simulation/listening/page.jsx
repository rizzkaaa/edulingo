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
import LongAudioQuestion from "../../components/question_type_component/long_audio_question";

import { db } from "../../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

import simulasiData from "../../../data/simulasi.json";

const questionComponents = {
  audio: AudioQuestion,
  basic: BasicQuestion,
  image: ImageQuestion,
  long_text: LongTextQuestion,
  true_false: TrueFalseQuestion,
  long_audio: LongAudioQuestion,
};

const MAX_QUESTIONS = 36;

export default function ListeningPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId]       = useState("");

  const [current, setCurrent]         = useState(0);
  const [answers, setAnswers]         = useState({});
  const [flagged, setFlagged]         = useState({});
  const [submitError, setSubmitError] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    show: false, text: "", isAlert: true, onOke: () => {},
  });

  const [timeLeft, setTimeLeft] = useState(25 * 60);

  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Ambil ID user yang sedang login
  useEffect(() => {
    let loggedInUser = localStorage.getItem("user_id") || sessionStorage.getItem("user_id");

    if (loggedInUser) {
      setUserId(loggedInUser);
    } else {
      console.warn("Data login tidak ditemukan. Menggunakan ID Guest sementara.");
      let storedId = sessionStorage.getItem("toefl_guest_id");
      if (!storedId) {
        storedId = "guest_" + Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem("toefl_guest_id", storedId);
      }
      setUserId(storedId);
    }
  }, []);

  // Load soal Listening dari JSON, Normalisasi, Acak, Batasi MAX_QUESTIONS
  useEffect(() => {
    try {
      let listeningSession = null;
      if (Array.isArray(simulasiData)) {
        listeningSession = simulasiData.find(item => item.session_id === "Listening");
      } else if (simulasiData.session_id === "Listening") {
        listeningSession = simulasiData;
      }

      if (listeningSession && listeningSession.questions) {

        let normalizedQuestions = listeningSession.questions.map((q) => {
          let mappedType = q.type;

          if (mappedType === "TrueOrFalse") mappedType = "true_false";
          if (mappedType === "FillInTheBlank" || mappedType === "MultipleChoice") mappedType = "basic";
          if (mappedType === "LongAudio") mappedType = "long_audio";
          if (mappedType === "Audio") mappedType = "audio";

          let flatOptions = q.options || [];
          let correctAns = q.correct_answer !== undefined ? q.correct_answer : (q.answer !== undefined ? q.answer : null);
          let correctIdx = q.index_answer !== undefined ? parseInt(q.index_answer) : null;

          if (Array.isArray(q.options) && q.options.length > 0) {
            if (q.options[0] && typeof q.options[0] === 'object' && q.options[0].option) {
              flatOptions = q.options[0].option;
              const idx2 = q.options[0].index_answer;
              if (idx2 !== undefined && idx2 !== null) {
                correctIdx = parseInt(idx2);
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
            correctIndex: correctIdx,
          };
        });

        if (normalizedQuestions.length > MAX_QUESTIONS) {
          normalizedQuestions = shuffleArray(normalizedQuestions).slice(0, MAX_QUESTIONS);
        }

        setQuestions(normalizedQuestions);
      } else {
        console.error("Data Listening session tidak ditemukan di file simulasi.json");
      }
    } catch (error) {
      console.error("Gagal memproses data soal:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isLoading || questions.length === 0) return;

    const timerId = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [isLoading, questions.length]);

  useEffect(() => {
    if (timeLeft === 0 && !isLoading && questions.length > 0) {
      handleTimeUp();
    }
  }, [timeLeft, isLoading, questions.length]);

  const totalQuestions = questions.length;

  // Total soal "asli" — tidak menghitung long_audio sebagai soal
  const realQuestionsCount = questions.filter(q => q.type !== "long_audio").length;

  function getRealQuestionNumber(index) {
    let count = 0;
    for (let i = 0; i <= index; i++) {
      if (questions[i].type !== "long_audio") count++;
    }
    return count;
  }

  function getPrevIndex(fromIndex) {
    let prevIndex = fromIndex - 1;
    while (prevIndex >= 0 && questions[prevIndex].type === "long_audio") {
      prevIndex--;
    }
    return prevIndex;
  }

  const checkIfAllAnswered = () => {
    return questions.every((q, i) => {
      if (q.type === "long_audio") return true;
      return answers[i] !== undefined;
    });
  };

  const allAnswered = checkIfAllAnswered();

  // Simpan skor ke Firebase
  const saveDataToFirebase = async () => {
    if (!userId) return;

    const timeSpent = (25 * 60) - timeLeft;
    let correctCount = 0;

    questions.forEach((q, index) => {
      if (q.type === "long_audio") return;
      const ans = answers[index];
      if (ans !== undefined) {
        let isCorrect = false;

        if (q.correctAnswer !== null && ans === q.correctAnswer) isCorrect = true;
        if (q.correctIndex !== null && (ans === q.correctIndex || String(ans) === String(q.correctIndex))) isCorrect = true;
        if (typeof ans === 'string' && typeof q.correctAnswer === 'string' &&
            ans.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) isCorrect = true;

        if (isCorrect) correctCount++;
      }
    });

    const totalQ = realQuestionsCount;
    const scorePercentage = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;

    try {
      await setDoc(doc(db, "exam_sessions", userId), {
        listening_time_left: timeLeft,
        listening_time_spent: timeSpent,
        listening_correct_answers: correctCount,
        listening_total_questions: totalQ,
        listening_score_percentage: scorePercentage,
        updatedAt: new Date()
      }, { merge: true });
      console.log(`Skor Listening berhasil disimpan ke Akun Login ID: ${userId}`);
    } catch (error) {
      console.error("Gagal menyimpan data ke Firebase: ", error);
    }
  };

  const handleTimeUp = async () => {
    await saveDataToFirebase();
    router.push("/simulation_rule/structure");
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

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
    if (!allAnswered) {
      setSubmitError(true);
      const firstUnanswered = questions.findIndex((q, i) => {
        if (q.type === "long_audio") return false;
        return answers[i] === undefined;
      });
      if (firstUnanswered !== -1) setCurrent(firstUnanswered);
      return;
    }
    showAlert(
      "Sudah yakin mau submit? Jawaban tidak bisa diubah setelah submit.",
      false,
      async () => {
        await saveDataToFirebase();
        router.push("/simulation_rule/structure");
      }
    );
  }

  function handleFlag() {
    setFlagged(prev => ({ ...prev, [current]: !prev[current] }));
  }

  function getQuestionClass(index) {
    if (index === current) return styles.activeQuestion;
    if (flagged[index]) return styles.reviewQuestion;

    const targetQuestion = questions[index];
    if (targetQuestion.type === "long_audio") return styles.unansweredQuestion;

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

  // ==========================================
  // VIEW KHUSUS LAYOUT LONG_AUDIO
  // ==========================================
  if (q && q.type === "long_audio") {
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
            <p>Session: Listening</p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.timerBox}><FaClock />{formatTime(timeLeft)}</div>
            <button className={styles.exitBtn} onClick={handleExit}>EXIT SESSION</button>
          </div>
        </div>

        <div className={styles.lineDivider}></div>

        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 48px" }}>
          <LongAudioQuestion
            {...q}
            answers={answers}
            parentIndex={current}
            onAnswer={() => {}}
            onNextQuestion={() => setCurrent(prev => Math.min(totalQuestions - 1, prev + 1))}
            isLastQuestion={current === totalQuestions - 1}
          />
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW NORMAL
  // ==========================================
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
          <p>Session: Listening</p>
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
            {QuestionComponent && (
              <QuestionComponent
                {...q}
                questionNumber={getRealQuestionNumber(current)}
                totalQuestions={realQuestionsCount}
                selectedAnswer={answers[current]}
                onAnswer={(val) => {
                  setAnswers(prev => ({ ...prev, [current]: val }));
                  setSubmitError(false);
                }}
              />
            )}
          </div>

          <div className={styles.bottomActions}>
            <button
              className={styles.prevBtn}
              onClick={() => setCurrent(getPrevIndex(current))}
              disabled={getPrevIndex(current) < 0}
            >
              ← PREVIOUS
            </button>
            <button className={`${styles.reviewBtn} ${flagged[current] ? styles.reviewBtnActive : ""}`} onClick={handleFlag}>
              <FaFlag />{flagged[current] ? "FLAGGED" : "MARK FOR REVIEW"}
            </button>
            <button className={styles.nextBtn} onClick={() => setCurrent(prev => Math.min(totalQuestions - 1, prev + 1))} disabled={current === totalQuestions - 1}>NEXT QUESTION →</button>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.questionPanel}>
            <div className={styles.questionPanelHeader}>
              <h2>Question<br />Panel</h2>
              <span>{getRealQuestionNumber(current)} /<br />{realQuestionsCount}</span>
            </div>
            <div className={styles.lineDivider}></div>
            <div className={styles.questionGrid}>
              {questions.map((item, index) => {
                if (item.type === "long_audio") return null;

                return (
                  <div
                    key={index}
                    className={getQuestionClass(index)}
                    onClick={() => setCurrent(index)}
                    style={{ cursor: "pointer" }}
                  >
                    {getRealQuestionNumber(index)}
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
            {submitError && (
              <p className={styles.submitError}>⚠ Jawab semua soal terlebih dahulu sebelum submit!</p>
            )}
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