import styles from "./long_text_question.module.css";
import shared from "./shared.module.css";

export default function LongTextQuestion({ questionNumber, totalQuestions, passage, question, options, onAnswer, selectedAnswer }) {
  return (
    <div className={shared.wrapper}>

      {/* ===== PASSAGE SECTION ===== */}
      <div className={shared.mediaSection}>
        <div className={styles.passageHeader}>
          <span className={styles.passageIcon}>📖</span>
          <span className={styles.passageLabel}>READING REFERENCE</span>
        </div>
        <div className={styles.passageBorder}>
          <p className={styles.passageText}>{passage}</p>
        </div>
      </div>

      {/* ===== QUESTION SECTION ===== */}
      <div className={shared.questionSection}>
        <span className={shared.questionLabel}>
          QUESTION {questionNumber} OF {totalQuestions}
        </span>

        <h2 className={shared.questionText}>{question}</h2>

        <div className={shared.options}>
          {options.map((opt, i) => (
            <button
              key={i}
              className={`${shared.option} ${selectedAnswer === i ? shared.optionSelected : ""}`}
              onClick={() => {
                if(selectedAnswer === i){
                  onAnswer(undefined);
                }else{
                  onAnswer(i);
                }
              }}
            >
              <span className={`${shared.radio} ${selectedAnswer === i ? shared.radioSelected : ""}`}>
                {selectedAnswer === i && <span className={shared.radioFill} />}
              </span>
              <span className={`${shared.optionText} ${selectedAnswer === i ? shared.optionTextSelected : ""}`}>
                {opt}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}