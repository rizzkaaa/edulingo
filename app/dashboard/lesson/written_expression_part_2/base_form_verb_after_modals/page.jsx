"use client";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import {TemplateVer2 } from "@/app/components/other_material";
import { GroupColorBorderShadow } from "@/app/components/GroupColorBorderShadow";
import { WithText } from "@/app/components/MultipleChoice";

export default function BaseFormVerbAfterModals() {
  const main_material = material.materials.find(
    (material) => material.part_id == 4,
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

      <GroupColorBorderShadow
        materials={sub_material.content[0].explain}
        version={4}
      />
      <TemplateVer2 material={sub_material.content[1]} gridTemplateColumns={"1fr 1fr 1fr"} />
      <WithText material={sub_material.content[2]} />
      <ToeflTips material={sub_material.content[3]} />
      <FooterMaterial
        color="#E8A838"
        title={sub_material.title}
        isEnd={currentId == length}
        main_part_title={main_material.part_title}
      />
    </div>
  );
}
