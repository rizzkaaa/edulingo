import styles from "./ToeflTips.module.css";
import SmallShadowBorder from "./SmallShadowBorder";
import BorderLeftBox from "./BorderLeftBox";

export default function ToeflTips({ material }) {
  return (
    <BorderLeftBox
      borderColor={"#2D7A5E"}
      backgroundColor={"#E8F4EF"}
      className={styles.container}
    >
      <h3>{material.title}</h3>
      <div className={styles.list}>
        {material.explain.map((item, i) => (
          <div className={styles.item} key={i}>
            <div></div>
            {item}
          </div>
        ))}
      </div>

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
