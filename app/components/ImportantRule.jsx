import styles from "./ImportantRule.module.css";
import BorderLeftBox from "./BorderLeftBox";
import ListSentence from "./ListSentences";
import SmallShadowBorder from "./SmallShadowBorder";
import { LuCircleCheck, LuX } from "react-icons/lu";

export default function ImportantRule({ material }) {
  return (
    <div className={styles.container}>
      <BorderLeftBox borderColor={"#C5502A"} backgroundColor={"#FAE8E3"}>
        <h3>{material.title}</h3>
        <ListSentence material={material.explain.sentences} />
        <div className={styles.box}>
          {material.explain.example.map((item, i) => (
            <SmallShadowBorder
              backgroundColor={i == 0 ? "#E8F4EF" : ""}
              key={i}
              className={styles.list}
            >
              <div className={i == 1 ? "wrongSentence" : ""}>
                {i == 0 ? (
                  <LuCircleCheck style={{ color: "#2D7A5E" }} />
                ) : (
                  <LuX style={{ color: "#C5502A" }} />
                )}{" "}
                <p dangerouslySetInnerHTML={{ __html: item }} />
              </div>
            </SmallShadowBorder>
          ))}
        </div>
      </BorderLeftBox>
    </div>
  );
}
