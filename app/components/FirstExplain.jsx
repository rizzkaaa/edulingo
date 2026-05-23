import styles from "./FirstExplain.module.css";
import SmallShadowBorder from "@/app/components/SmallShadowBorder";

export function FirstExplainVer1({ sub_material }) {
  return (
    <div className={styles.container}>
      {sub_material.content[0].explain.map((item, i) => (
        <div
          className={styles.box}
          style={{ borderColor: i == 0 ? "#C5502A" : "#2D7A5E" }}
          key={item.title}
        >
          <div className={styles.title}>
            <h3>{item.title}</h3>
            <p style={{ color: i == 0 ? "#C5502A" : "#2D7A5E" }}>
              {item.label}
            </p>
          </div>
          <p className={styles.definition}>{item.definition}</p>
          <div className={styles.divider}></div>
          <div className={styles.examples}>
            {item.examples.map((e) => (
              <SmallShadowBorder key={e}
                backgroundColor={i == 1 ? "#2D7A5E" : "#E8A838"}
                color={i == 1 ? "white" : "black"}
              >
                {e}
              </SmallShadowBorder>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
