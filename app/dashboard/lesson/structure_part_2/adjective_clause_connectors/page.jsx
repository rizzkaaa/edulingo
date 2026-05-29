"use client";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import { FirstExplainVer9 } from "@/app/components/FirstExplain";
import TrueFalse from "@/app/components/TrueFalse";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import { GroupColorBorderShadow } from "@/app/components/GroupColorBorderShadow";
import { TemplateVer8 } from "@/app/components/OtherMaterialTemplate";

export default function AdjectiveClauseConnectors() {
  const main_material = material.materials.find(
    (material) => material.part_id == 2,
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
        borderColor="#E8A838"
        sub_material={sub_material}
      />
      <FirstExplainVer9 material={sub_material.content[0]} />
      <TemplateVer8 material={sub_material.content[1].explain} />
      <GroupColorBorderShadow
        version={2}
        materials={sub_material.content[2].explain}
      />
      <TrueFalse material={sub_material.content[3]} />
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
