import styles from "./FirstExplainVer10.module.css";
import BorderLeftBox from "../BorderLeftBox";
import BoxList from "../BoxList";
import LabelValueMaterial from "../LabelValueMaterial";

export default function FirstExplainVer10({ material }) {
  return (
    <BorderLeftBox
      backgroundColor={"#FDFAF5"}
      borderColor={"#E8A838"}
      className={styles.container}
    >
      <h3>{material.title}</h3>
      <br />
      <div className="splitTwo" style={{ alignItems: "center" }}>
        <div className={styles.box}>
          <b className={styles.definition}>{material.definition}</b>
          <p className={styles.note}>{material.example.title}</p>
          <div className={styles.wrap}>
            <BoxList items={material.example.list} textAlign="center" />
          </div>
        </div>
        <div className={styles.box}>
          <h4>{material.example_sentence.sentence}</h4>
          <br />
          <LabelValueMaterial materials={material.example_sentence.analysis} />
          <div className="divider"></div>
          <p className={styles.note}>{material.example_sentence.note}</p>
        </div>
      </div>
    </BorderLeftBox>
  );
}
