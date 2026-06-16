"use client";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import { FirstExplainVer11 } from "@/app/components/first_explain";
import { GroupColorBorderShadow } from "@/app/components/GroupColorBorderShadow";

export default function UnderstandingMainIdeas() {
  const main_material = material.materials.find(
    (material) => material.part_id == 6,
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
      <FirstExplainVer11 material={sub_material.content[0]} />
      <GroupColorBorderShadow materials={sub_material.content[1].explain} version={5}/>
      <ToeflTips material={sub_material.content[2]} />
      <FooterMaterial
        color="#E8A838"
        title={sub_material.title}
        isEnd={currentId == length}
        main_part_title={main_material.part_title}
      />
    </div>
  );
}
