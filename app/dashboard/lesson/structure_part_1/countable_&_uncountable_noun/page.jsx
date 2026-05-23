"use client";
import styles from "./page.module.css";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import { FirstExplainVer1 } from "@/app/components/FirstExplain";
import TrueFalse from "@/app/components/TrueFalse";
import TableMaterial from "@/app/components/TableMaterial";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";

export default function CountableUncountableNouns() {
  const main_material = material.materials.find(
    (material) => material.part_id == 1,
  );
  const sub_material = main_material.sub_modules.find(
    (material) => material.sub_module_id == 2,
  );

  const currentId = sub_material.sub_module_id;
  const length = main_material.sub_modules.length;

  return (
    <div className={styles.container}>
      <HeaderMaterial
        currentId={currentId}
        length={length}
        sub_material={sub_material}
      />
 kata kunci
      {/* <FirstExplainVer1 sub_material={sub_material} /> */}
      <TrueFalse material={sub_material.content[2]} />
      {/* <TableMaterial material={sub_material.content[2]} styleHeader={{textAlign: 'start'}} styleData={[{fontWeight: '700'}]}/> */}
      cara hitung
      <ToeflTips material={sub_material.content[4]}/>
<FooterMaterial title={sub_material.title} isEnd={currentId == length}/>
    </div>
  );
}
