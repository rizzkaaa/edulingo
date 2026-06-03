"use client";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import { FirstExplainVer3 } from "@/app/components/FirstExplain";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import TableMaterial from "@/app/components/TableMaterial";
import { TemplateVer10, TemplateVer9 } from "@/app/components/other_material";

export default function SubjectVerbAgreement() {
  const main_material = material.materials.find(
    (material) => material.part_id == 3,
  );
  const sub_material = main_material.sub_modules.find(
    (material) => material.sub_module_id == 1,
  );

  const currentId = sub_material.sub_module_id;
  const length = main_material.sub_modules.length;

  return (
    <div>
      <HeaderMaterial
        currentId={currentId}
        length={length}
        borderColor="#E8A838"
        sub_material={sub_material}
      />
      <FirstExplainVer3 sub_material={sub_material.content[0]} />
      <TemplateVer9 sub_material={sub_material.content[1]}/>
      <TemplateVer10 sub_material={sub_material.content[2]}/>
     <TableMaterial material={sub_material.content[3]} styleHeader={[{ textAlign: "start" }, { textAlign: "start" }, { textAlign: "start" }]} styleData={[{ fontWeight: "700" }]}/>
      <ToeflTips material={sub_material.content[4]} />
      <FooterMaterial
        title={sub_material.title}
        isEnd={currentId == length}
        color="#E8A838"
        main_part_title={main_material.part_title}
      />
    </div>
  );
}
