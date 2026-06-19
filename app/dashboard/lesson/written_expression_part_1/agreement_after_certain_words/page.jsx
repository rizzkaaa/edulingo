"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import { FirstExplainVer5 } from "@/app/components/FirstExplain";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import { Ver1, Ver2, Ver3, Ver4, TemplateVer16 } from "@/app/components/other_material";

export default function AgreementAfterCertainWords() {
  const [hasAnswered, setHasAnswered] = useState(false);
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");

  const main_material = material.materials.find(
    (material) => material.part_id == 3,
  );
  const sub_material = main_material?.sub_modules.find(
    (material) => material.sub_module_id == 4,
  );

  const currentId = sub_material?.sub_module_id;
  const length = main_material?.sub_modules.length;

  useEffect(() => {
    if (main_material && currentId) {
      const storageKey = `module_status_part_${main_material.part_id}_mod_${currentId}`;
      
      const isAlreadyCompleted = localStorage.getItem(storageKey) === "completed";
      const isNewlyCompleted = statusParam === "completed";

      // 🌟 PERBAIKAN LOGIKA: Hanya buka gembok jika sudah lulus atau baru lulus kuis
      if (isAlreadyCompleted || isNewlyCompleted) {
        setHasAnswered(true);

        // Jika user baru saja menyelesaikan kuis, simpan statusnya
        if (!isAlreadyCompleted && isNewlyCompleted) {
          localStorage.setItem(storageKey, "completed");
          window.dispatchEvent(new Event("practice-completed"));
        }
      } else {
        // Jika belum menyelesaikan kuis sama sekali, pastikan tombol tetap terkunci
        setHasAnswered(false);
      }
    }
  }, [currentId, statusParam]); // 🌟 Sinkronisasi dependency array

  // Pencegahan error jika data sub_material tidak ditemukan
  if (!sub_material) {
    return <div style={{ padding: "50px", textAlign: "center" }}>Memuat materi...</div>;
  }

  return (
    <div>
      <HeaderMaterial
        currentId={currentId}
        length={length}
        borderColor="#C5502A"
        sub_material={sub_material}
      />
      <FirstExplainVer5 material={sub_material.content[0]} />

      <Ver1 sub_material={sub_material.content[1]} />
      <Ver2 sub_material={sub_material.content[2]} />
      <Ver3 sub_material={sub_material.content[3]} />
      <Ver4 sub_material={sub_material.content[4]} />
      <TemplateVer16 material={sub_material.content[5]} />
      <ToeflTips material={sub_material.content[6]} />
      
      <FooterMaterial
        title={sub_material.title}
        isEnd={currentId == length}
        color="#E8A838"
        main_part_title={main_material.part_title}
        part_id={main_material.part_id}
        sub_module_id={sub_material.sub_module_id}
        isButtonDisabled={!hasAnswered} // 🌟 Sinkron dengan state hasAnswered
      />
    </div>
  );
}