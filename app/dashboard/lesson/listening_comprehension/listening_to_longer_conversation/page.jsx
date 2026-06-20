"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import { GroupColorBorderShadow } from "@/app/components/GroupColorBorderShadow";
import { WithAudio } from "@/app/components/MultipleChoice";

export default function ListeningToLongerConversation() {
  const [hasAnswered, setHasAnswered] = useState(false);
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");

  const main_material = material.materials.find(
    (material) => material.part_id == 7,
  );
  const sub_material = main_material.sub_modules.find(
    (material) => material.sub_module_id == 2,
  );

  const currentId = sub_material.sub_module_id;
  const length = main_material.sub_modules.length;

  // 🌟 LOGIKA USE EFFECT YANG DISAMAKAN
  useEffect(() => {
    if (main_material && currentId) {
      // Menggunakan variabel dinamis untuk key localStorage
      const storageKey = `module_status_part_${main_material.part_id}_mod_${currentId}`;

      const isAlreadyCompleted = localStorage.getItem(storageKey) === "completed";
      const isNewlyCompleted = statusParam === "completed";

      if (isAlreadyCompleted || isNewlyCompleted) {
        setHasAnswered(true);

        // Jika URL mengirimkan status completed tapi belum ada di local storage, simpan sekarang
        if (!isAlreadyCompleted && isNewlyCompleted) {
          localStorage.setItem(storageKey, "completed");
          window.dispatchEvent(new Event("practice-completed"));
        }
      } else {
        setHasAnswered(false);
      }
    }
  }, [currentId, statusParam, main_material]);

  // 🌟 LOGIKA HANDLE ANSWERED YANG DIPERBARUI
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
      
      {/* 🌟 Menggunakan handleAnswered di sini */}
      <WithAudio 
        material={sub_material.content[1]} 
        onAnswered={handleAnswered}
      />
      
      <ToeflTips material={sub_material.content[2]} />
      
      <FooterMaterial
        color="#E8A838"
        title={sub_material.title}
        isEnd={currentId == length}
        main_part_title={main_material.part_title}
        part_id={main_material.part_id}
        sub_module_id={sub_material.sub_module_id}
        isButtonDisabled={!hasAnswered} // 🌟 Status penguncian tersambung ke state
      />
    </div>
  );
}