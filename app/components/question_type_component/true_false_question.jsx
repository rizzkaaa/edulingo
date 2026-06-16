import styles from "./true_false_question.module.css";
import shared from "./shared.module.css";

export default function TrueFalseQuestion({ questionNumber, totalQuestions, question, onAnswer, selectedAnswer }) {
  const options = [
    { label: "A. True", value: true },
    { label: "B. False", value: false },
  ];

  return (
    <div className={shared.wrapper}>
      <div className={styles.questionSection}>
        <span className={shared.questionLabel}>
          QUESTION {questionNumber} OF {totalQuestions}
        </span>

        <h2 className={shared.questionText}>{question}</h2>

        <div className={shared.options}>
          {options.map((opt, i) => {
            const isSelected = selectedAnswer !== undefined && selectedAnswer === opt.value;
            return (
              <button
                key={i}
                className={`${shared.option} ${isSelected ? shared.optionSelected : ""}`}
                onClick={() => {
                  if (selectedAnswer === opt.value) {
                    onAnswer(undefined);
                  } else {
                    onAnswer(opt.value);
                  }
                }}
              >
                <span className={`${shared.radio} ${isSelected ? shared.radioSelected : ""}`}>
                  {isSelected && <span className={shared.radioFill} />}
                </span>
                <span className={`${shared.optionText} ${isSelected ? shared.optionTextSelected : ""}`}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}