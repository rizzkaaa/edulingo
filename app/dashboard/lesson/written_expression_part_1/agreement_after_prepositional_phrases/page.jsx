"use client";

import { useState, useEffect } from "react";
import material from "@/data/material.json";
import HeaderMaterial from "@/app/components/HeaderMaterial";
import { FirstExplainVer10 } from "@/app/components/FirstExplain";
import ToeflTips from "@/app/components/ToeflTips";
import FooterMaterial from "@/app/components/FooterMaterial";
import { TemplateVer11, TemplateVer12 } from "@/app/components/other_material";

export default function AgreementAfterPrepositionalPhrases() {
  const [hasAnswered, setHasAnswered] = useState(false);

  const main_material = material?.materials?.find((m) => m.part_id == 3);
  const sub_material = main_material?.sub_modules?.find((s) => s.sub_module_id == 2);

  const currentId = sub_material?.sub_module_id;
  const length = main_material?.sub_modules?.length || 0;

  if (!sub_material) return null;

  return (
    <div>
      <HeaderMaterial
        currentId={currentId}
        length={length}
        borderColor="#C5502A"
        sub_material={sub_material}
      />
      
      <FirstExplainVer10 material={sub_material.content[0]} />
      <TemplateVer12 sub_material={sub_material.content[1]} />
      <TemplateVer11 sub_material={sub_material.content[2]} />
      <ToeflTips material={sub_material.content[3]} />
      
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