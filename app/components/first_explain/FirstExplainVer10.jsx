import styles from "./FirstExplainVer10.module.css";
import BorderLeftBox from "../BorderLeftBox";
import BoxList from "../BoxList";

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
          {material.example_sentence.analysis.map((item, i) => {
            const color = ["#E8A838", "#2D7A5E", "#C5502A"];
            return (
              <div key={i} >
                <p style={{color: i != 0 ? 'white' : '#2C2A26', backgroundColor: color[i]}} >{item.label}</p>
                <p>{item.value}</p>
              </div>
            );
          })}
          <div className="divider"></div>
          <p className={styles.note}>{material.example_sentence.note}</p>
        </div>
      </div>
    </BorderLeftBox>
  );
}
