import styles from "./TemplateVer2.module.css";
import BoxList from "../BoxList";

export default function TemplateVer2({
  material,
  gridTemplateColumns = "1fr 1fr 1fr 1fr",
}) {
  return (
    <div className={styles.container2}>
      <h3>{material.title}</h3>
      <div style={{ gridTemplateColumns: gridTemplateColumns }}>
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
