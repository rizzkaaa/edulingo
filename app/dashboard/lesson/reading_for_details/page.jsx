"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SUB_LESSONS_READING = [
  "inferences_questions", 
  "references_questions",
  "stated_detail_information",
  "understanding_main_ideas",
  "unstated_detail_information", 
];

export default function ReadingStrategiesRedirector() {
  const router = useRouter();

  useEffect(() => {
    const savedProgress = localStorage.getItem("reading_for_details");
    
    let targetSlug = SUB_LESSONS_READING[0]; 

    if (savedProgress) {
      const progressIndex = parseInt(savedProgress, 10);
      
      const arrayIndex = progressIndex - 1;

      // Validasi agar indeks tetap aman di dalam jangkauan array
      if (arrayIndex >= 0 && arrayIndex < SUB_LESSONS_READING.length) {
        targetSlug = SUB_LESSONS_READING[arrayIndex];
      }
    }

    // 2. Eksekusi pengalihan halaman secara instan tanpa nunggu koneksi database
    router.replace(`/dashboard/lesson/reading_for_details/${targetSlug}`);
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