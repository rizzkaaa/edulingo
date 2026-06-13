import styles from "./ComparisonTable.module.css";
import {
  LuMoveHorizontal,
  LuArrowLeftRight,
  LuPanelLeftClose,
  LuColumns2,
} from "react-icons/lu";
import { TbArrowsMinimize } from "react-icons/tb";
import { TbArrowsHorizontal } from "react-icons/tb";
import { TbFoldDown } from "react-icons/tb";
import { BsArrowsCollapse } from "react-icons/bs";
import { BsArrowsAngleContract } from "react-icons/bs";

export default function ComparisonTable({
  material,
  styleHeader = [],
  styleData = [],
}) {
  return (
    <table className={styles.container}>
      <thead>
        <tr>
          <th colSpan={2}>
            <svg
              width="20"
              height="16"
              viewBox="0 0 20 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 16L4.6 14.575L7.175 12H0V10H7.175L4.6 7.425L6 6L11 11L6 16ZM14 10L9 5L14 0L15.4 1.425L12.825 4H20V6H12.825L15.4 8.575L14 10Z"
                fill="white"
              />
            </svg>
            {material.title}
          </th>
        </tr>
        <tr>
          {material.explain.header.map((data, i) => (
            <th key={i} style={{ ...styleHeader[i] }}>
              {data}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {material.explain.data.map((row, i) => (
          <tr key={i}>
            {row.map((data, j) => (
              <td key={j} style={{ ...styleData[j] }}>
                <p
                  dangerouslySetInnerHTML={{ __html: data }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
