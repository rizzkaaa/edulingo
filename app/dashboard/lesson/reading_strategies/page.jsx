"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
const SUB_LESSONS_READING = [
  "skimming_&_scanning", 
  "vocabulary_question", 
];

export default function ReadingStrategiesRedirector() {
  const router = useRouter();

  useEffect(() => {
    const savedProgress = localStorage.getItem("reading_strategies_sub_progress");
    
    let targetSlug = SUB_LESSONS_READING[0];

    if (savedProgress) {
      const progressIndex = parseInt(savedProgress, 10);
      const arrayIndex = progressIndex - 1; 

      if (arrayIndex >= 0 && arrayIndex < SUB_LESSONS_READING.length) {
        targetSlug = SUB_LESSONS_READING[arrayIndex];
      }
    }

    router.replace(`/dashboard/lesson/reading_strategies/${targetSlug}`);
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
      <h2 style={{ fontWeight: 900 }}>Memuat Progres Reading...</h2>
    </div>
  );
}