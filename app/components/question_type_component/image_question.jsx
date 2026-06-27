import styles from "./image_question.module.css";
import shared from "./shared.module.css";
import Image from "next/image";

export default function ImageQuestion({ questionNumber, totalQuestions, imageUrl, question, options, onAnswer, selectedAnswer }) {
  return (
    <div className={shared.wrapper}>
      <div className={shared.mediaSection}>
        <div className={styles.imageBox}>
          <Image
            src={imageUrl}
            alt="Question image"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
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