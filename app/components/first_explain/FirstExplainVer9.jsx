import styles from "./FirstExplainVer9.module.css";
import BorderLeftBox from "../BorderLeftBox";

export default function FirstExplainVer9({ material }) {
  return (
    <BorderLeftBox
      backgroundColor={"#FDFAF5"}
      borderColor={"#E8A838"}
      className={styles.container4}
    >
      <h3>{material.title}</h3>
      <br />
      <div className="splitTwo" style={{ alignItems: "center" }}>
        <p className={styles.definition}>{material.definition}</p>
        <div className={styles.note}>
          <h4>{material.note.title}</h4>
          <p dangerouslySetInnerHTML={{ __html: material.note.example }} />
          <p dangerouslySetInnerHTML={{ __html: material.note.explain }} />
        </div>
      </div>
    </BorderLeftBox>
  );
}
