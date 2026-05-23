import styles from "./TableMaterial.module.css";

export default function TableMaterial({ material, styleHeader, styleData }) {
  console.log(material);

  return (
    <div className={styles.container}>
      <h3>{material.title}</h3>
      <table>
        <thead>
          <tr>
            {material.explain.header.map((data, i) => (
              <th key={i} style={{...styleHeader}}>{data}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {material.explain.data.map((row, i) => (
            <tr key={i}>
              {row.map((data, j) => (
                <td key={j}  style={{...styleData[j]}}>{data}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
