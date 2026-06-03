import styles from "./TemplateVer6.module.css";
import BorderLeftBox from "../BorderLeftBox";

export default function TemplateVer6({ material }) {
  return (
    <BorderLeftBox
      borderColor={"#E8A838"}
      backgroundColor={"#FAEEDA"}
      className={styles.container6}
    >
      <h3>{material.title}</h3>
      <br />
      {material.explain.map((item, i) => (
        <div key={i} className={styles.list}>
          <div>
            <h4>{item.sentence}</h4>
            <p>{item.explanation}</p>
          </div>
          <h4
            style={{
              backgroundColor: item.status == "BENAR ✓" ? "#2D7A5E" : "#C5502A",
            }}
          >
            {item.status}
          </h4>
        </div>
      ))}
    </BorderLeftBox>
  );
}
