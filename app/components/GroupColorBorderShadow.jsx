import BoxList from "./BoxList";
import ColorBorderShadow from "./ColorBorderShadow";
import styles from "./GroupColorBorderShadow.module.css";

export function GroupColorBorderShadow({ materials, version }) {
  const colors = ["#2D7A5E", "#C5502A", "#D9A126"];
  return (
    <div className={styles.container}>
      {materials.map((material, i) => {
        const isLast = i == materials.length - 1;
        const isOdd = materials.length % 2 != 0;
        console.log(isLast, isOdd, materials.length);

        const color = colors[i % 3];
        return (
          <ColorBorderShadow
            borderColor={color}
            key={i}
            className={`${styles.box} ${isOdd && isLast ? styles.full : ""}`}
          >
            {version == 1 ? (
              <Ver1 material={material} color={color} />
            ) : (
              <Ver2 material={material} color={color} />
            )}
          </ColorBorderShadow>
        );
      })}
    </div>
  );
}

function Ver1({ material, color }) {
  return (
    <>
      <h1 style={{ color: color }}>{material.title}</h1>
      <p>{material.definition}</p>
      <p
        style={{
          "--span-color": color,
        }}
        dangerouslySetInnerHTML={{ __html: material.example }}
      />
      {material.note ? <p className={styles.note}>{material.note}</p> : null}
    </>
  );
}

function Ver2({ material, color }) {
  const colors = {
    "#2D7A5E": {
      backgroundColor: "#E8F4EF",
      color: "white",
    },
    "#C5502A": {
      backgroundColor: "#FAE8E3",
      color: "white",
    },
    "#D9A126": {
      backgroundColor: "#FDFFCB",
      color: "#2C2A26",
    },
  };
  return (
    <>
      <h5 style={{ backgroundColor: color }}>
        {Array.isArray(material.title) ? (
          <>ha</>
        ) : (
          <>KETERANGAN {material.title}</>
        )}
      </h5>
      <h1 style={{ color: color }}>{material.title}</h1>
      <div className="divider"></div>
      <div className={styles.wrap}>
        <BoxList
          color={"white"}
          backgroundColor={color}
          items={material.example}
        />
      </div>
      <p
        style={{
          "--b-color": colors[color].color,
          "--b-backgroundColor": color,
          backgroundColor: colors[color].backgroundColor,
        }}
        dangerouslySetInnerHTML={{ __html: material.example_sentences }}
      />
    </>
  );
}
