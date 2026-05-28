import styles from "./ToeflTips.module.css";
import SmallShadowBorder from "./SmallShadowBorder";
import BorderLeftBox from "./BorderLeftBox";
import ListSentence from "./ListSentences";

export default function ToeflTips({ material }) {
  return (
    <BorderLeftBox
      borderColor={"#2D7A5E"}
      backgroundColor={"#E8F4EF"}
      className={styles.container}
    >
      <h3>{material.title}</h3>
      {Array.isArray(material.explain) ? (
        <ListSentence material={material.explain} />
      ) : (
        <p>{material.explain}</p>
      )}

      {material.contoh ? (
        <SmallShadowBorder backgroundColor={"#E8A838"} color={"black"}>
          {material.contoh}
        </SmallShadowBorder>
      ) : (
        <></>
      )}
    </BorderLeftBox>
  );
}
