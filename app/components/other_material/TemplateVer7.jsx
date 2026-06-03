import styles from "./TemplateVer7.module.css";
import SmallShadowBorder from "../SmallShadowBorder";
import { LuCircleCheck, LuX } from "react-icons/lu";
import BorderLeftBox from "../BorderLeftBox";

export default function TemplateVer7({ material }) {
  return (
    <BorderLeftBox
      backgroundColor={"#FAE8E3"}
      borderColor={"#C5502A"}
      className={styles.container7}
    >
      <h3>{material.title}</h3>
      <div className="splitTwo">
        {material.explain.map((item, i) => (
          <div className={styles.box} key={i}>
            <SmallShadowBorder
              color="white"
              backgroundColor={i == 1 ? "#2D7A5E" : "#C5502A"}
            >
              {item.status}
            </SmallShadowBorder>
            <div className={styles.sentences}>
              {item.sentences.map((sentence, j) => (
                <SmallShadowBorder
                  key={j}
                  backgroundColor={i == 1 ? "#E8F4EF" : "#FAE8E3"}
                  className={styles.wrap}
                >
                  {i == 1 ? (
                    <LuCircleCheck style={{ color: "#2D7A5E" }} />
                  ) : (
                    <LuX style={{ color: "#C5502A" }} />
                  )}{" "}
                  <div>
                    <p className={i == 0 ? "wrongSentence" : ""}>
                      {sentence.text}
                    </p>
                    <p>{sentence.note}</p>
                  </div>
                </SmallShadowBorder>
              ))}
            </div>
          </div>
        ))}
      </div>
    </BorderLeftBox>
  );
}
