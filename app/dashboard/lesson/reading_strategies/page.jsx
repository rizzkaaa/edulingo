"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// 🌟 Urutan nama folder sub-materi Reading Strategies
const SUB_LESSONS_READING = [
  "skimming_&_scanning", // Jika progres bernilai 1
  "vocabulary_question",  // Jika progres bernilai 2
];

export default function ReadingStrategiesRedirector() {
  const router = useRouter();

  useEffect(() => {
    // 1. Ambil angka progres dari Local Storage
    const savedProgress = localStorage.getItem("reading_strategies_sub_progress");
    
    let targetSlug = SUB_LESSONS_READING[0]; // Default fallback ke materi pertama

    if (savedProgress) {
      const progressIndex = parseInt(savedProgress, 10);
      const arrayIndex = progressIndex - 1; // Konversi dari berbasis 1 ke indeks array (0)

      if (arrayIndex >= 0 && arrayIndex < SUB_LESSONS_READING.length) {
        targetSlug = SUB_LESSONS_READING[arrayIndex];
      }
    }

    // 2. Langsung lempar ke halaman sub-materi yang aktif
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