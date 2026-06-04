"use client";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import { FirstExplainVer4 } from "@/app/components/FirstExplain";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import { TemplateVer14, TemplateVer13 } from "@/app/components/other_material";

export default function AgreementAfterExpressionOfQuality() {
  const main_material = material.materials.find(
    (material) => material.part_id == 3,
  );
  const sub_material = main_material.sub_modules.find(
    (material) => material.sub_module_id == 3,
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
      <FirstExplainVer4 material={sub_material.content[0]} />

      <TemplateVer13 sub_material={sub_material.content[1]} />
      <TemplateVer14 sub_material={sub_material.content[2]} />
      <ToeflTips material={sub_material.content[3]} />
      <FooterMaterial
        title={sub_material.title}
        isEnd={currentId == length}
        color="#E8A838"
        main_part_title={main_material.part_title}
      />
    </div>
  );
}
