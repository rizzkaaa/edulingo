import styles from "./FirstExplainVer6.module.css";
import BorderLeftBox from "../BorderLeftBox";
import SmallShadowBorder from "../SmallShadowBorder";

export default function FirstExplainVer6({ material }) {
  return (
    <BorderLeftBox
      backgroundColor={"#FDFAF5"}
      borderColor={"#E8A838"}
      className={styles.container2}
    >
      <h3>{material.title}</h3>
      <p>{material.definition}</p>
      <SmallShadowBorder backgroundColor={"#E8A838"}>
        <p dangerouslySetInnerHTML={{ __html: material.pattern }} />
      </SmallShadowBorder>
      <br />
      <p dangerouslySetInnerHTML={{ __html: material.example }} />
    </BorderLeftBox>
  );
}
