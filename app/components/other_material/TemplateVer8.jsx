import styles from "./TemplateVer8.module.css";
import { ColorShadow } from "../ColorShadow";

export default function TemplateVer8({ material }) {
  return (
    <div className={styles.container8}>
      <ColorShadow materials={material} divider={true} />
    </div>
  );
}
