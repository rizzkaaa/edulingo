"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// 🌟 Urutan nama folder sub-materi Written Expression Part 1 sesuai urutan belajar Anda
const SUB_LESSONS_WRITTEN_1 = [
  "subject_-_verb_agreement",                         // Jika progres bernilai 1
  "agreement_after_prepositional_phrases",           // Jika progres bernilai 2
  "agreement_after_expression_of_quality",           // Jika progres bernilai 3
  "agreement_after_certain_words",                   // Jika progres bernilai 4
  "parallel_structure",                              // Jika progres bernilai 5
  "parallel_structure_with_coordinate_conjunctions", // Jika progres bernilai 6
  "parallel_structure_with_paired_conjunctions",     // Jika progres bernilai 7
];

export default function WrittenExpressionPart1Redirector() {
  const router = useRouter();

  useEffect(() => {
    // 1. Ambil angka progres langsung dari Local Storage
    const savedProgress = localStorage.getItem("written_expression_part_1_sub_progress");
    
    let targetSlug = SUB_LESSONS_WRITTEN_1[0]; // Default fallback ke materi pertama

    if (savedProgress) {
      const progressIndex = parseInt(savedProgress, 10);
      
      // Konversi dari nilai berbasis 1 ke indeks array berbasis 0
      const arrayIndex = progressIndex - 1;

      // Validasi agar indeks tetap aman di dalam jangkauan array
      if (arrayIndex >= 0 && arrayIndex < SUB_LESSONS_WRITTEN_1.length) {
        targetSlug = SUB_LESSONS_WRITTEN_1[arrayIndex];
      }
    }

    // 2. Eksekusi pengalihan halaman secara instan tanpa loading screen lama
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