"use client";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import { FirstExplainVer1, FirstExplainVer5 } from "@/app/components/FirstExplain";
import TrueFalse from "@/app/components/TrueFalse";
import TableMaterial from "@/app/components/TableMaterial";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import { TemplateVer7 } from "@/app/components/OtherMaterialTemplate";

export default function AdjectiveAdverb() {
  const main_material = material.materials.find(
    (material) => material.part_id == 1,
  );
  const sub_material = main_material.sub_modules.find(
    (material) => material.sub_module_id == 5,
  );

  const currentId = sub_material.sub_module_id;
  const length = main_material.sub_modules.length;

  return (
    <div>
      <HeaderMaterial
        currentId={currentId}
        length={length}
        sub_material={sub_material}
        borderColor="#C5502A"
      />

      <FirstExplainVer5 sub_material={sub_material} />
      <TableMaterial
        material={sub_material.content[1]}
        styleHeader={[]}
        styleData={[
          { textAlign: "center", color: "#C5502A" },
          { textAlign: "center", color: "#2D7A5E" },
          { textAlign: "center", fontWeight: "700" },
        ]}
      />
      <TableMaterial
        material={sub_material.content[2]}
        styleHeader={[]}
        styleData={[
          { textAlign: "center", color: "#C5502A", fontWeight: "700" },
          { textAlign: "center" },
          { textAlign: "center"},
        ]}
      />
      <TemplateVer7 material={sub_material.content[3]} />
      <ToeflTips material={sub_material.content[4]} />
      <FooterMaterial title={sub_material.title} isEnd={currentId == length} main_part_title={main_material.part_title} />
    </div>
  );
}
