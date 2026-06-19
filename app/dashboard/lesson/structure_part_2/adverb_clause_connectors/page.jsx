"use client";

import { useState, useEffect } from "react"; // 🌟 PERBAIKAN 1: Import useState & useEffect
import { useSearchParams } from "next/navigation"; // 🌟 PERBAIKAN 2: Import useSearchParams untuk deteksi status URL
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import { FirstExplainVer7 } from "@/app/components/FirstExplain";
import TrueFalse from "@/app/components/TrueFalse";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import { GroupColorBorderShadow } from "@/app/components/GroupColorBorderShadow";
import ImportantRule from "@/app/components/ImportantRule";

export default function AdverbClauseConnectors() {
  // 🌟 PERBAIKAN 3: Buat state hasAnswered untuk melacak status pengerjaan kuis
  const [hasAnswered, setHasAnswered] = useState(false);
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");

  const main_material = material.materials.find(
    (material) => material.part_id == 2,
  );
  const sub_material = main_material.sub_modules.find(
    (material) => material.sub_module_id == 2,
  );

  const currentId = sub_material.sub_module_id;
  const length = main_material.sub_modules.length;

  useEffect(() => {
    // Cek apakah modul ini sebelumnya sudah pernah diselesaikan atau dilewati
    const isCompleted = 
      localStorage.getItem(`module_status_part_2_mod_${currentId}`) === "completed" || 
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
      <FirstExplainVer7 material={sub_material.content[0]} />
      <GroupColorBorderShadow
        version={2}
        materials={sub_material.content[1].explain}
      />
      <ImportantRule material={sub_material.content[2]} />
      
      {/* 🌟 PERBAIKAN 4: Pasang fungsi perubah state onAnswered pada komponen TrueFalse */}
      <TrueFalse 
        material={sub_material.content[3]} 
        onAnswered={() => {
          setHasAnswered(true);
          localStorage.setItem(`module_status_part_2_mod_${currentId}`, "completed");
          window.dispatchEvent(new Event("practice-completed"));
        }}
      />
      
      <ToeflTips material={sub_material.content[4]} />
      
      {/* 🌟 PERBAIKAN 5: Lengkapi seluruh parameter pelacakan ke dalam FooterMaterial */}
      <FooterMaterial
        title={sub_material.title}
        isEnd={currentId == length}
        color="#E8A838"
        main_part_title={main_material.part_title}
        part_id={main_material.part_id}
        sub_module_id={sub_material.sub_module_id}
        isButtonDisabled={!hasAnswered}
      />
    </div>
  );
}