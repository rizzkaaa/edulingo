"use client";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import { FirstExplainVer5 } from "@/app/components/FirstExplain";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import { Ver1, Ver2, Ver3, Ver4, TemplateVer16 } from "@/app/components/other_material";

export default function AgreementAfterCertainWords() {
  const main_material = material.materials.find(
    (material) => material.part_id == 3,
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
        borderColor="#C5502A"
        sub_material={sub_material}
      />
      <FirstExplainVer5 material={sub_material.content[0]} />

      <Ver1 sub_material={sub_material.content[1]} />
      <Ver2 sub_material={sub_material.content[2]} />
      <Ver3 sub_material={sub_material.content[3]} />
      <Ver4 sub_material={sub_material.content[4]} />
      <TemplateVer16 material={sub_material.content[5]} />
      <ToeflTips material={sub_material.content[6]} />
      <FooterMaterial
        title={sub_material.title}
        isEnd={currentId == length}
        color="#E8A838"
        main_part_title={main_material.part_title}
      />
    </div>
  );
}
