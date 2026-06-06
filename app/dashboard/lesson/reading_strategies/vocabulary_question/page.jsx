"use client";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import { FirstExplainVer3 } from "@/app/components/FirstExplain";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import TableMaterial from "@/app/components/TableMaterial";
import { TemplateVer14, TemplateVer17 } from "@/app/components/other_material";

export default function VocabularyQuestion() {
  const main_material = material.materials.find(
    (material) => material.part_id == 5,
  );
  const sub_material = main_material.sub_modules.find(
    (material) => material.sub_module_id == 2,
  );

  const currentId = sub_material.sub_module_id;
  const length = main_material.sub_modules.length;

  return (
    <div>
      <HeaderMaterial
        currentId={currentId}
        length={length}
        borderColor="#C5502A"
        sub_material={sub_material}
      />

      <FirstExplainVer3 sub_material={sub_material.content[0]} reverse={true} />

      <TemplateVer14
        sub_material={sub_material.content[1]}
        fontWeight="normal"
      />
      <ToeflTips material={sub_material.content[2]} />
      <FooterMaterial
        title={sub_material.title}
        isEnd={currentId == length}
        main_part_title={main_material.part_title}
      />
    </div>
  );
}
