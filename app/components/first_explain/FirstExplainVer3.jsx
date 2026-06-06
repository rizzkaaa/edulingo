import styles from "./FirstExplainVer3.module.css";
import ColorBorderShadow from "../ColorBorderShadow";

export default function FirstExplainVer3({
  sub_material,
  none = false,
  reverse = false,
}) {
  return (
    <div className={styles.container}>
      {sub_material.explain.map((item, i) => {
        const color = i == 0 ? "#C5502A" : "#2D7A5E";
        const bgColor = i == 0 ? "#E8A838" : "#2D7A5E";
        return (
          <ColorBorderShadow key={i} borderColor={color} className={styles.box}>
            <h1 style={{ color: color }}>{item.title}</h1>
            <h4>{item.subtitle}</h4>
            <div className={reverse ? styles.reverse : ""}>
              <div
                style={{ display: none ? "none" : "block" }}
                className="divider"
              ></div>
              <p className={styles.definition}>{item.definition}</p>
            </div>
            <div className={reverse ? styles.reverse : ""}>
              <p
                className={styles.example}
                style={{
                  backgroundColor: bgColor,
                  color: i == 0 ? "#2C2A26" : "white",
                }}
              >
                {item.example}
              </p>
              <div>
                {item.explain.map((e, j) => (
                  <div key={j} className={styles.wrap}>
                    <div style={{ backgroundColor: bgColor }}></div>
                    <p>{e}</p>
                  </div>
                ))}
              </div>
            </div>
          </ColorBorderShadow>
        );
      })}
    </div>
  );
}
