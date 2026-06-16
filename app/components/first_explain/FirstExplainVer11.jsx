import styles from "./FirstExplainVer11.module.css";
import BorderLeftBox from "../BorderLeftBox";
import SmallShadowBorder from "../SmallShadowBorder";

export default function FirstExplainVer11({ material, divider = false }) {
  return (
    <BorderLeftBox
      backgroundColor={"#FDFAF5"}
      borderColor={"#E8A838"}
      className={styles.container}
    >
      <h3>{material.title}</h3>
      {divider ? <div className="divider"></div> : null}
      <p
        className={styles.definition}
        dangerouslySetInnerHTML={{ __html: material.definition }}
      />
      {material.note ? (
        <>
          <br />
          <SmallShadowBorder>{material.note}</SmallShadowBorder>
        </>
      ) : null}
    </BorderLeftBox>
  );
}
