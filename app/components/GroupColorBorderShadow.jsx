import { LuCircleCheck, LuX } from "react-icons/lu";
import BoxList from "./BoxList";
import ColorBorderShadow from "./ColorBorderShadow";
import styles from "./GroupColorBorderShadow.module.css";
import SmallShadowBorder from "./SmallShadowBorder";
import ListSentence from "./ListSentences";
import LabelValueMaterial from "./LabelValueMaterial";

export function GroupColorBorderShadow({ materials, version }) {
  const colors = ["#2D7A5E", "#C5502A", "#D9A126"];

  return (
    <div className={styles.container}>
      {materials.map((material, i) => {
        const isLast = i === materials.length - 1;
        const isOdd = materials.length % 2 !== 0;
        const color = colors[i % 3];

        let content;
        switch (version) {
          case 1:
            content = <Ver1 material={material} color={color} />;
            break;
          case 2:
            content = <Ver2 material={material} color={color} />;
            break;
          case 3:
            content = <Ver3 material={material} color={color} />;
            break;
          case 4:
            content = <Ver4 material={material} color={color} />;
            break;
          default:
            content = null;
        }

        return (
          <ColorBorderShadow
            borderColor={color}
            key={i}
            className={`${styles.box} ${isOdd && isLast ? styles.full : ""}`}
          >
            {content}
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
      <h5 style={{ backgroundColor: color, color: colors[color].color }}>
        {Array.isArray(material.title) ? (
          <>{material.title.join(" / ")}</>
        ) : (
          <>KETERANGAN {material.title}</>
        )}
      </h5>
      <h1 style={{ color: color }}>
        {Array.isArray(material.title)
          ? material.title.join(" & ")
          : material.title}
      </h1>

      {material.definition ? <p>{material.definition}</p> : null}
      <div className="divider"></div>
      <div className={styles.wrap}>
        <BoxList
          color={colors[color].color}
          backgroundColor={color}
          items={material.example}
        />
      </div>

      {material.pattern ? (
        <>
          <br />
          <p className={styles.pattern}>{material.pattern}</p>
        </>
      ) : null}

      {material.example_sentences
        ? material.example_sentences.map((item, i) => (
            <p
              key={i}
              className={styles.example_sentences}
              style={{
                "--b-color": colors[color].color,
                "--b-backgroundColor": color,
                "--span-color": i == 0 ? "#2D7A5E" : "#991B1B",
                backgroundColor: colors[color].backgroundColor,
              }}
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))
        : null}

      {material.note ? <p className={styles.note}>{material.note}</p> : null}
    </>
  );
}

function Ver3({ material, color }) {
  return (
    <>
      <h1 style={{ color: color }}>{material.title}</h1>
      <br />
      <div className={styles.examples}>
        {material.examples.map((example, i) => (
          <SmallShadowBorder
            key={i}
            backgroundColor={i == 0 ? "#FEF2F2" : "#E8F4EF"}
          >
            <p className={i == 0 ? "wrongSentence" : ""}>
              {i == 1 ? (
                <LuCircleCheck style={{ color: "#2D7A5E" }} />
              ) : (
                <LuX style={{ color: "#C5502A" }} />
              )}{" "}
              {example}
            </p>
          </SmallShadowBorder>
        ))}
      </div>
    </>
  );
}

function Ver4({ material, color }) {
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
      <div>
        <h1 style={{ color: color }}>{material.title}</h1>
        <span></span>
        <p>{material.definition}</p>
      </div>
      {material.explain ? (
        Array.isArray(material.explain) ? (
          <div style={{ marginBlock: "15px" }}>
            <ListSentence material={material.explain} bgColor={color} />
          </div>
        ) : (
          <>
            {material.explain.content.map((item, i) => (
              <div style={{ marginBottom: "10px" }} key={i}>
                <p>{item.title}</p>
                <ListSentence material={item.lists} bgColor={color} />
              </div>
            ))}
          </>
        )
      ) : null}

      {material.example ? (
        <div className={styles.labelValueGroup}>
          <LabelValueMaterial materials={material.example} />
        </div>
      ) : null}
      <SmallShadowBorder
        className={styles.tujuan}
        textAlign="center"
        backgroundColor={color}
        color={colors[color].color}
      >
        {material.note}
      </SmallShadowBorder>
    </>
  );
}
