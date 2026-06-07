import BorderLeftBox from "../BorderLeftBox";
import BoxList from "../BoxList";
import styles from "./TemplateVer10.module.css";

export default function TemplateVer10({ sub_material }) {
  return (
    <BorderLeftBox borderColor={"#2D7A5E"} className={styles.container}>
      <h3>{sub_material.title}</h3>
      <p>{sub_material.description}</p>
      <div className={styles.wrap}>
        <BoxList
          items={sub_material.example}
          color={"white"}
          backgroundColor={"#2D7A5E"}
          textAlign="center"
        />
      </div>
      <div className={styles.note}>
        <p
          dangerouslySetInnerHTML={{ __html: sub_material.example_sentence }}
        />
        <br />
        <b>{sub_material.status}</b>
      </div>
    </BorderLeftBox>
  );
}
