"use client";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import { FirstExplainVer7 } from "@/app/components/FirstExplain";
import TrueFalse from "@/app/components/TrueFalse";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import { GroupColorBorderShadow } from "@/app/components/GroupColorBorderShadow";
import ImportantRule from "@/app/components/ImportantRule";

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
      {/* <FirstExplainVer7 material={sub_material.content[0]} /> */}
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
      />
    </div>
  );
}
