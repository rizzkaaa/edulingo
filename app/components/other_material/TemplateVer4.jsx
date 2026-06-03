import styles from "./TemplateVer4.module.css";
import SmallShadowBorder from "../SmallShadowBorder";
import BorderLeftBox from "../BorderLeftBox";

export default function TemplateVer4({ material }) {
  return (
    <BorderLeftBox
      backgroundColor={"#FAE8E3"}
      borderColor={"#C5502A"}
      className={styles.container4}
    >
      <h3>{material.title}</h3>
      <div className={styles.box}>
        <SmallShadowBorder backgroundColor={"#E8A838"}>
          SUBJECT PRONOUN
        </SmallShadowBorder>
        <div className={styles.sentences}>
          {material.explain.map((item, i) => (
            <SmallShadowBorder key={i} backgroundColor={"#FDFAF5"}>
              <p dangerouslySetInnerHTML={{ __html: item.sentence }} />
              <p className={styles.note}>{item.note}</p>
            </SmallShadowBorder>
          ))}
        </div>
      </div>
    </BorderLeftBox>
  );
}
