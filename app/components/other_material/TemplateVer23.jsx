import styles from "./TemplateVer23.module.css";
import BorderLeftBox from "../BorderLeftBox";
import {
  LuMessageCircleQuestion,
  LuNotebookText,
  LuLightbulb,
} from "react-icons/lu";
import SmallShadowBorder from "../SmallShadowBorder";
import BoxList from "../BoxList";
import ColorBorderShadow from "../ColorBorderShadow";
import LabelValueMaterial from "../LabelValueMaterial";

export default function TemplateVer23({ material }) {
  const huruf = ["A", "B", "C", "D"];

  return (
    <SmallShadowBorder backgroundColor={"#fdfaf5"} className={styles.container}>
      <h3>
        {material.title} <LuMessageCircleQuestion />
      </h3>
      <p className={styles.definition}>{material.definition}</p>
      <div className="splitTwo">
        {material.examples.map((example, i) => {
          return (
            <div className={`${styles.example} ${styles.box}`} key={i}>
              <h5>
                EXAMPLE {i + 1}: {example.category}
              </h5>
              <div>
                {example.options.map((item, j) => (
                  <p key={j}>
                    <span>({huruf[j]})</span> <span>{item}</span>
                  </p>
                ))}
              </div>
              <SmallShadowBorder backgroundColor={"white"} className={styles.predicted}>
                <h5>THE QUESTION WILL PROBABLY BE...</h5>
                <p>"{example.predicted_question}"</p>
              </SmallShadowBorder>
            </div>
          );
        })}
      </div>
      <div className="splitTwo">
        <SmallShadowBorder
          className={`${styles.box} ${styles.note}`}
          backgroundColor={"white"}
        >
          <h5>
            <LuNotebookText size={20}/>
            RECOGNITION PATTERNS
          </h5>
          <div>
            <LabelValueMaterial materials={material.patterns} />
          </div>
        </SmallShadowBorder>
        <SmallShadowBorder
          className={`${styles.box} ${styles.note}`}
          backgroundColor={"#2D5A4C"}
          color={"white"}
        >
          <h5>
            <LuLightbulb size={20}/> TIPS CARD
          </h5>
          <p>{material.tip}</p>
        </SmallShadowBorder>
      </div>
    </SmallShadowBorder>
  );
}
