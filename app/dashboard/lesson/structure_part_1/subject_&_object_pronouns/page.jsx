"use client";

import { useState, useEffect } from "react";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import { FirstExplainVer1 } from "@/app/components/FirstExplain";
import TableMaterial from "@/app/components/TableMaterial";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import { TemplateVer3, TemplateVer4 } from "@/app/components/OtherMaterialTemplate";

export default function SingularPluralPronouns() {
  const [hasAnswered, setHasAnswered] = useState(false);

  const main_material = material.materials.find(
    (material) => material.part_id == 1,
  );
  const sub_material = main_material.sub_modules.find(
    (material) => material.sub_module_id == 3,
  );

  const currentId = sub_material.sub_module_id;
  const length = main_material.sub_modules.length;

  useEffect(() => {
    if (main_material && currentId) {
      setHasAnswered(true);
      
      const storageKey = `module_status_part_${main_material.part_id}_mod_${currentId}`;
      
      // Mencegah dispatch event berulang secara terus-menerus jika status sudah completed
      if (localStorage.getItem(storageKey) !== "completed") {
        localStorage.setItem(storageKey, "completed");
        window.dispatchEvent(new Event("practice-completed"));
      }
    }
  }, [currentId, main_material]);

  return (
    <div>
      <HeaderMaterial
        currentId={currentId}
        length={length}
        sub_material={sub_material}
        borderColor="#C5502A"
      />

      <FirstExplainVer1 sub_material={sub_material} />
      <TableMaterial
        material={sub_material.content[1]}
        styleHeader={[{ textAlign: "start" }]}
        styleData={[
          { fontWeight: "700" },
          { textAlign: "center", color: "#C5502A" },
          { textAlign: "center", color: "#2D7A5E" },
        ]}
      />
      <TemplateVer3 material={sub_material.content[2]} />
      <TemplateVer4 material={sub_material.content[3]} />
      <ToeflTips material={sub_material.content[4]} />
      
      <FooterMaterial 
        title={sub_material.title} 
        isEnd={currentId == length} 
        main_part_title={main_material.part_title} 
        part_id={main_material.part_id}
        sub_module_id={sub_material.sub_module_id}
        isButtonDisabled={!hasAnswered} 
      />
    </div>
  );
}