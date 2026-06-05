import BorderLeftBox from "../BorderLeftBox";
import SmallShadowBorder from "../SmallShadowBorder";
import styles from "./TemplateVer14.module.css";

export default function TemplateVer14({ sub_material }) {
  return (
    <BorderLeftBox borderColor={"#2D7A5E"} className={styles.container}>
      <h3>{sub_material.title}</h3>
      {sub_material.explain.map((item, i) => {
        return <div className={styles.wrap} key={i}>
          <SmallShadowBorder backgroundColor={'#F5F1EA'}>{item.question}</SmallShadowBorder>
          <SmallShadowBorder className={styles.clue} backgroundColor={'#E8A838'}>{item.clue}</SmallShadowBorder>
          <SmallShadowBorder color={'white'} backgroundColor={'#2D7A5E'}>{item.answer}</SmallShadowBorder>
        </div>;
      })}
    </BorderLeftBox>
  );
}
