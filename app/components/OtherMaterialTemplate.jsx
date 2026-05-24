import styles from "./OtherMaterialTemplate.module.css";
import SmallShadowBorder from "./SmallShadowBorder";
import BoxList from "./BoxList";
import React from "react";
import { LuCircleCheck } from "react-icons/lu";
import BorderLeftBox from "./BorderLeftBox";

export function TemplateVer1({ material }) {
  return (
    <BorderLeftBox
      borderColor={"#e8a838"}
      backgroundColor={"#fdfaf5"}
      className={styles.container1}
    >
      <h3>{material.title}</h3>
      <div className={styles.splitTwo}>
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

export function TemplateVer2({ material }) {
  return (
    <div className={styles.container2}>
      <h3>{material.title}</h3>
      <div>
        <BoxList
          items={material.explain}
          backgroundColor={"#E8A838"}
          textAlign="center"
        />
      </div>
      <p>{material.note}</p>
    </div>
  );
}

export function TemplateVer3({ material }) {
  return (
    <BorderLeftBox
      borderColor={"#e8a838"}
      backgroundColor={"#fdfaf5"}
      className={styles.container3}
    >
      <h3>{material.title}</h3>
      <div className={styles.splitTwo}>
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

export function TemplateVer4({ material }) {
  return (
    <BorderLeftBox
      backgroundColor={"#FAE8E3"}
      borderColor={"#C5502A"}
      className={styles.container4}
    >
      <h3>{material.title}</h3>
      <div className={styles.box}>
        <SmallShadowBorder backgroundColor={"#E8A838"}>
          SUBJECT PRONOUN
        </SmallShadowBorder>
        <div className={styles.sentences}>
          {material.explain.map((item, i) => (
            <SmallShadowBorder key={i} backgroundColor={"#FDFAF5"}>
              <p dangerouslySetInnerHTML={{ __html: item.sentence }} />
              <p className={styles.note}>{item.note}</p>
            </SmallShadowBorder>
          ))}
        </div>
      </div>
    </BorderLeftBox>
  );
}
