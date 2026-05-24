import styles from "./FirstExplain.module.css";
import ColorBorderShadow from "./ColorBorderShadow";
import BoxList from "./BoxList";

export function FirstExplainVer1({ sub_material }) {
  return (
    <div className={styles.container}>
      {sub_material.content[0].explain.map((item, i) => (
        <ColorBorderShadow key={i} borderColor={i == 0 ? "#C5502A" : "#2D7A5E"}>
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
        <div className={styles.wrap} key={i}>
          <ColorBorderShadow borderColor={i == 0 ? "#C5502A" : "#2D7A5E"}>
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
        <ColorBorderShadow key={i} borderColor={i == 0 ? "#C5502A" : "#2D7A5E"}>
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

function HeaderVer1({ item, i }) {
  return (
    <>
      <div className={styles.title}>
        <h3>{item.title}</h3>
        <p style={{ color: i == 0 ? "#C5502A" : "#2D7A5E" }}>{item.label}</p>
      </div>
      <p className={styles.definition}>{item.definition}</p>
    </>
  );
}
