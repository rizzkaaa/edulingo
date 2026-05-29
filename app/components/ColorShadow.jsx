import styles from "./ColorShadow.module.css";
import SmallShadowBorder from "./SmallShadowBorder";

export function ColorShadow({ materials, divider }) {
  return (
    <div className="splitTwo">
      {materials.map((item, i) => (
        <div
          className={styles.box}
          style={{ backgroundColor: i == 0 ? "#E8A838" : "#2D7A5E" }}
          key={i}
        >
          <h5>{item.label}</h5>
          <p
            style={{ fontWeight: divider ? "bold" : "normal" }}
            dangerouslySetInnerHTML={{ __html: item.pattern }}
          />
          {divider ? <div className="divider"></div> : null}
          <SmallShadowBorder backgroundColor={"#FDFAF5"}>
            <p dangerouslySetInnerHTML={{ __html: item.example }} />
            {item.explain ? <p className={styles.note}>{item.explain}</p> : null}
          </SmallShadowBorder>
        </div>
      ))}
    </div>
  );
}
