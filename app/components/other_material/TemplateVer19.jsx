import styles from "./TemplateVer19.module.css";
import BorderLeftBox from "../BorderLeftBox";
import BoxList from "../BoxList";
import ListSentence from "../ListSentences";

export default function TemplateVer19({ material }) {
  return (
    <BorderLeftBox
      backgroundColor={"#FDFAF5"}
      borderColor={"#E8A838"}
      className={styles.container}
    >
      <h3>{material.title}</h3>
      <br />
      <div className="splitTwo">
        <div className={styles.box}>
          {material.lists.map((item, i) => (
            <div className={styles.item} key={i}>
              <div style={{ backgroundColor: "#C5502A" }}></div>
              <p dangerouslySetInnerHTML={{ __html: item }} />
            </div>
          ))}
        </div>
        <div className={styles.box}>
          <h4>{material.note.title}</h4>
          <p>{material.note.text}</p>
        </div>
      </div>
    </BorderLeftBox>
  );
}
