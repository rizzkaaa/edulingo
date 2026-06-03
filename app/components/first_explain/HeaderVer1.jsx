import styles from "./HeaderVer1.module.css";

export default function HeaderVer1({ item, i }) {
  return (
    <>
      <div className={styles.title}>
        <div>
          {item.subtitle ? (
            <h5 style={{ backgroundColor: i == 0 ? "#C5502A" : "#2D7A5E" }}>
              {item.subtitle}
            </h5>
          ) : (
            <></>
          )}
          <h3>{item.title}</h3>
        </div>
        <p style={{ color: i == 0 ? "#C5502A" : "#2D7A5E" }}>{item.label}</p>
      </div>
      <p className={styles.definition}>{item.definition}</p>
    </>
  );
}
