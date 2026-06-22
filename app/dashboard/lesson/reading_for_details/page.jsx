"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// 🌟 Daftar sub-materi Reading Strategies sesuai urutan belajar Anda
const SUB_LESSONS_READING = [
  "skimming_&_scanning", // Jika progres bernilai 1
  "vocabulary_question",  // Jika progres bernilai 2
];

export default function ReadingStrategiesRedirector() {
  const router = useRouter();

  useEffect(() => {
    // 1. Ambil angka progres langsung dari Local Storage
    const savedProgress = localStorage.getItem("reading_strategies_sub_progress");
    
    let targetSlug = SUB_LESSONS_READING[0]; // Default fallback ke materi pertama jika belum ada progres

    if (savedProgress) {
      const progressIndex = parseInt(savedProgress, 10);
      
      // Konversi dari nilai berbasis 1 (1, 2) ke indeks array berbasis 0 (0, 1)
      const arrayIndex = progressIndex - 1;

      // Validasi agar indeks tetap aman di dalam jangkauan array
      if (arrayIndex >= 0 && arrayIndex < SUB_LESSONS_READING.length) {
        targetSlug = SUB_LESSONS_READING[arrayIndex];
      }
    }

    // 2. Eksekusi pengalihan halaman secara instan tanpa nunggu koneksi database
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