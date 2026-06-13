import styles from "./FirstExplainVer12.module.css";
import ColorBorderShadow from "../ColorBorderShadow";

// belum kepake
export default function FirstExplainVer12({ sub_material }) {
  const colors = {
    "#2D7A5E": {
      backgroundColor: "#E8F4EF",
      color: "white",
    },
    "#C5502A": {
      backgroundColor: "#FAE8E3",
      color: "white",
    },
    "#D9A126": {
      backgroundColor: "#FDFFCB",
      color: "#2C2A26",
    },
  };
  return (
    <div className={styles.container}>
      {sub_material.explain.map((item, i) => {
        const color = i == 0 ? "#C5502A" : "#2D7A5E";
        
        return (
          <ColorBorderShadow key={i} borderColor={color} className={styles.box}>
            <h1 style={{ color: color }}>{item.title}</h1>
            <br />
            <p>{item.definition}</p>
            <br />
            <div>
                {item.explain.map((e, j) => (
                  <div key={j} className={styles.wrap}>
                    <div style={{ backgroundColor: color }}></div>
                    <p>{e}</p>
                  </div>
                ))}
              </div>
              
          </ColorBorderShadow>
        );
      })}
    </div>
  );
}
