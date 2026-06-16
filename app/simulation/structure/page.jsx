"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Alert from "../../components/Alert";

import { FaClock, FaFlag } from "react-icons/fa";

import AudioQuestion from "../../components/question_type_component/audio_question";
import BasicQuestion from "../../components/question_type_component/basic_question";
import ImageQuestion from "../../components/question_type_component/image_question";
import LongTextQuestion from "../../components/question_type_component/long_text_question";
import TrueFalseQuestion from "../../components/question_type_component/true_false_question";

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
    passage: "Coral reefs are among the most diverse and biologically complex ecosystems on Earth. Often called the \"rainforests of the sea,\" they cover less than 1% of the ocean floor but support an estimated 25% of all marine species. Reefs are built by colonies of tiny animals called polyps, which secrete a hard calcium carbonate skeleton. Unfortunately, these vital ecosystems are currently facing severe threats from climate change, ocean acidification, and destructive fishing practices.",
    question: "According to the passage, what is the primary factor reshaping our understanding of language acquisition in the digital age?",
    options: [
      "A. The increased global distribution of physical textbooks",
      "B. The integration of traditional methods with computational models",
      "C. The complete elimination of curricula based on classical theories",
      "D. A general decline in language learning interest among teenagers",
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
    question: "The subject and verb must always agree in number in a sentence.",
  },
];

export default function StructurePage() {
  const router = useRouter();

  const [current, setCurrent]         = useState(0);
  const [answers, setAnswers]         = useState({});
  const [flagged, setFlagged]         = useState({});
  const [submitError, setSubmitError] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    show: false, text: "", isAlert: true, onOke: () => {},
  });

  const totalQuestions = questions.length;
  const allAnswered = questions.every((_, i) => answers[i] !== undefined);

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
      const firstUnanswered = questions.findIndex((_, i) => answers[i] === undefined);
      if (firstUnanswered !== -1) setCurrent(firstUnanswered);
      return;
    }
    showAlert(
      "Sudah yakin mau submit? Jawaban tidak bisa diubah setelah submit.",
      false,
      () => router.push("/simulation_rule/reading")
    );
  }

  function handleFlag() {
    setFlagged(prev => ({ ...prev, [current]: !prev[current] }));
  }

  function getQuestionClass(index) {
    if (index === current)            return styles.activeQuestion;
    if (flagged[index])               return styles.reviewQuestion;
    if (answers[index] !== undefined) return styles.answeredQuestion;
    return styles.unansweredQuestion;
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
          <div className={styles.timerBox}><FaClock />15:00</div>
          <button className={styles.exitBtn} onClick={handleExit}>EXIT SESSION</button>
        </div>
      </div>

      <div className={styles.lineDivider}></div>

      <div className={styles.contentLayout}>
        <div className={styles.leftSection}>
          <div className={styles.questionContainer}>
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
          </div>

          <div className={styles.bottomActions}>
            <button className={styles.prevBtn} onClick={() => setCurrent(prev => Math.max(0, prev - 1))} disabled={current === 0}>← PREVIOUS</button>
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
              <span>{current + 1} /<br />{totalQuestions}</span>
            </div>
            <div className={styles.lineDivider}></div>
            <div className={styles.questionGrid}>
              {questions.map((_, index) => (
                <div key={index} className={getQuestionClass(index)} onClick={() => setCurrent(index)} style={{ cursor: "pointer" }}>
                  {index + 1}
                </div>
              ))}
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