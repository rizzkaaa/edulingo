"use client";
import { useState, useEffect, Suspense } from "react"; 
import { useSearchParams } from "next/navigation";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import { FirstExplainVer1 } from "@/app/components/FirstExplain";
import TrueFalse from "@/app/components/TrueFalse";
import TableMaterial from "@/app/components/TableMaterial";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";

function SingularPluralNounsInner() {
  const [hasAnswered, setHasAnswered] = useState(false);
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");

  const main_material = material.materials.find(
    (material) => material.part_id == 1,
  );
  const sub_material = main_material.sub_modules.find(
    (material) => material.sub_module_id == 1,
  );

  const currentId = sub_material.sub_module_id;
  const length = main_material.sub_modules.length;

  useEffect(() => {
    const isCompleted = 
      localStorage.getItem(`module_status_part_1_mod_${currentId}`) === "completed" || 
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
        sub_material={sub_material}
      />

      <FirstExplainVer1 sub_material={sub_material} />
      
      {/* 🌟 PERBAIKAN 4: Pasang properti onAnswered pada komponen TrueFalse */}
      <TrueFalse 
        material={sub_material.content[1]} 
        onAnswered={() => {
          setHasAnswered(true);
          localStorage.setItem(`module_status_part_1_mod_${currentId}`, "completed");
          window.dispatchEvent(new Event("practice-completed"));
        }}
      />
      
      <TableMaterial
        material={sub_material.content[2]}
        styleHeader={[{ textAlign: "start" },{ textAlign: "start" },{ textAlign: "start" }]}
        styleData={[{ fontWeight: "700" }]}
      />
      
      <ToeflTips material={sub_material.content[3]} />
      
      {/* 🌟 PERBAIKAN 5: Lengkapi properti tracking progress pada FooterMaterial */}
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

export default function SingularPluralNouns(props) {
  return (
    <Suspense fallback={null}>
      <SingularPluralNounsInner {...props} />
    </Suspense>
  );
}
