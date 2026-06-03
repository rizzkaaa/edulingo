import styles from "./FirstExplainVer2.module.css";
import ColorBorderShadow from "../ColorBorderShadow";
import BoxList from "../BoxList";
import SmallShadowBorder from "../SmallShadowBorder";

export default function FirstExplainVer2({ sub_material }) {
  return (
    <div className={styles.container}>
      {sub_material.content[0].explain.map((item, i) => (
        <ColorBorderShadow
          key={i}
          borderColor={i == 0 ? "#C5502A" : "#2D7A5E"}
          className={styles.box}
        >
          <div className={styles.title}>
            <h3 style={{ color: i == 0 ? "#C5502A" : "#2D7A5E" }}>
              {item.title}
            </h3>
            <p style={{ color: i == 0 ? "#C5502A" : "#2D7A5E" }}>
              {item.label}
            </p>
          </div>

          <h4>{item.subtitle}</h4>
          <div className="divider"></div>
          <p className={styles.definition}>{item.definition}</p>
          <br />
          <p style={{ color: i == 1 ? "#2D7A5E" : "#E8A838" }}>{item.label2}</p>
          <div className={styles.examples}>
            <BoxList
              items={item.tags}
              backgroundColor={i == 1 ? "#2D7A5E" : "#E8A838"}
              color={i == 1 ? "white" : "black"}
            />
          </div>
          <br />
          <h4>{item.label3}</h4>
          <div className={styles.wrap}>
            {item.examples.map((e, j) => (
              <SmallShadowBorder key={j} className={styles.sentence}>
                <p
                  style={{ fontWeight: "normal" }}
                  dangerouslySetInnerHTML={{ __html: e }}
                />
              </SmallShadowBorder>
            ))}
          </div>
        </ColorBorderShadow>
      ))}
    </div>
  );
}
