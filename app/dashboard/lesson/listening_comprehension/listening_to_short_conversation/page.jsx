"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import { TemplateVer21 } from "@/app/components/other_material";
import { GroupColorBorderShadow } from "@/app/components/GroupColorBorderShadow";
import ComparisonTable from "@/app/components/ComparisonTable";
import { WithAudio } from "@/app/components/MultipleChoice";

export default function ListeningToShortConversation() {
  const [hasAnswered, setHasAnswered] = useState(false);
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");

  const main_material = material.materials.find(
    (material) => material.part_id == 7,
  );
  const sub_material = main_material.sub_modules.find(
    (material) => material.sub_module_id == 1,
  );

  const currentId = sub_material.sub_module_id;
  const length = main_material.sub_modules.length;

  useEffect(() => {
    if (main_material && currentId) {
      const storageKey = `module_status_part_${main_material.part_id}_mod_${currentId}`;

      const isAlreadyCompleted = localStorage.getItem(storageKey) === "completed";
      const isNewlyCompleted = statusParam === "completed";

      if (isAlreadyCompleted || isNewlyCompleted) {
        setHasAnswered(true);

        if (!isAlreadyCompleted && isNewlyCompleted) {
          localStorage.setItem(storageKey, "completed");
          window.dispatchEvent(new Event("practice-completed"));
        }
      } else {
        setHasAnswered(false);
      }
    }
  }, [currentId, statusParam, main_material]);

  const handleAnswered = () => {
    setHasAnswered(true);
    const storageKey = `module_status_part_${main_material.part_id}_mod_${currentId}`;
    localStorage.setItem(storageKey, "completed");
    window.dispatchEvent(new Event("practice-completed"));
  };

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
      <ComparisonTable material={sub_material.content[1]} />
      <TemplateVer21 material={sub_material.content[2]} />
      
      {/* Jika user menjawab audio di dalam halaman ini, tombol footer akan terbuka */}
      <WithAudio 
        material={sub_material.content[3]} 
        onAnswered={handleAnswered}
      />
      <WithAudio 
        material={sub_material.content[4]} 
        onAnswered={handleAnswered}
      />
      
      <ToeflTips material={sub_material.content[5]} />
      
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