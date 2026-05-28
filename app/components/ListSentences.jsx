import styles from "./ToeflTips.module.css";

export default function ListSentence({ material }) {
  return (
    <div className={styles.list}>
      {material.map((item, i) => (
        <div className={styles.item} key={i}>
          <div></div>
          {item}
        </div>
      ))}
    </div>
  );
}
