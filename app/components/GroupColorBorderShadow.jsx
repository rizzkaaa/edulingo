import ColorBorderShadow from "./ColorBorderShadow";
import styles from "./GroupColorBorderShadow.module.css";

export function GroupColorBorderShadowVer1({ materials }) {
  const colors = ["#2D7A5E", "#C5502A", "#D9A126"];
  return (
    <div className={styles.container}>
      {materials.map((material, i) => (
        <ColorBorderShadow
          borderColor={colors[i % 3]}
          key={i}
          className={styles.box}
        >
          <h3 style={{ color: colors[i % 3] }}>{material.title}</h3>
          <p>{material.definition}</p>
          <p
            style={{
              "--span-color": colors[i % 3],
            }}
            dangerouslySetInnerHTML={{ __html: material.example }}
          />
          {material.note ? (
            <p className={styles.note}>{material.note}</p>
          ) : null}
        </ColorBorderShadow>
      ))}
    </div>
  );
}
