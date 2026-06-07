import styles from "./TemplateVer18.module.css";
import BorderLeftBox from "../BorderLeftBox";

export default function TemplateVer18({ material }) {
  const colors = ["#2D7A5E", "#C5502A", "#D9A126", "#8C8880"];
 
  return (
    <BorderLeftBox
      borderColor={"#C5502A"}
      backgroundColor={"#fdfaf5"}
      className={styles.container}
    >
      <h3>{material.title}</h3>
      <div className={styles.wrap}>
        {material.explain.map((item, i) => {
          return (
            <div key={i} className={styles.box}>
              <h1 style={{color: colors[i]}}>{item.number}</h1>
              <p>{item.text}</p>
            </div>
          )
        })}
      </div>
    </BorderLeftBox>
  );
}
