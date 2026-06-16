"use client";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import ComparisonTable from "@/app/components/ComparisonTable";
import { FirstExplainVer11 } from "@/app/components/first_explain";
import { TemplateVer9 } from "@/app/components/other_material";
import { WithText } from "@/app/components/MultipleChoice";

export default function ReferencesQuestions() {
  const main_material = material.materials.find(
    (material) => material.part_id == 6,
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
        borderColor="#C5502A"
        sub_material={sub_material}
      />
      <FirstExplainVer11 material={sub_material.content[0]} divider={true} />
      <TemplateVer9 sub_material={sub_material.content[1]} grey={false} />
      <ComparisonTable material={sub_material.content[2]} styleData={[{fontWeight: "bold"}]}/>
      <WithText material={sub_material.content[3]}/>
      <ToeflTips material={sub_material.content[4]} />
      <FooterMaterial
        color="#E8A838"
        title={sub_material.title}
        isEnd={currentId == length}
        main_part_title={main_material.part_title}
      />
    </div>
  );
}
