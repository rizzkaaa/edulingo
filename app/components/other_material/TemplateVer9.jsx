import BorderLeftBox from "../BorderLeftBox";
import ColorBorderShadow from "../ColorBorderShadow";
import styles from "./TemplateVer9.module.css";

export default function TemplateVer9({ sub_material, grey = true }) {
  return (
    <BorderLeftBox borderColor={"#E8A838"} className={styles.container}>
      <h3>{sub_material.title}</h3>
      <div className={styles.wrap}>
        {sub_material.explain.map((item, i) => {
          const borderColor = ["#E8A838", "#C5502A", "#2D7A5E"];
          return (
            <ColorBorderShadow
              borderColor={borderColor[i]}
              className={styles.box}
              key={i}
            >
              <p style={{color: grey ? "#8C8880" : borderColor[i]}}>{item.title}</p>
              <h3>{item.example}</h3>
              <p>{item.definition}</p>
            </ColorBorderShadow>
          );
        })}
      </div>
    </BorderLeftBox>
  );
}
