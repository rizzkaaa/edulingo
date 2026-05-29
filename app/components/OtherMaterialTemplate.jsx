import styles from "./OtherMaterialTemplate.module.css";
import SmallShadowBorder from "./SmallShadowBorder";
import BoxList from "./BoxList";
import React from "react";
import { LuCircleCheck, LuX } from "react-icons/lu";
import BorderLeftBox from "./BorderLeftBox";

export function TemplateVer1({ material }) {
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

export function TemplateVer5({ material }) {
  return (
    <BorderLeftBox
      borderColor={"#C5502A"}
      backgroundColor={"#FAE8E3"}
      className={styles.container5}
    >
      <h3>{material.title}</h3>
      <div className="splitTwo">
        {material.explain.map((item, i) => (
          <SmallShadowBorder
            key={i}
            backgroundColor={i == 0 ? "#E8F4EF" : "#FAE8E3"}
            className={styles.sentences}
          >
            <h2 style={{ color: i == 0 ? "#2D7A5E" : "#C5502A" }}>
              {item.label}
            </h2>
            <p>{item.description}</p>
            <p dangerouslySetInnerHTML={{ __html: item.example }} />
          </SmallShadowBorder>
        ))}
      </div>
      <div className={styles.note}>{material.note}</div>
    </BorderLeftBox>
  );
}

export function TemplateVer6({ material }) {
  return (
    <BorderLeftBox
      borderColor={"#E8A838"}
      backgroundColor={"#FAEEDA"}
      className={styles.container6}
    >
      <h3>{material.title}</h3>
      <br />
      {material.explain.map((item, i) => (
        <div key={i} className={styles.list}>
          <div>
            <h4>{item.sentence}</h4>
            <p>{item.explanation}</p>
          </div>
          <h4
            style={{
              backgroundColor: item.status == "BENAR ✓" ? "#2D7A5E" : "#C5502A",
            }}
          >
            {item.status}
          </h4>
        </div>
      ))}
    </BorderLeftBox>
  );
}

export function TemplateVer7({ material }) {
  return (
    <BorderLeftBox
      backgroundColor={"#FAE8E3"}
      borderColor={"#C5502A"}
      className={styles.container8}
    >
      <h3>{material.title}</h3>
      <div className="splitTwo">
        {material.explain.map((item, i) => (
          <div className={styles.box} key={i}>
            <SmallShadowBorder
              color="white"
              backgroundColor={i == 1 ? "#2D7A5E" : "#C5502A"}
            >
              {item.status}
            </SmallShadowBorder>
            <div className={styles.sentences}>
              {item.sentences.map((sentence, j) => (
                <SmallShadowBorder
                  key={j}
                  backgroundColor={i == 1 ? "#E8F4EF" : "#FAE8E3"}
                  className={styles.wrap}
                >
                  {i == 1 ? (
                    <LuCircleCheck style={{ color: "#2D7A5E" }} />
                  ) : (
                    <LuX style={{ color: "#C5502A" }} />
                  )}{" "}
                  <div>
                    <p className={i == 0 ? "wrongSentence" : ""}>
                      {sentence.text}
                    </p>
                    <p>{sentence.note}</p>
                  </div>
                </SmallShadowBorder>
              ))}
            </div>
          </div>
        ))}
      </div>
    </BorderLeftBox>
  );
}

export function TemplateVer8({}){}