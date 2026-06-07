import styles from "./ToeflTips.module.css";

export default function ListSentence({ material, bgColor = "#C5502A" }) {
  return (
    <div className={styles.list}>
      {material.map((item, i) => (
        <div className={styles.item} key={i}>
          <div style={{ backgroundColor: bgColor }}></div>
          <p>{item}</p>
        </div>
      ))}
    </div>
  );
}
