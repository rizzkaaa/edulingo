import styles from "./FirstExplain.module.css";
import ColorBorderShadow from "./ColorBorderShadow";
import BoxList from "./BoxList";
import SmallShadowBorder from "./SmallShadowBorder";
import BorderLeftBox from "./BorderLeftBox";

export function FirstExplainVer1({ sub_material }) {
  return (
    <div className={styles.container}>
      {sub_material.content[0].explain.map((item, i) => (
        <ColorBorderShadow
          key={i}
          borderColor={i == 0 ? "#C5502A" : "#2D7A5E"}
          className={styles.box}
        >
          <HeaderVer1 item={item} i={i} />
          <div className={styles.divider}></div>
          <div className={styles.examples}>
            <BoxList
              items={item.examples}
              backgroundColor={i == 1 ? "#2D7A5E" : "#E8A838"}
              color={i == 1 ? "white" : "black"}
            />
          </div>
        </ColorBorderShadow>
      ))}
    </div>
  );
}
export function FirstExplainVer2({ sub_material }) {
  return (
    <div className={styles.container}>
      {sub_material.content[0].explain.map((item, i) => (
        <div className={styles.box} key={i}>
          <ColorBorderShadow
            borderColor={i == 0 ? "#C5502A" : "#2D7A5E"}
            className={styles.box}
          >
            <HeaderVer1 item={item} i={i} />
            <div className={styles.divider}></div>
            {item.articles ? (
              <>
                <div className={styles.examples}>
                  <BoxList
                    items={item.articles}
                    backgroundColor={"#E8A838"}
                    color={"black"}
                  />
                </div>
                <div style={{ height: "10px" }}></div>
              </>
            ) : (
              <></>
            )}
            <div className={styles.examples}>
              <BoxList
                items={item.examples}
                backgroundColor={i == 1 ? "#2D7A5E" : "#C5502A"}
                color={"white"}
              />
            </div>
            <div
              className={styles.note}
              style={{ backgroundColor: i == 1 ? "#E8F4EF" : "#FAE8E3" }}
            >
              {item.note}
            </div>
          </ColorBorderShadow>
        </div>
      ))}
    </div>
  );
}

export function FirstExplainVer3({ sub_material }) {
  return (
    <div className={styles.container}>
      {sub_material.content[0].explain.map((item, i) => (
        <ColorBorderShadow
          key={i}
          borderColor={i == 0 ? "#C5502A" : "#2D7A5E"}
          className={styles.box}
        >
          <HeaderVer1 item={item} i={i} />
          <div className={styles.divider}></div>
          <div className={styles.examples}>
            <BoxList
              items={item.examples}
              backgroundColor={i == 1 ? "#2D7A5E" : "#E8A838"}
              color={i == 1 ? "white" : "black"}
            />
          </div>
          <div
            className={styles.note}
            style={{ backgroundColor: i == 1 ? "#E8F4EF" : "#FAE8E3" }}
          >
            {item.example_sentences.map((sentence) => (
              <p key={sentence}> • {sentence}</p>
            ))}
          </div>
        </ColorBorderShadow>
      ))}
    </div>
  );
}
export function FirstExplainVer4({ sub_material }) {
  return (
    <div className={styles.container}>
      {sub_material.content[0].explain.map((item, i) => (
        <ColorBorderShadow
          key={i}
          borderColor={i == 0 ? "#C5502A" : "#2D7A5E"}
          className={styles.box}
        >
          <HeaderVer1 item={item} i={i} />
          <div className={styles.divider}></div>
          <div className={styles.examples}>
            <BoxList
              items={item.examples}
              backgroundColor={i == 1 ? "#2D7A5E" : "#E8A838"}
              color={i == 1 ? "white" : "black"}
            />
          </div>
          <div
            className={styles.note}
            style={{ backgroundColor: i == 1 ? "#E8F4EF" : "#FAE8E3" }}
          >
            {item.example_sentences.map((sentence) => (
              <p
                style={{ fontWeight: "normal", marginBottom: "5px" }}
                dangerouslySetInnerHTML={{ __html: sentence }}
                key={sentence}
              />
            ))}
          </div>
          <p
            style={{
              color: "white",
              backgroundColor: i == 1 ? "#8C8880" : "#C5502A",
              textAlign: "center",
            }}
            className={styles.note}
          >
            {item.note}
          </p>
        </ColorBorderShadow>
      ))}
    </div>
  );
}
export function FirstExplainVer5({ sub_material }) {
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
          <div className={styles.divider}></div>
          <p className={styles.definition}>{item.definition}</p>

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

function HeaderVer1({ item, i }) {
  return (
    <>
      <div className={styles.title}>
        <div>
          {item.subtitle ? (
            <h5 style={{ backgroundColor: i == 0 ? "#C5502A" : "#2D7A5E" }}>
              {item.subtitle}
            </h5>
          ) : (
            <></>
          )}
          <h3>{item.title}</h3>
        </div>
        <p style={{ color: i == 0 ? "#C5502A" : "#2D7A5E" }}>{item.label}</p>
      </div>
      <p className={styles.definition}>{item.definition}</p>
    </>
  );
}

export function FirstExplainVer6({ material }) {
  return (
    <BorderLeftBox
      backgroundColor={"#FDFAF5"}
      borderColor={"#E8A838"}
      className={styles.container2}
    >
      <h3>{material.title}</h3>
      <p>{material.definition}</p>
      <SmallShadowBorder backgroundColor={"#E8A838"}>
        <p dangerouslySetInnerHTML={{ __html: material.pattern }} />
      </SmallShadowBorder>
      <br />
      <p dangerouslySetInnerHTML={{ __html: material.example }} />
    </BorderLeftBox>
  );
}
