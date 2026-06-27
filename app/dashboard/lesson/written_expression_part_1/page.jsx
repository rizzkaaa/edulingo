"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SUB_LESSONS_WRITTEN_1 = [
  "subject_-_verb_agreement",                        
  "agreement_after_prepositional_phrases",           
  "agreement_after_expression_of_quality",          
  "agreement_after_certain_words",                  
  "parallel_structure",                              
  "parallel_structure_with_coordinate_conjunctions", 
  "parallel_structure_with_paired_conjunctions",     
];

export default function WrittenExpressionPart1Redirector() {
  const router = useRouter();

  useEffect(() => {
  
    const savedProgress = localStorage.getItem("written_expression_part_1_sub_progress");
    
    let targetSlug = SUB_LESSONS_WRITTEN_1[0]; 

    if (savedProgress) {
      const progressIndex = parseInt(savedProgress, 10);
      

      const arrayIndex = progressIndex - 1;

      if (arrayIndex >= 0 && arrayIndex < SUB_LESSONS_WRITTEN_1.length) {
        targetSlug = SUB_LESSONS_WRITTEN_1[arrayIndex];
      }
    }
    router.replace(`/dashboard/lesson/written_expression_part_1/${targetSlug}`);
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
      <h2 style={{ fontWeight: 900 }}>Memuat Progres Written Expression...</h2>
    </div>
  );
}