"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Alert from "../../components/Alert";
import SubmitLoadingModal from "../../components/SubmitLoadingModal";

import { FaClock, FaFlag } from "react-icons/fa";

import AudioQuestion from "../../components/question_type_component/audio_question";
import BasicQuestion from "../../components/question_type_component/basic_question";
import ImageQuestion from "../../components/question_type_component/image_question";
import LongTextQuestion from "../../components/question_type_component/long_text_question";
import TrueFalseQuestion from "../../components/question_type_component/true_false_question";
import LongAudioQuestion from "../../components/question_type_component/long_audio_question";

import { db } from "../../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { resetPlayedAudios } from "@/lib/audioTracker";

import questionsData from "../../../data/simulasi.json";

const questionComponents = {
  audio: AudioQuestion,
  basic: BasicQuestion,
  image: ImageQuestion,
  long_text: LongTextQuestion,
  true_false: TrueFalseQuestion,
  long_audio: LongAudioQuestion,
};

const MAX_REAL_QUESTIONS = 36;

export default function ListeningPage() {
  const router = useRouter();

  const [questions, setQuestions]     = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime]                   = useState(() => Date.now());

  const [userId, setUserId]           = useState("");
  const [sessionId, setSessionId]     = useState("");

  const [current, setCurrent]         = useState(0);
  const [answers, setAnswers]         = useState({});
  const [flagged, setFlagged]         = useState({});
  const [submitError, setSubmitError] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    show: false, text: "", isAlert: true, onOke: () => {},
  });

  const [timeUpAlertShown, setTimeUpAlertShown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); 

  const [visitedLongAudio, setVisitedLongAudio] = useState({});

  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    resetPlayedAudios();
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId("guest");
      }

      let currentSessionId = sessionStorage.getItem("current_exam_session");
      if (!currentSessionId) {
        currentSessionId = "session_" + new Date().getTime() + "_" + Math.random().toString(36).substring(2, 9);
        sessionStorage.setItem("current_exam_session", currentSessionId);
      }
      setSessionId(currentSessionId);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isSubmitting) {
        e.preventDefault();
        e.returnValue = "Dilarang me-refresh halaman saat prediction sedang berlangsung! Progres ujian Anda dapat hilang.";
        return e.returnValue;
      }
    };

    const handleKeyDown = (e) => {
      if (
        e.key === "F5" ||
        (e.key.toLowerCase() === "r" && (e.ctrlKey || e.metaKey))
      ) {
        e.preventDefault();
        showAlert(
          "Dilarang me-refresh halaman saat prediction sedang berlangsung! Selesaikan sesi ini atau klik Exit jika ingin keluar.",
          true
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSubmitting]);

  useEffect(() => {
    try {
      let listeningSession = null;
      if (Array.isArray(questionsData)) {
        listeningSession = questionsData.find(item => item.session_id === "Listening");
      } else if (questionsData.session_id === "Listening") {
        listeningSession = questionsData;
      }

      if (listeningSession && listeningSession.questions) {
        let shortAudios = [];
        let longAudios = [];
        let others = [];

        listeningSession.questions.forEach((q) => {
          if (q.type === "ShortAudio" && Array.isArray(q.options)) {
            q.options.forEach((subQ) => {
              shortAudios.push({
                ...q,
                type: "audio", 
                question: subQ.question || "Listen to the audio and choose the correct answer.",
                audioSrc: subQ.audio ? `/audio/${subQ.audio}` : null, 
                options: subQ.option || [], 
                correctIndex: subQ.index_answer !== undefined ? parseInt(subQ.index_answer) : null,
                correctAnswer: (subQ.option && subQ.index_answer !== undefined) ? subQ.option[parseInt(subQ.index_answer)] : null
              });
            });
          } 
          else if (q.type === "LongAudio" && Array.isArray(q.options)) {
            longAudios.push({
              ...q,
              type: "long_audio",
              audioSrc: q.audio ? `/audio/${q.audio}` : null,
            });

            q.options.forEach((subQ) => {
              longAudios.push({
                ...q,
                type: "audio",
                question: subQ.question || "Listen to the audio and choose the correct answer.",
                audioSrc: subQ.audio ? `/audio/${subQ.audio}` : null, 
                options: subQ.option || [], 
                correctIndex: subQ.index_answer !== undefined ? parseInt(subQ.index_answer) : null,
                correctAnswer: (subQ.option && subQ.index_answer !== undefined) ? subQ.option[parseInt(subQ.index_answer)] : null
              });
            });
          } 
          else {
            let mappedType = q.type;
            if (mappedType === "TrueOrFalse") mappedType = "true_false";
            if (mappedType === "FillInTheBlank" || mappedType === "MultipleChoice") mappedType = "basic";

            let flatOptions = q.options || [];
            let correctAns = q.correct_answer !== undefined ? q.correct_answer : (q.answer !== undefined ? q.answer : null);
            let correctIdx = q.index_answer !== undefined ? parseInt(q.index_answer) : null;

            others.push({
              ...q,
              type: mappedType,
              options: flatOptions,
              correctAnswer: correctAns,
              correctIndex: correctIdx,
            });
          }
        });

        const realInLong = longAudios.filter(q => q.type !== "long_audio").length;
        const realInOthers = others.filter(q => q.type !== "long_audio").length;
        
        let neededShorts = MAX_REAL_QUESTIONS - realInLong - realInOthers;
        if (neededShorts < 0) neededShorts = 0; 

        let selectedShorts = shortAudios;
        if (shortAudios.length > neededShorts) {
          selectedShorts = shuffleArray(shortAudios).slice(0, neededShorts);
        }

        let normalizedQuestions = [...selectedShorts, ...longAudios, ...others];

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

  useEffect(() => {
    if (questions.length > 0 && questions[current]?.type === "long_audio") {
      setVisitedLongAudio(prev => ({ ...prev, [current]: true }));
    }
  }, [current, questions]);

  useEffect(() => {
    if (isLoading || questions.length === 0) return;

    if (timeLeft <= 0 && !timeUpAlertShown) {
      setTimeUpAlertShown(true);
      handleTimeUp();
      return;
    }
    
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timeLeft, isLoading, questions.length, timeUpAlertShown]);

  const totalQuestions = questions.length;
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

  function getNextIndex(fromIndex) {
    let nextIndex = fromIndex + 1;
    while (nextIndex < totalQuestions && questions[nextIndex].type === "long_audio" && visitedLongAudio[nextIndex]) {
      nextIndex++;
    }
    return Math.min(totalQuestions - 1, nextIndex);
  }

  const checkIfAllAnswered = () => {
    return questions.every((q, i) => {
      if (q.type === "long_audio") return true;
      return answers[i] !== undefined;
    });
  };

  const allAnswered = checkIfAllAnswered();

  const saveDataToFirebase = async () => {
    if (!sessionId) return; 

    const maxDuration = 25 * 60; // 25 minutes limit
    const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
    const timeSpent = Math.min(maxDuration, Math.max(1, elapsedSeconds));
    let correctCount = 0;
    let answeredCount = 0;

    questions.forEach((q, index) => {
      if (q.type === "long_audio") return;
      const ans = answers[index];
      if (ans !== undefined && ans !== null && String(ans).trim() !== "") {
        answeredCount++;
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
      await setDoc(doc(db, "exam_sessions", sessionId), {
        userId: userId, 
        listening_time_left: timeLeft,
        listening_time_spent: timeSpent,
        listening_correct_answers: correctCount,
        listening_answered_questions: answeredCount,
        listening_total_questions: totalQ,
        listening_score_percentage: scorePercentage,
        updatedAt: new Date()
      }, { merge: true });
      console.log(`Skor Listening (${timeSpent}s) disimpan ke Session ID: ${sessionId}`);
    } catch (error) {
      console.error("Gagal menyimpan data ke Firebase: ", error);
    }
  };

  const handleTimeUp = () => {
    showAlert(
      "Waktu pengerjaan sesi ini telah habis! Jawaban Anda telah disimpan otomatis.",
      true, 
      async () => {
        setIsSubmitting(true);
        try {
          await saveDataToFirebase();
          router.push("/prediction_rule/structure");
        } finally {
          setIsSubmitting(false);
        }
      }
    );
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
        setIsSubmitting(true);
        try {
          await saveDataToFirebase();
          router.push("/prediction_rule/structure");
        } finally {
          setIsSubmitting(false);
        }
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
            <h1>TOEFL Exam Prediction</h1>
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
          
            onNextQuestion={() => setCurrent(getNextIndex(current))}
            isLastQuestion={current === totalQuestions - 1}
          />
        </div>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <SubmitLoadingModal isOpen={isSubmitting} message="Memproses dan menyimpan jawaban Sesi Listening..." />
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
          <h1>TOEFL Exam Prediction</h1>
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
  
            <button 
              className={styles.nextBtn} 
              onClick={() => setCurrent(getNextIndex(current))} 
              disabled={current === totalQuestions - 1 || getNextIndex(current) === current}
            >
              NEXT QUESTION →
            </button>
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