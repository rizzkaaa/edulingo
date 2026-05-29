"use client";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import { FirstExplainVer4 } from "@/app/components/FirstExplain";
import TrueFalse from "@/app/components/TrueFalse";
import TableMaterial from "@/app/components/TableMaterial";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import { TemplateVer5, TemplateVer6 } from "@/app/components/OtherMaterialTemplate";

export default function PossessivePronouns() {
  const main_material = material.materials.find(
    (material) => material.part_id == 1,
  );
  const sub_material = main_material.sub_modules.find(
    (material) => material.sub_module_id == 4,
  );

  const currentId = sub_material.sub_module_id;
  const length = main_material.sub_modules.length;

  return (
    <div>
      <HeaderMaterial
        currentId={currentId}
        length={length}
        sub_material={sub_material}
      />

      <FirstExplainVer4 sub_material={sub_material} />
      <TableMaterial
        material={sub_material.content[1]}
        styleHeader={[{ textAlign: "start" }]}
        styleData={[
          { fontWeight: "700" },
          { textAlign: "center", color: "#C5502A" },
          { textAlign: "center", color: "#2D7A5E" },
        ]}
      />
      <TemplateVer5 material={sub_material.content[2]} />
      <TemplateVer6 material={sub_material.content[3]} />
      <ToeflTips material={sub_material.content[4]} />
      <FooterMaterial title={sub_material.title} isEnd={currentId == length} main_part_title={main_material.part_title} />
    </div>
  );
}
