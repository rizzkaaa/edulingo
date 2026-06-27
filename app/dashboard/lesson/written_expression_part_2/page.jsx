"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SUB_LESSONS_WRITTEN_2 = [
  "present_&_past_participle",                      
  "present_participle_or_past_participle_after_be", 
  "past_participle_after_have",                      
  "base_form_verb_after_modals",                      
];

export default function WrittenExpressionPart2Redirector() {
  const router = useRouter();

  useEffect(() => {

    const savedProgress = localStorage.getItem("written_expression_part_2_sub_progress");
    
    let targetSlug = SUB_LESSONS_WRITTEN_2[0]; 

    if (savedProgress) {
      const progressIndex = parseInt(savedProgress, 10);

      const arrayIndex = progressIndex - 1;

      if (arrayIndex >= 0 && arrayIndex < SUB_LESSONS_WRITTEN_2.length) {
        targetSlug = SUB_LESSONS_WRITTEN_2[arrayIndex];
      }
    }

    router.replace(`/dashboard/lesson/written_expression_part_2/${targetSlug}`);
  }, [router]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#ECE7E1",
      color: "#1D1B18",
      fontFamily: "sans-serif"
    }}>
      <h2 style={{ fontWeight: 900 }}>Memuat Progres Written Expression Part 2...</h2>
    </div>
  );
}