"use client";
import { useState, useEffect, Suspense } from "react"; 
import { useSearchParams } from "next/navigation"; 
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import { FirstExplainVer3 } from "@/app/components/FirstExplain";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import TableMaterial from "@/app/components/TableMaterial";
import { TemplateVer14, TemplateVer17 } from "@/app/components/other_material";

function SkimingScanningInner() {
  const [hasAnswered, setHasAnswered] = useState(false);
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");

  const main_material = material.materials.find(
    (material) => material.part_id == 5,
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

      <FirstExplainVer3 sub_material={sub_material.content[0]} reverse={true} />
      
      <TableMaterial
        material={sub_material.content[1]}
        styleHeader={[
          { textAlign: "start" },
          { textAlign: "start" },
          { textAlign: "start" },
        ]}
        styleData={[{ fontWeight: "700" }]}
      />
      
      <TemplateVer17 material={sub_material.content[2]} />
      <TemplateVer14 sub_material={sub_material.content[3]} fontWeight="normal"/>
      <ToeflTips material={sub_material.content[4]} />

      {hasAnswered && (
        <div style={{ textAlign: "center", color: "#2e7d32", fontWeight: "600", margin: "30px 0 10px 0" }}>
          🎉 Anda telah menyelesaikan modul bacaan ini! Silakan klik tombol di bawah untuk lanjut.
        </div>
      )}
      
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

export default function SkimingScanning(props) {
  return (
    <Suspense fallback={null}>
      <SkimingScanningInner {...props} />
    </Suspense>
  );
}
