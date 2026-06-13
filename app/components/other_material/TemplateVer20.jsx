import ColorBorderShadow from "../ColorBorderShadow";
import styles from "../GroupColorBorderShadow.module.css";
import SmallShadowBorder from "../SmallShadowBorder";

export default function TemplateVer20({ material }) {
  const color = "#D9A126";
  return (
    <ColorBorderShadow borderColor={color} className={styles.container}>
      <div className={`${styles.box} ${styles.full}`}>
        <h5 style={{ backgroundColor: color }}>{material.title}</h5>
        <h1 style={{ color: color }}>{material.title}</h1>

        <p>{material.definition}</p>
        <div className="divider"></div>
        {material.explain.map((item, i) => {
          return (
            <div key={i}  style={{display: "flex", flexDirection: "column", alignItems: "start", marginBottom: "25px"}}>
              <SmallShadowBorder backgroundColor={color}>{item.label}</SmallShadowBorder>
              <div className={styles.example_sentences} style={{width: "100%", backgroundColor: "#FDFFCB"}}>
                <p style={{marginBottom: '10px'}}>{item.sentence}</p>
                <h5 style={{ backgroundColor: color, color: "#2C2A26" }}>
                  {item.tag}
                </h5>
              </div>
            </div>
          );
        })}
      </div>
    </ColorBorderShadow>
  );
}
