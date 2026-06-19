"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import { GroupColorBorderShadow } from "@/app/components/GroupColorBorderShadow";
import ComparisonTable from "@/app/components/ComparisonTable";
import { WithText } from "@/app/components/MultipleChoice";

export default function PresentPastParticiple() {
  const [hasAnswered, setHasAnswered] = useState(false);
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");

  const main_material = material.materials.find(
    (material) => material.part_id == 4,
  );
  const sub_material = main_material?.sub_modules.find(
    (material) => material.sub_module_id == 1,
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

        // Jika user baru saja menyelesaikan kuis dari URL param, simpan statusnya
        if (!isAlreadyCompleted && isNewlyCompleted) {
          localStorage.setItem(storageKey, "completed");
          window.dispatchEvent(new Event("practice-completed"));
        }
      } else {
        // 🌟 WAJIB: Kunci kembali tombol jika data di browser kosong/dihapus
        setHasAnswered(false);
      }
    }
  }, [currentId, statusParam, main_material]); // 🌟 Sinkronisasi dependency array

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

      <GroupColorBorderShadow
        materials={sub_material.content[0]?.explain || []}
        version={4}
        style={{ marginTop: "10px" }}
      />
      <ComparisonTable material={sub_material.content[1]} />
      
      <WithText 
        material={sub_material.content[2]} 
        onAnswered={() => {
          // 🌟 Menjawab langsung di tempat juga akan memicu penyimpanan status yang aman
          setHasAnswered(true);
          const storageKey = `module_status_part_${main_material.part_id}_mod_${currentId}`;
          localStorage.setItem(storageKey, "completed");
          window.dispatchEvent(new Event("practice-completed"));
        }}
      />
      
      <ToeflTips material={sub_material.content[3]} />
      <FooterMaterial
        color="#E8A838"
        title={sub_material.title}
        isEnd={currentId == length}
        main_part_title={main_material.part_title}
        part_id={main_material.part_id}
        sub_module_id={sub_material.sub_module_id}
        isButtonDisabled={!hasAnswered} // 🌟 Sinkron dengan state hasAnswered
      />
    </div>
  );
}