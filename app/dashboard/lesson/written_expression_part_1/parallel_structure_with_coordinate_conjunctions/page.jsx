"use client";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import { FirstExplainVer11 } from "@/app/components/FirstExplain";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import { TemplateVer20, TemplateVer9 } from "@/app/components/other_material";
import { GroupColorBorderShadow } from "@/app/components/GroupColorBorderShadow";
import TableMaterial from "@/app/components/TableMaterial";

export default function ParallelStructureWithCoordinateConjunctions() {
  const main_material = material.materials.find(
    (material) => material.part_id == 3,
  );
  const sub_material = main_material.sub_modules.find(
    (material) => material.sub_module_id == 6,
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
      <FirstExplainVer11 material={sub_material.content[0]} />
      <TemplateVer9 sub_material={sub_material.content[1]} grey={false} />
      <GroupColorBorderShadow
        version={2}
        materials={sub_material.content[2].explain}
      />
      <TemplateVer20 material={sub_material.content[3]} />
      <TableMaterial
        material={sub_material.content[4]}
        styleData={[
          { fontWeight: "bold" },
          { fontStyle: "italic" },
          { fontStyle: "italic" },
        ]}
        styleHeader={[
          { textAlign: "start" },
          { textAlign: "start" },
          { textAlign: "start" },
        ]}
      />

      <ToeflTips material={sub_material.content[5]} />
      <FooterMaterial
        title={sub_material.title}
        isEnd={currentId == length}
        color="#E8A838"
        main_part_title={main_material.part_title}
      />
    </div>
  );
}
