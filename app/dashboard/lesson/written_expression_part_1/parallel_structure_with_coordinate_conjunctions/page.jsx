"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import { FirstExplainVer11 } from "@/app/components/FirstExplain";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import { TemplateVer20, TemplateVer9 } from "@/app/components/other_material";
import { GroupColorBorderShadow } from "@/app/components/GroupColorBorderShadow";
import TableMaterial from "@/app/components/TableMaterial";

function ParallelStructureWithCoordinateConjunctionsInner() {
  const [hasAnswered, setHasAnswered] = useState(false);
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");

  const main_material = material.materials.find(
    (material) => material.part_id == 3,
  );
  const sub_material = main_material?.sub_modules.find(
    (material) => material.sub_module_id == 6,
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
  }, [currentId, statusParam]); 

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
      <FirstExplainVer11 material={sub_material.content[0]} />
      <TemplateVer9 sub_material={sub_material.content[1]} grey={false} />
      <GroupColorBorderShadow
        version={2}
        materials={sub_material.content[2]?.explain || []}
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
        part_id={main_material.part_id}
        sub_module_id={sub_material.sub_module_id}
        isButtonDisabled={!hasAnswered} 
      />
    </div>
  );
}

export default function ParallelStructureWithCoordinateConjunctions(props) {
  return (
    <Suspense fallback={null}>
      <ParallelStructureWithCoordinateConjunctionsInner {...props} />
    </Suspense>
  );
}
