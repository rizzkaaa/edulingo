"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import Alert from "../components/Alert";
import { db, auth } from "@/lib/firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import allQuestionsData from "@/data/questions.json"; 

import AudioQuestion from "../components/question_type_component/audio_question";
import BasicQuestion from "../components/question_type_component/basic_question";
import ImageQuestion from "../components/question_type_component/image_question";
import LongTextQuestion from "../components/question_type_component/long_text_question";
import TrueFalseQuestion from "../components/question_type_component/true_false_question";
import LongAudioQuestion from "../components/question_type_component/long_audio_question";

const questionComponents = {
  audio: AudioQuestion,
  basic: BasicQuestion,
  image: ImageQuestion,
  long_text: LongTextQuestion,
  true_false: TrueFalseQuestion,
  long_audio: LongAudioQuestion,
  FillInTheBlank: BasicQuestion,
  LongReading: LongTextQuestion,
  ShortAudio: AudioQuestion, 
};

export default function PracticePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const moduleParam = searchParams.get("module") || "1_5";
  const folderParam = searchParams.get("folder"); 
  const partParam = searchParams.get("part"); 

  const targetModule = allQuestionsData.find((m) => m.module_id === moduleParam);
  const categoryParam = targetModule?.category_id || "structure_part_1"; 
  const rawQuestions = targetModule ? targetModule.questions : [];

  const questions = [];

  rawQuestions.forEach((item) => {
    // 1. LOGIKA UNTUK AUDIO (LONG AUDIO / SHORT AUDIO)
    if (item.type === "LongAudio" || item.type === "ShortAudio") {
      if (item.type === "LongAudio") {
        questions.push({
          ...item,
          type: "long_audio",
          audioSrc: item.audio ? `/audio/${item.audio}` : null,
        });
      }

      item.options.forEach((subQ) => {
        questions.push({
          ...item, 
          type: "audio", 
          question: subQ.question || "Listen and choose the answer.",
          audioSrc: subQ.audio ? `/audio/${subQ.audio}` : null,
          options: subQ.option, 
          index_answer: subQ.index_answer
        });
      });
    } 
    // 2. LOGIKA BARU: UNTUK LONG READING (Memecah teks intro & anak soal)
    else if (item.type === "LongReading") {
      questions.push({
        ...item,
        type: "reading_intro",
      });

      item.options.forEach((subQ) => {
        questions.push({
          ...item,
          type: "basic", 
          question: subQ.question || "Read the text and choose the correct answer.",
          options: subQ.option, 
          index_answer: subQ.index_answer
        });
      });
    }
    // 3. LOGIKA UNTUK TIPE SOAL LAIN (BASIC, IMAGE, TRUE_FALSE, DLL)
    else {
      let finalOptions = item.options;
      let finalIndexAnswer = item.index_answer;

      if (Array.isArray(item.options) && item.options.length > 0 && typeof item.options[0] === "object") {
        if ("option" in item.options[0]) {
          finalOptions = item.options[0].option; 
          if ("index_answer" in item.options[0]) {
            finalIndexAnswer = item.options[0].index_answer;
          }
        }
      }
      else if (item.options && typeof item.options === "object" && !Array.isArray(item.options)) {
        if ("option" in item.options) {
          finalOptions = item.options.option;
          if ("index_answer" in item.options) {
            finalIndexAnswer = item.options.index_answer;
          }
        }
      }

      questions.push({
        ...item,
        type: item.type === "TrueOrFalse" ? "true_false" : item.type,
        options: finalOptions,
        index_answer: finalIndexAnswer
      });
    }
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [alertConfig, setAlertConfig] = useState({
    show: false, text: "", isAlert: true, onOke: () => {},
  });

  const totalQuestions = questions.length;

  if (totalQuestions === 0) {
    return (
      <div className={styles.container} style={{ textAlign: "center", padding: "50px" }}>
        <h2>Mempersiapkan soal latihan... 🔍</h2>
        <p>Jika tidak berpindah, pastikan data soal dengan module_id: "{moduleParam}" tersedia di JSON.</p>
      </div>
    );
  }

  const realQuestionsCount = questions.reduce((acc, q) => {
    if (q.type === "long_audio" || q.type === "reading_intro") return acc;
    return acc + 1;
  }, 0);

  function getRealQuestionNumber(index) {
    let count = 0;
    for (let i = 0; i <= index; i++) {
      if (questions[i] && questions[i].type !== "long_audio" && questions[i].type !== "reading_intro") {
        count++;
      }
    }
    return count;
  }

  function getPrevIndex(fromIndex) {
    let prevIndex = fromIndex - 1;
    while (prevIndex >= 0 && questions[prevIndex]?.type === "long_audio") {
      prevIndex--;
    }
    return prevIndex;
  }

  function showAlert(text, isAlert = true, onOke = () => {}) {
    setAlertConfig({ show: true, text, isAlert, onOke });
  }

  function closeAlert() {
    setAlertConfig(prev => ({ ...prev, show: false }));
  }

  function handleExit() {
    showAlert(
      "Yakin ingin keluar? Progress practice akan hilang.",
      false,
      () => router.back()
    );
  }

  async function saveResultsToFirebase() {
    setIsSubmitting(true);
    try {
      let correctAnswersCount = 0;

      questions.forEach((question, index) => {
        if (question.type !== "long_audio" && question.type !== "reading_intro") {
          const userAnswer = answers[index];
          const correctIndex = question.index_answer;
          
          if (userAnswer !== undefined && correctIndex !== undefined) {
            if (typeof userAnswer === "boolean") {
              const booleanToNumber = userAnswer ? 0 : 1; 
              if (String(booleanToNumber) === String(correctIndex)) {
                correctAnswersCount++;
              }
            } 
            else if (question.options && String(userAnswer) === String(question.options[correctIndex])) {
              correctAnswersCount++;
            }
            else if (String(userAnswer) === String(correctIndex)) {
              correctAnswersCount++;
            }
          }
        }
      });

      const finalScore = realQuestionsCount > 0 
        ? Math.round((correctAnswersCount / realQuestionsCount) * 100) 
        : 0;

      const sanitizedAnswers = {}; 
      questions.forEach((_, index) => {
        const userAns = answers[index];
        sanitizedAnswers[index] = userAns !== undefined ? userAns : null;
      });

      const isListening = 
        categoryParam.toLowerCase().includes("listening") || 
        (partParam && partParam.toLowerCase().includes("listening")) ||
        moduleParam.toLowerCase().includes("listening");

      const PASSING_THRESHOLD = isListening ? 3 : 4;
      const isPassed = correctAnswersCount >= PASSING_THRESHOLD;

      const practiceResult = {
        userId: auth?.currentUser?.uid || "anonymous_user", 
        userEmail: auth?.currentUser?.email || "anonymous",
        moduleId: moduleParam || "unknown_module",
        categoryId: partParam || categoryParam || "structure_part_1", 
        totalQuestions: realQuestionsCount || 0,
        correctAnswers: correctAnswersCount || 0,
        score: finalScore || 0,
        userAnswers: sanitizedAnswers, // ← Menggunakan variabel yang sudah benar
        isPassed: isPassed,
        createdAt: serverTimestamp(), 
      };

      await addDoc(collection(db, "practice_history"), practiceResult);
      
      const finalCategory = targetModule?.category_id || partParam || categoryParam;
      const finalFolder = targetModule?.folder_name || folderParam || moduleParam;

      if (isPassed) {
        window.dispatchEvent(new Event("practice-completed")); 
        showAlert(
          `Luar Biasa! 🎉 Kamu menjawab benar ${correctAnswersCount} dari ${realQuestionsCount} soal. Modul ini telah selesai.`,
          true, 
          () => router.push(`/dashboard/lesson/${finalCategory}/${finalFolder}?status=completed`)
        );
      } else {
        showAlert(
          `Kamu baru menjawab benar ${correctAnswersCount} soal. ❌ Butuh minimal ${PASSING_THRESHOLD} jawaban benar untuk menyelesaikan modul ini. Silakan coba lagi!`,
          true, 
          () => router.push(`/dashboard/lesson/${finalCategory}/${finalFolder}?status=failed`)
        );
      }

    } catch (error) {
      console.error("Gagal menyimpan ke Firebase:", error);
      showAlert("Waduh, gagal menyimpan hasil latihan. Coba lagi, yuk!");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleFinish() {
    showAlert(
      "Yakin mau selesaikan practice? Pastikan semua soal sudah dijawab.",
      false,
      () => saveResultsToFirebase() 
    );
  }

  const formatModuleName = (str) => {
    if (!str) return "";
    return str
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const q = questions[current];
  const QuestionComponent = questionComponents[q?.type];
  const [isAudioFinished, setIsAudioFinished] = useState(false);

  // 🌟 VALIDASI JAWABAN: Tombol aktif jika tipe halaman adalah 'reading_intro' ATAU user sudah memilih jawaban
  const isQuestionAnswered = q?.type === "reading_intro" || (answers[current] !== undefined && answers[current] !== null);

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
            <h1>TOEFL Practice</h1>
            <div className={styles.line}></div>
            <p>Module: {formatModuleName(moduleParam)}</p>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.exitBtn} onClick={handleExit} disabled={isSubmitting}>
              EXIT PRACTICE
            </button>
          </div>
        </div>
        <LongAudioQuestion
          {...q}
          answers={answers}
          parentIndex={current}
          onNextQuestion={() => setCurrent(prev => prev + 1)}
          isLastQuestion={current === totalQuestions - 1}
          onAudioFinish={() => setIsAudioFinished(true)} 
        />

        {isAudioFinished && (
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button
              className={styles.nextBtn} 
              onClick={() => {
                setIsAudioFinished(false); 
                setCurrent(prev => prev + 1);
              }}
            >
              PROCEED TO QUESTIONS →
            </button>
          </div>
        )}
      </div>
    );
  }

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

      {/* ===== HEADER ===== */}
      <div className={styles.headerSection}>
        <div>
          <h1>TOEFL Practice</h1>
          <div className={styles.line}></div>
          <p>Module: {formatModuleName(moduleParam)}</p>
        </div>

        <div className={styles.headerRight}>
          <button className={styles.exitBtn} onClick={handleExit} disabled={isSubmitting}>
            EXIT PRACTICE
          </button>
        </div>
      </div>

      {/* ===== PROGRESS BAR ===== */}
      <div className={styles.progressSection}>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${(getRealQuestionNumber(current) / realQuestionsCount) * 100}%` }}
          ></div>
        </div>
        <span className={styles.progressLabel}>
          Progress Tracker (Est. Questions Count)
        </span>
      </div>

      {/* ===== CONTENT ===== */}
      <div className={styles.questionContainer}>
        {q?.type === "reading_intro" ? (
          <div style={{ backgroundColor: "#fdfdfd", padding: "30px", borderRadius: "8px", border: "2px solid #a34327" }}>
            <h3 style={{ color: "#a34327", marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px", textTransform: "uppercase" }}>
              📖 Please read the text below before proceeding
            </h3>
            <div style={{ fontSize: "16px", lineHeight: "1.8", color: "#333", whiteSpace: "pre-wrap" }}>
              {q.long_text || q.passage || q.text || q.paragraph || q.question || "Teks bacaan tidak tersedia."}
            </div>
          </div>
        ) : QuestionComponent ? (
          <QuestionComponent
            {...q}
            questionNumber={getRealQuestionNumber(current)}
            totalQuestions={realQuestionsCount}
            selectedAnswer={answers[current]}
            onAnswer={(val) => setAnswers(prev => ({ ...prev, [current]: val }))}
          />
        ) : (
          <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
            Tipe komponen soal "{q?.type}" tidak ditemukan atau gagal dimuat.
          </div>
        )}
      </div>

      {/* ===== NAVIGASI ===== */}
      <div className={styles.bottomActions}>
        {/* Tombol PREVIOUS: Selalu aktif selama bukan soal pertama (tidak bergantung jawaban) */}
        <button
          className={styles.prevBtn}
          onClick={() => setCurrent(getPrevIndex(current))}
          disabled={getPrevIndex(current) < 0 || isSubmitting}
        >
          ← PREVIOUS
        </button>

        {current < totalQuestions - 1 ? (
          /* Tombol NEXT: Ditambahkan logika disabled={!isQuestionAnswered} */
          <button
            className={styles.nextBtn}
            onClick={() => setCurrent(prev => prev + 1)}
            disabled={!isQuestionAnswered || isSubmitting}
          >
            {q?.type === "reading_intro" ? "PROCEED TO QUESTIONS →" : "NEXT QUESTION →"}
          </button>
        ) : (
          /* Tombol FINISH: Ditambahkan logika disabled={!isQuestionAnswered} */
          <button
            className={styles.finishBtn}
            onClick={handleFinish}
            disabled={!isQuestionAnswered || isSubmitting}
          >
            {isSubmitting ? "STORING DATA..." : "FINISH PRACTICE LIGHT ✓"}
          </button>
        )}
      </div>
    </div>
  );
}