import styles from "./FirstExplainVer5.module.css";
import BorderLeftBox from "../BorderLeftBox";
import SmallShadowBorder from "../SmallShadowBorder";

export default function FirstExplainVer5({ material }) {
  const color = ["#C5502A", "#E8A838", "#2D7A5E", "#F5F1EA"];

  return (
    <BorderLeftBox
      backgroundColor={"#FDFAF5"}
      borderColor={"#E8A838"}
      className={styles.container}
    >
      <h3>{material.title}</h3>
      <p>{material.definition}</p>
      <div className={styles.wrap}>
        {material.example.map((item, i) => {
          return (
            <SmallShadowBorder
              backgroundColor={color[i]}
              color={i % 2 == 0 ? "white" : "#2C2A26"}
              key={i}
            >
              {item}
            </SmallShadowBorder>
          );
        })}
      </div>
    </BorderLeftBox>
  );
}
