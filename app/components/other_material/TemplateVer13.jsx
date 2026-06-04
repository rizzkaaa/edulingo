import ColorBorderShadow from "../ColorBorderShadow";
import SmallShadowBorder from "../SmallShadowBorder";
import styles from "./TemplateVer13.module.css";

export default function TemplateVer13({ sub_material }) {
  const borderColor = ["#C5502A", "#E8A838", "#2D7A5E"];
  return (
    <div className={styles.container}>
      <h3>{sub_material.title}</h3>
      <div className={styles.wrap}>
        {sub_material.explain.map((item, i) => {
          const color = borderColor[i];
          return (
            <ColorBorderShadow
              borderColor={color}
              className={styles.box}
              key={i}
            >
              <p className={styles.label}>{item.label}</p>
              <h3>{item.title}</h3>
              <br />
              <SmallShadowBorder
                textAlign="center"
                backgroundColor={color}
                color={i != 1 ? "white" : "#2C2A26"}
              >
                {item.verb_type}
              </SmallShadowBorder>
              <div className={styles.example}>
                {item.examples.map((e, j) => {
                  return (
                    <div key={j}>
                      <h4
                        style={{
                          "--span-color": color,
                        }}
                        dangerouslySetInnerHTML={{ __html: e.sentence }}
                      />
                      <p>{e.note}</p>
                    </div>
                  );
                })}
              </div>
            </ColorBorderShadow>
          );
        })}
      </div>
    </div>
  );
}
