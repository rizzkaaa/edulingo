import styles from "./TemplateVer3.module.css";
import SmallShadowBorder from "../SmallShadowBorder";
import { LuCircleCheck } from "react-icons/lu";
import BorderLeftBox from "../BorderLeftBox";

export default function TemplateVer3({ material }) {
  return (
    <BorderLeftBox
      borderColor={"#e8a838"}
      backgroundColor={"#fdfaf5"}
      className={styles.container3}
    >
      <h3>{material.title}</h3>
      <div className="splitTwo">
        {material.explain.map((item, i) => (
          <div className={styles.box} key={i}>
            <SmallShadowBorder
              color={i == 0 ? "black" : "white"}
              backgroundColor={i == 0 ? "#E8A838" : "#2D7A5E"}
            >
              {item.title}
            </SmallShadowBorder>
            <div className={styles.sentences}>
              <SmallShadowBorder
                backgroundColor={i == 0 ? "#FAE8E3" : "#E8F4EF"}
              >
                <h4 dangerouslySetInnerHTML={{ __html: item.rule }} />
              </SmallShadowBorder>
              {item.sentences.map((sentence) => (
                <SmallShadowBorder key={sentence} backgroundColor={"#FDFAF5"}>
                  <p>
                    <LuCircleCheck style={{ color: "#2D7A5E" }} />
                    {sentence}
                  </p>
                </SmallShadowBorder>
              ))}
            </div>
          </div>
        ))}
      </div>
    </BorderLeftBox>
  );
}
