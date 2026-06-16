"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Alert from "../components/Alert";

import AudioQuestion from "../components/question_type_component/audio_question";
import BasicQuestion from "../components/question_type_component/basic_question";
import ImageQuestion from "../components/question_type_component/image_question";
import LongTextQuestion from "../components/question_type_component/long_text_question";
import TrueFalseQuestion from "../components/question_type_component/true_false_question";

const questionComponents = {
  audio: AudioQuestion,
  basic: BasicQuestion,
  image: ImageQuestion,
  long_text: LongTextQuestion,
  true_false: TrueFalseQuestion,
};

const questions = [
  {
    type: "audio",
    audioSrc: "/question_assets/audio/sample_audio.mp3",
    question: "What is the main topic of the conversation between the two students?",
    options: [
      "A. The schedule for the upcoming semester",
      "B. A research project on climate change",
      "C. Plans for a campus event next week",
      "D. The professor's grading policy",
    ],
  },
  {
    type: "long_text",
    passage:
      "Coral reefs are among the most diverse and biologically complex ecosystems on Earth. Often called the \"rainforests of the sea,\" they cover less than 1% of the ocean floor but support an estimated 25% of all marine species.",
    question:
      "According to the passage, what percentage of marine species do coral reefs support?",
    options: [
      "A. Less than 1%",
      "B. About 10%",
      "C. An estimated 25%",
      "D. More than 50%",
    ],
  },
  {
    type: "image",
    imageUrl: "/question_assets/photo/sample_image.png",
    question: "Based on the image, what can be inferred about the subject being presented?",
    options: [
      "A. It depicts an ancient manuscript from the medieval period",
      "B. It shows a modern academic reference book",
      "C. It illustrates a scientific journal from the 19th century",
      "D. It represents a government policy document",
    ],
  },
  {
    type: "basic",
    question: "Which of the following best completes the sentence: The committee _____ not yet reached a final decision.",
    options: [
      "A. have",
      "B. has",
      "C. having",
      "D. had been",
    ],
  },
  {
    type: "true_false",
    question: "When the meeting will start is still unknown.",
  },
];

export default function PracticePage() {
  const router = useRouter();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [alertConfig, setAlertConfig] = useState({
    show: false, text: "", isAlert: true, onOke: () => {},
  });

  const totalQuestions = questions.length;

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

  function handleFinish() {
    showAlert(
      "Yakin mau selesaikan practice? Pastikan semua soal sudah dijawab.",
      false,
      () => router.push("/dashboard/history")
    );
  }

  const q = questions[current];
  const QuestionComponent = questionComponents[q.type];

  return (
    <div className={styles.container}>

      {/* ===== ALERT ===== */}
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
          <p>Session: Listening Comprehension</p>
        </div>

        <div className={styles.headerRight}>
          <button className={styles.exitBtn} onClick={handleExit}>
            EXIT PRACTICE
          </button>
        </div>
      </div>

      <div className={styles.lineDivider}></div>

      {/* ===== PROGRESS BAR ===== */}
      <div className={styles.progressSection}>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${((current + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
        <span className={styles.progressLabel}>
          Question {String(current + 1).padStart(2, "0")} of {String(totalQuestions).padStart(2, "0")}
        </span>
      </div>

      {/* ===== CONTENT ===== */}
      <div className={styles.questionContainer}>
        <QuestionComponent
          {...q}
          questionNumber={current + 1}
          totalQuestions={totalQuestions}
          selectedAnswer={answers[current]}
          onAnswer={(val) => setAnswers(prev => ({ ...prev, [current]: val }))}
        />
      </div>

      {/* ===== NAVIGASI ===== */}
      <div className={styles.bottomActions}>

        <button
          className={styles.prevBtn}
          onClick={() => setCurrent(prev => Math.max(0, prev - 1))}
          disabled={current === 0}
        >
          ← PREVIOUS
        </button>

        {current < totalQuestions - 1 ? (
          <button
            className={styles.nextBtn}
            onClick={() => setCurrent(prev => prev + 1)}
          >
            NEXT QUESTION →
          </button>
        ) : (
          <button
            className={styles.finishBtn}
            onClick={handleFinish}
          >
            FINISH PRACTICE ✓
          </button>
        )}

      </div>

    </div>
  );
}