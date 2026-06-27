"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SUB_LESSONS_STRUCTURE_1 = [
  "singular_&_plural_nouns",      
  "countable_&_uncountable_noun",   
  "subject_&_object_pronouns",    
  "possessive_pronoun",           
  "adjective_&_adverb",            
];

export default function StructurePart1Redirector() {
  const router = useRouter();

  useEffect(() => {

    const savedProgress = localStorage.getItem("structure_part_1_sub_progress");
    
    let targetSlug = SUB_LESSONS_STRUCTURE_1[0]; a

    if (savedProgress) {
      const progressIndex = parseInt(savedProgress, 10);
    
      const arrayIndex = progressIndex - 1;

      if (arrayIndex >= 0 && arrayIndex < SUB_LESSONS_STRUCTURE_1.length) {
        targetSlug = SUB_LESSONS_STRUCTURE_1[arrayIndex];
      }
    }

    router.replace(`/dashboard/lesson/structure_part_1/${targetSlug}`);
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
      <h2 style={{ fontWeight: 900 }}>Memuat Progres Structure Part 1...</h2>
    </div>
  );
}