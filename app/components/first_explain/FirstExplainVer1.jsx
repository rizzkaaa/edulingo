import styles from "./FirstExplainVer1.module.css";
import ColorBorderShadow from "../ColorBorderShadow";
import BoxList from "../BoxList";
import HeaderVer1 from "./HeaderVer1";

export default function FirstExplainVer1({
  sub_material,
  fontWeight = "bold",
}) {
  return (
    <div className={styles.container}>
      {sub_material.content[0].explain.map((item, i) => {
        return (
          <ColorBorderShadow
            borderColor={i == 0 ? "#C5502A" : "#2D7A5E"}
            className={styles.box}
            key={i}
          >
            <HeaderVer1 item={item} i={i} />
            <div className="divider"></div>
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
                backgroundColor={
                  i == 1 ? "#2D7A5E" : item.articles ? "#C5502A" : "#E8A838"
                }
                color={"white"}
              />
            </div>

            {item.example_sentences ? (
              <div
                className={styles.example_sentences}
                style={{ backgroundColor: i == 1 ? "#E8F4EF" : "#FAE8E3" }}
              >
                {Array.isArray(item.example_sentences) ? (
                  item.example_sentences.map((sentence) => (
                    <p
                      style={{ fontWeight: fontWeight, marginBottom: "5px" }}
                      dangerouslySetInnerHTML={{ __html: sentence }}
                      key={sentence}
                    />
                  ))
                ) : (
                  <p style={{ fontWeight: fontWeight }}>
                    {item.example_sentences}
                  </p>
                )}
              </div>
            ) : (
              <></>
            )}
            {item.note ? (
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
            ) : (
              <></>
            )}
          </ColorBorderShadow>
        );
      })}
    </div>
  );
}
