"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import { TemplateVer23, TemplateVer22 } from "@/app/components/other_material";
import { GroupColorBorderShadow } from "@/app/components/GroupColorBorderShadow";
import { WithAudio } from "@/app/components/MultipleChoice";

export default function ListeningToTalksAndNoteTaking() {
  const [hasAnswered, setHasAnswered] = useState(false);
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");

  const main_material = material.materials.find(
    (material) => material.part_id == 7,
  );
  const sub_material = main_material.sub_modules.find(
    (material) => material.sub_module_id == 3,
  );

  const currentId = sub_material.sub_module_id;
  const length = main_material.sub_modules.length;

  useEffect(() => {
    const isCompleted = 
      localStorage.getItem(`module_status_part_7_mod_${currentId}`) === "completed" || 
      statusParam === "completed";
      
    if (isCompleted) {
      setHasAnswered(true);
    }
  }, [currentId, statusParam]);

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
      <TemplateVer22 material={sub_material.content[1]} />
      <TemplateVer23 material={sub_material.content[2]} />
      
      <WithAudio 
        material={sub_material.content[3]} 
        onAnswered={() => {
          setHasAnswered(true);
          localStorage.setItem(`module_status_part_7_mod_${currentId}`, "completed");
          window.dispatchEvent(new Event("practice-completed"));
        }}
      />
      
      <ToeflTips material={sub_material.content[4]} />
      <FooterMaterial
        color="#E8A838"
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