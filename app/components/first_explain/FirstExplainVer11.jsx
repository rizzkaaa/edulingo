import styles from "./FirstExplainVer11.module.css";
import BorderLeftBox from "../BorderLeftBox";

export default function FirstExplainVer11({ material }) {

  return (
    <BorderLeftBox
      backgroundColor={"#FDFAF5"}
      borderColor={"#E8A838"}
      className={styles.container}
    >
      <h3>{material.title}</h3>
      <p>{material.definition}</p>
      
    </BorderLeftBox>
  );
}
