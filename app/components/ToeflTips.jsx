import styles from "./ToeflTips.module.css";
import SmallShadowBorder from "./SmallShadowBorder";

export default function ToeflTips({ material }) {
  return (
    <div className={styles.container}>
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
    </div>
  );
}
