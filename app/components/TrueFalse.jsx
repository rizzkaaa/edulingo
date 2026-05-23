import styles from "./TrueFalse.module.css";
import { LuCircleCheck, LuX } from "react-icons/lu";
import SmallShadowBorder from "@/app/components/SmallShadowBorder";

export default function TrueFalse({ material }) {
  return (
    <div className={styles.container}>
      <h3>{material.title}</h3>
      <div>
        {material.explain.map((item, i) => (
          <div className={styles.box} key={i}>
            <SmallShadowBorder
              color="white"
              backgroundColor={i == 0 ? "#2D7A5E" : "#C5502A"}
            >
              {item.status}
            </SmallShadowBorder>
            <div className={styles.examples}>
              {item.sentences.map((sentence) => (
                <p
                  key={sentence}
                  className={i == 1 ? styles.wrongSentence : ""}
                >
                  {i == 0 ? (
                    <LuCircleCheck style={{ color: "#2D7A5E" }} />
                  ) : (
                    <LuX style={{ color: "#C5502A" }} />
                  )}{" "}
                  {sentence}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
