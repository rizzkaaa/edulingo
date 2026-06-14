import styles from "./LabelValueMaterial.module.css";

export default function LabelValueMaterial({ materials }) {
  const colors = [
    {
      color: "#2C2A26",
      bgColor: "#E8A838",
    },
    {
      color: "white",
      bgColor: "#2D7A5E",
    },
    {
      color: "white",
      bgColor: "#C5502A",
    },
  ];

  return (
    <>
      {materials.map((material, i) => {
        const color = colors[i % 3].color;
        const bgColor = colors[i % 3].bgColor;

        return (
          <div key={i} className={styles.container}>
            <b
              style={{
                color: color,
                backgroundColor: bgColor,
              }}
            >
              {material.label}
            </b>
            <p>{material.value}</p>
          </div>
        );
      })}
    </>
  );
}
