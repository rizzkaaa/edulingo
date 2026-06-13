import styles from "./TemplateVer21.module.css";
import BorderLeftBox from "../BorderLeftBox";
import { LuNotebookText } from "react-icons/lu";

export default function TemplateVer21({ material }) {
  const colors = ["#D9A126","#F3E7C9" , "#2D7A5E", "#C5502A"];
  let index = -1;

  return (
    <BorderLeftBox
      backgroundColor={"#FDFAF5"}
      borderColor={"#2D5A4C"}
      className={styles.container}
    >
      <div className={styles.wrap}>
        <h3>
          <LuNotebookText /> {material.title}
        </h3>
        <br />
        <div>
          {material.steps.map((item, i) => {
            if(i%2 == 0){
              index++;
            }
            return typeof item == "string" ? (
              <p key={i}>{item}</p>
            ) : (
              <div className={styles.box} key={i} >
                <div className="bullet" style={{backgroundColor: colors[index], color: i>3 ? "white" : "#2c2a26"}}>{item.number}</div>
                <h5>{item.text.toUpperCase()}</h5>
              </div>
            );
          })}
        </div>
      </div>
    </BorderLeftBox>
  );
}
