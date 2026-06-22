"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// 🌟 Urutan nama folder sub-materi Written Expression Part 2 sesuai urutan belajar Anda
const SUB_LESSONS_WRITTEN_2 = [
  "present_&_past_participle",                       // Jika progres bernilai 1
  "present_participle_or_past_participle_after_be", // Jika progres bernilai 2
  "past_participle_after_have",                       // Jika progres bernilai 3
  "base_form_verb_after_modals",                      // Jika progres bernilai 4
];

export default function WrittenExpressionPart2Redirector() {
  const router = useRouter();

  useEffect(() => {
    // 1. Ambil angka progres langsung dari Local Storage
    const savedProgress = localStorage.getItem("written_expression_part_2_sub_progress");
    
    let targetSlug = SUB_LESSONS_WRITTEN_2[0]; // Default fallback ke materi pertama

    if (savedProgress) {
      const progressIndex = parseInt(savedProgress, 10);
      
      // Konversi dari nilai berbasis 1 ke indeks array berbasis 0
      const arrayIndex = progressIndex - 1;

      // Validasi agar indeks tetap aman di dalam jangkauan array
      if (arrayIndex >= 0 && arrayIndex < SUB_LESSONS_WRITTEN_2.length) {
        targetSlug = SUB_LESSONS_WRITTEN_2[arrayIndex];
      }
    }

    // 2. Redirect instan ke sub-materi aktif tanpa nunggu auth/firestore handshake
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