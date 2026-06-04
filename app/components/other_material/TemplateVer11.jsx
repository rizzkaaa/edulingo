import { LuLock } from "react-icons/lu";
import SmallShadowBorder from "../SmallShadowBorder";
import styles from "./TemplateVer11.module.css";

export default function TemplateVer11({ sub_material }) {
  return (
    <div className={styles.container}>
      <h3>{sub_material.title}</h3>
      <SmallShadowBorder backgroundColor={"#F5F1EA"} textAlign="center">
        <div className={styles.wrap}>
          {sub_material.structure.map((item, i) => {
            return (
              <p className={i % 2 == 0 ? styles.sentence : styles.arrow}>
                {i == 4 ? <LuLock /> : null} {item}
              </p>
            );
          })}
        </div>
        <b>{sub_material.note}</b>
      </SmallShadowBorder>
    </div>
  );
}
