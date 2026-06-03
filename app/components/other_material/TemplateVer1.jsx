import styles from "./TemplateVer1.module.css";
import SmallShadowBorder from "../SmallShadowBorder";
import BoxList from "../BoxList";
import BorderLeftBox from "../BorderLeftBox";

export default function TemplateVer1({ material }) {
  return (
    <BorderLeftBox
      borderColor={"#e8a838"}
      backgroundColor={"#fdfaf5"}
      className={styles.container1}
    >
      <h3>{material.title}</h3>
      <div className="splitTwo">
        {material.explain.map((item, i) => (
          <div className={styles.box} key={i}>
            <SmallShadowBorder
              backgroundColor={i == 0 ? "#C5502A" : "#2D7A5E"}
              color={"white"}
            >
              {item.status}
            </SmallShadowBorder>
            <div className={styles.list}>
              <BoxList
                items={item.keywords}
                backgroundColor={i == 0 ? "#C5502A" : "#2D7A5E"}
                color={"white"}
              />
            </div>
          </div>
        ))}
      </div>
      <div className={styles.note} style={{ backgroundColor: "#FAE8E3" }}>
        {material.note}
      </div>
    </BorderLeftBox>
  );
}
