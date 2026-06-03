import styles from "./TemplateVer5.module.css";
import SmallShadowBorder from "../SmallShadowBorder";
import BorderLeftBox from "../BorderLeftBox";

export default function TemplateVer5({ material }) {
  return (
    <BorderLeftBox
      borderColor={"#C5502A"}
      backgroundColor={"#FAE8E3"}
      className={styles.container5}
    >
      <h3>{material.title}</h3>
      <div className="splitTwo">
        {material.explain.map((item, i) => (
          <SmallShadowBorder
            key={i}
            backgroundColor={i == 0 ? "#E8F4EF" : "#FAE8E3"}
            className={styles.sentences}
          >
            <h2 style={{ color: i == 0 ? "#2D7A5E" : "#C5502A" }}>
              {item.label}
            </h2>
            <p>{item.description}</p>
            <p dangerouslySetInnerHTML={{ __html: item.example }} />
          </SmallShadowBorder>
        ))}
      </div>
      <div className={styles.note}>{material.note}</div>
    </BorderLeftBox>
  );
}
