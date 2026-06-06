import { LuCheck, LuCircleCheck } from "react-icons/lu";
import BorderLeftBox from "../BorderLeftBox";
import SmallShadowBorder from "../SmallShadowBorder";
import styles from "./TemplateVer14.module.css";

export default function TemplateVer14({ sub_material, fontWeight = "bold" }) {
  return (
    <BorderLeftBox borderColor={"#2D7A5E"} className={styles.container}>
      <h3>{sub_material.title}</h3>
      {sub_material.explain.map((item, i) => {
        return (
          <div className={styles.wrap} key={i}>
            <SmallShadowBorder backgroundColor={"#F5F1EA"}>
              <p
                style={{ fontWeight: fontWeight }}
                dangerouslySetInnerHTML={{ __html: item.question }} className={styles.question}
              />
            </SmallShadowBorder>
            {item.realQuestion ? <h4>{item.realQuestion}</h4> : null}

            <SmallShadowBorder
              className={styles.clue}
              backgroundColor={"#E8A838"}
            >
              {item.clue}
            </SmallShadowBorder>
            <SmallShadowBorder color={"white"} backgroundColor={"#2D7A5E"}>
              <p className={styles.answer}>
                <LuCircleCheck /> {item.answer}
              </p>
            </SmallShadowBorder>
          </div>
        );
      })}
    </BorderLeftBox>
  );
}
