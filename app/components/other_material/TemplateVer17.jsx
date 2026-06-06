import styles from "./TemplateVer17.module.css";
import SmallShadowBorder from "../SmallShadowBorder";
import BoxList from "../BoxList";
import BorderLeftBox from "../BorderLeftBox";

export default function TemplateVer17({ material }) {
  return (
    <BorderLeftBox
      borderColor={"#e8a838"}
      backgroundColor={"#fdfaf5"}
      className={styles.container}
    >
      <h3>{material.title}</h3>
      <div className={styles.wrap}>
        {material.steps.map((item, i) => {
          return typeof item == "string" ? (
            <p className={styles.arrow} key={i}>{item}</p>
          ) : (
            <div className={styles.box} key={i}>
              <SmallShadowBorder backgroundColor={"#C5502A"} color={"white"}>
                {item.number}
              </SmallShadowBorder>
              <p>{item.text}</p>
            </div>
          );
        })}
      </div>
    </BorderLeftBox>
  );
}
