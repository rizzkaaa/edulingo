import BorderLeftBox from "../BorderLeftBox";
import ListSentence from "../ListSentences";
import SmallShadowBorder from "../SmallShadowBorder";
import styles from "./TemplateVer12.module.css";

export default function TemplateVer12({ sub_material }) {
  return (
    <BorderLeftBox borderColor={"#2D7A5E"} className={styles.container}>
      {sub_material.title ? <h3>{sub_material.title}</h3> : null}
      <SmallShadowBorder
        backgroundColor={"#2D7A5E"}
        textAlign="center"
        color={"white"}
      >
        <p>{sub_material.note}</p>
      </SmallShadowBorder>
      <br />
      <div className="splitTwo">
        {sub_material.explain.map((item, i) => {
          const color = i % 2 == 0 ? "#C5502A" : "#2D7A5E";
          const bgColor = i % 2 == 0 ? "#FFF0ED" : "#EFF5F2";

          return (
            <div
              key={i}
              className={styles.box}
              style={{ borderColor: color, backgroundColor: bgColor }}
            >
              <b>{item.status}</b>
              {Array.isArray(item.sentences) ? (
                <div className={styles.wrap}>
                  <ListSentence material={item.sentences}/>
                </div>
              ) : (
                <h4 dangerouslySetInnerHTML={{ __html: item.sentences }} />
              )}
              <p dangerouslySetInnerHTML={{ __html: item.note }} />
            </div>
          );
        })}
      </div>
    </BorderLeftBox>
  );
}
