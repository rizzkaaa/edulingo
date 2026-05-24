import styles from "./OtherMaterialTemplate.module.css";
import SmallShadowBorder from "./SmallShadowBorder";
import BoxList from "./BoxList";
import React from "react";

export function TemplateVer1({ material }) {
  return (
    <div className={styles.container1}>
      <h3>{material.title}</h3>
      <div>
        {material.explain.map((item, i) => (
          <div className={styles.box} key={i}>
            <SmallShadowBorder backgroundColor={i == 0 ? '#C5502A':'#2D7A5E'} color={'white'}>{item.status}</SmallShadowBorder>
            <div className={styles.list}>
              <BoxList items={item.keywords} backgroundColor={i == 0 ? '#C5502A':'#2D7A5E'} color={'white'}/>
            </div>
          </div>
        ))}
      </div>
      <div
        className={styles.note}
        style={{ backgroundColor: "#FAE8E3" }}
      >
        {material.note}
      </div>
    </div>
  );
}

export function TemplateVer2({ material }){
    return <div className={styles.container2}>
        <h3>{material.title}</h3>
        <div className={styles.box}>
            <BoxList items={material.explain} backgroundColor={'#E8A838'}/>
        </div>
        <p>{material.note}</p>
    </div>
}