import styles from "./FirstExplainVer8.module.css";
import BorderLeftBox from "../BorderLeftBox";
import SmallShadowBorder from "../SmallShadowBorder";

export default function FirstExplainVer8({ material }) {
  return (
    <BorderLeftBox
      backgroundColor={"#FDFAF5"}
      borderColor={"#E8A838"}
      className={styles.container3}
    >
      <h3>{material.title}</h3>
      <p>{material.definition}</p>
      <div className={styles.wrap}>
        {material.explain.map((item, i) => (
          <SmallShadowBorder
            key={i}
            className={styles.explain}
            backgroundColor={"#E8A838"}
          >
            <h5>{item.title}</h5>
            <p dangerouslySetInnerHTML={{ __html: item.pattern }} />
            <SmallShadowBorder
              backgroundColor={"#FDFAF5"}
              className={styles.example}
            >
              <p dangerouslySetInnerHTML={{ __html: item.example }} />
            </SmallShadowBorder>
          </SmallShadowBorder>
        ))}
      </div>
    </BorderLeftBox>
  );
}
