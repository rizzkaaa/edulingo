import styles from "./FirstExplainVer4.module.css";
import BorderLeftBox from "../BorderLeftBox";
import BoxList from "../BoxList";
import SmallShadowBorder from "../SmallShadowBorder";

export default function FirstExplainVer4({ material }) {
  return (
    <BorderLeftBox
      backgroundColor={"#FDFAF5"}
      borderColor={"#E8A838"}
      className={styles.container}
    >
      <h3>{material.title}</h3>
      <br />
      <SmallShadowBorder textAlign="center" backgroundColor={'#E8A838'}>{material.pattern}</SmallShadowBorder>
      <br />
      <h4>{material.definition}</h4>
      <br />
      <div className={styles.wrap}>
        <BoxList textAlign="center" backgroundColor={'#E8A838'} items={material.example} />
      </div>
    </BorderLeftBox>
  );
}
