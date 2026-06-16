import styles from "./TemplateVer24.module.css";
import BorderLeftBox from "../BorderLeftBox";
import BoxList from "../BoxList";

export default function TemplateVer24({ material }) {
  return (
    <BorderLeftBox
      backgroundColor={"#FDFAF5"}
      borderColor={"#E8A838"}
      className={styles.container}
    >
      <h3>{material.title}</h3>
      <p>{material.definition}</p>
      <br />
      <div className="splitTwo">
        {material.examples.map((example, i) => (
          <div className={styles.box} key={i}>
            <div className={styles.wrap}>
              <BoxList items={example} textAlign="center" color={"white"} backgroundColor={i == 0 ? "#2D7A5E" : "#C5502A"}/>
            </div>
          </div>
        ))}
      </div>
    </BorderLeftBox>
  );
}
