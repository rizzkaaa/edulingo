import styles from "./FirstExplainVer7.module.css";
import BorderLeftBox from "../BorderLeftBox";
import { ColorShadow } from "../ColorShadow";

export default function FirstExplainVer7({ material }) {
  return (
    <BorderLeftBox
      backgroundColor={"#FDFAF5"}
      borderColor={"#C5502A"}
      className={styles.container3}
    >
      <h3>{material.title}</h3>
      <p>{material.definition}</p>
      <ColorShadow materials={material.explain} />
    </BorderLeftBox>
  );
}
