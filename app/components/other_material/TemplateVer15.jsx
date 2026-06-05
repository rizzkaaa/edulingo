import BoxList from "../BoxList";
import ColorBorderShadow from "../ColorBorderShadow";
import SmallShadowBorder from "../SmallShadowBorder";
import styles from "./TemplateVer15.module.css";

export function Ver1({ sub_material }) {
  return (
    <TemplateVer15
      sub_material={sub_material}
      color={"white"}
      borderColor={"#C5502A"}
      className={styles.main1}
    >
      <div className={styles.wrap}>
        <BoxList
          textAlign="center"
          items={sub_material.example}
          color={"white"}
          backgroundColor={"#C5502A"}
        />
      </div>
      <div className="divider"></div>
      <div className={styles.box}>
        {sub_material.example_sentences.map((item, i) => {
          return (
            <SmallShadowBorder backgroundColor={"#F5F1EA"} key={i}>
              <p
                style={{
                  "--b-color": "white",
                  "--b-bgColor": "#C5502A",
                }}
                key={i}
                dangerouslySetInnerHTML={{ __html: item }}
              />
            </SmallShadowBorder>
          );
        })}
      </div>
      <br />

      <SmallShadowBorder backgroundColor={"#E8A838"}>
        <p className={styles.note}>
          {sub_material.note.map((item, i) => {
            return <b key={i} dangerouslySetInnerHTML={{ __html: item }} />;
          })}
        </p>
      </SmallShadowBorder>
    </TemplateVer15>
  );
}

export function Ver2({ sub_material }) {
  return (
    <TemplateVer15
      sub_material={sub_material}
      color={"#2C2A26"}
      borderColor={"#E8A838"}
      className={styles.main2}
    >
      <div className={styles.wrap}>
        <BoxList
          textAlign="center"
          items={sub_material.example}
          color={"#2C2A26"}
          backgroundColor={"#F5F1EA"}
        />
      </div>
      <br />
      <SmallShadowBorder textAlign="center" backgroundColor={"#E8A838"}>
        {sub_material.structure}
      </SmallShadowBorder>
      <br />
      <div className={styles.box}>
        {sub_material.example_sentences.map((item, i) => {
          return (
            <SmallShadowBorder backgroundColor={"#F5F1EA"} key={i}>
              <p key={i} dangerouslySetInnerHTML={{ __html: item.sentence }} />
              <p>{item.note}</p>
            </SmallShadowBorder>
          );
        })}
      </div>
    </TemplateVer15>
  );
}

export function Ver3({ sub_material }) {
  return (
    <TemplateVer15
      sub_material={sub_material}
      color={"white"}
      borderColor={"#2D7A5E"}
      className={styles.main3}
    >
      <div className={styles.wrap}>
        <BoxList
          textAlign="center"
          items={sub_material.example}
          color={"white"}
          backgroundColor={"#2D7A5E"}
        />
      </div>
      <br />
      <div className={styles.box}>
        {sub_material.example_sentences.map((item, i) => {
          return (
            <SmallShadowBorder backgroundColor={"#F5F1EA"} key={i}>
              <p
                style={{
                  "--b-color": "white",
                  "--b-bgColor": "#2D7A5E",
                }}
                key={i}
                dangerouslySetInnerHTML={{ __html: item }}
              />
            </SmallShadowBorder>
          );
        })}
      </div>
      <br />

      <SmallShadowBorder backgroundColor={"#E8A838"}>
        <p className={styles.note}>
          {sub_material.note.map((item, i) => {
            return <b key={i} dangerouslySetInnerHTML={{ __html: item }} />;
          })}
        </p>
      </SmallShadowBorder>
    </TemplateVer15>
  );
}

export function Ver4({ sub_material }) {
  return (
    <TemplateVer15
      sub_material={sub_material}
      color={"white"}
      borderColor={"#8C8880"}
      className={styles.main4}
    >
      <div className={styles.wrap}>
        <BoxList
          textAlign="center"
          items={sub_material.example}
          color={"#2C2A26"}
          backgroundColor={"#F5F1EA"}
        />
      </div>
      <br />
      <div className="splitTwo">
        {sub_material.sub_sections.map((item, i) => {
          const bgColor = i == 0 ? "#E8A838" : "#2D7A5E";
          const color = i == 0 ? "#2C2A26" : "white";

          return (
            <div className={styles.section} key={i}>
              <SmallShadowBorder backgroundColor={bgColor} color={color}>
                {item.type}
              </SmallShadowBorder>
              <div className={styles.example}>
                {item.example_sentences.map((item, i) => {
                  return (
                    <SmallShadowBorder backgroundColor={"#F5F1EA"} key={i}>
                      <p
                        style={{
                          "--b-color": color,
                          "--b-bgColor": bgColor,
                        }}
                        key={i}
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    </SmallShadowBorder>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <br />
      <SmallShadowBorder className={styles.note} backgroundColor={"#F5F1EA"}>
        {sub_material.note.map((item, i) => {
          return (
            <div className={styles.section} key={i}>
              <div
                style={{ backgroundColor: i == 0 ? "#E8A838" : "#2D7A5E" }}
              ></div>
              <p key={i} dangerouslySetInnerHTML={{ __html: item }} />
            </div>
          );
        })}
      </SmallShadowBorder>
    </TemplateVer15>
  );
}

function TemplateVer15({
  sub_material,
  children,
  borderColor,
  color,
  className,
}) {
  return (
    <ColorBorderShadow className={styles.container} borderColor={borderColor}>
      <div className={styles.header}>
        <h3>{sub_material.title}</h3>
        <SmallShadowBorder color={color} backgroundColor={borderColor}>
          {sub_material.label}
        </SmallShadowBorder>
      </div>
      <p>{sub_material.definition}</p>
      <br />
      <div className={className}>{children}</div>
    </ColorBorderShadow>
  );
}
