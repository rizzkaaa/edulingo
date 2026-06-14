import styles from "./TemplateVer22.module.css";
import BorderLeftBox from "../BorderLeftBox";
import { LuBookOpen, LuRepeat, LuLightbulb } from "react-icons/lu";
import SmallShadowBorder from "../SmallShadowBorder";
import BoxList from "../BoxList";
import ColorBorderShadow from "../ColorBorderShadow";

export default function TemplateVer22({ material }) {
  const huruf = ["A", "B", "C", "D"];

  return (
    <SmallShadowBorder backgroundColor={"#fdfaf5"} className={styles.container}>
      <h3>
        {material.title} <LuBookOpen />
      </h3>
      <p className={styles.definition}>{material.definition}</p>
      <div className={styles.options}>
        {material.options.map((option, i) => {
          return (
            <SmallShadowBorder key={i} className={styles.option}>
              <p>Q{i + 1}</p>
              <div>
                {option.map((item, j) => (
                  <div key={j}>
                    <span>({huruf[j]})</span> <span>{item}</span>
                  </div>
                ))}
              </div>
            </SmallShadowBorder>
          );
        })}
      </div>

      <BorderLeftBox borderColor={"#e8a838"} backgroundColor={"#FEFCE8"}>
        <h4 style={{ color: "#D3542B" }}>VISUAL ANALYSIS AREA</h4>
        <br />
        <div className={styles.options}>
          <BoxList items={material.keywords} backgroundColor={"#e8a838"} />
        </div>
      </BorderLeftBox>
      <div className={styles.options}>
        <SmallShadowBorder
          className={styles.container}
          backgroundColor={"#2D5A4C"}
          color={"white"}
        >
          <h5>CONCLUSION BOX</h5>
          {material.conclusion.map((item, i) => {
            return (
              <div key={i}>
                {i == 0 ? <LuRepeat /> : <LuLightbulb />} <b>{item}</b>
              </div>
            );
          })}
        </SmallShadowBorder>
        <ColorBorderShadow borderColor={"#D3542B"} className={styles.container}>
          <h5>The idea that appears in all three sets of answers is :</h5>
          <i>➡ {material.summary.repeated_concept}</i>
          
          <p>So the topic will probably be ...</p>
          <i>➡ {material.summary.predicted_topic}</i>
        </ColorBorderShadow>
      </div>
    </SmallShadowBorder>
  );
}
