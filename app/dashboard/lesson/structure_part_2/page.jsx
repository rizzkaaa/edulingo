"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// 🌟 Urutan nama folder sub-materi Part 2 sesuai logika urutan belajar Anda
const SUB_LESSONS_PART_2 = [
  "coordinate_connectors",      // Jika progres bernilai 1
  "adverb_clause_connectors",    // Jika progres bernilai 2
  "noun_clause_connectors",      // Jika progres bernilai 3
  "adjective_clause_connectors", // Jika progres bernilai 4
];

export default function StructurePart2Redirector() {
  const router = useRouter();

  useEffect(() => {
    // 1. Langsung intip angka di Local Storage
    const savedProgress = localStorage.getItem("structure_part_2_sub_progress");
    
    let targetSlug = SUB_LESSONS_PART_2[0]; // Default fallback ke materi pertama

    if (savedProgress) {
      const progressIndex = parseInt(savedProgress, 10);
      
      // Karena Local Storage Anda berbasis 1 (1, 2, 3...), kita kurangi 1 untuk indeks array (0, 1, 2...)
      const arrayIndex = progressIndex - 1;

      // Validasi agar tidak out-of-bounds
      if (arrayIndex >= 0 && arrayIndex < SUB_LESSONS_PART_2.length) {
        targetSlug = SUB_LESSONS_PART_2[arrayIndex];
      }
    }

    // 2. Langsung lempar ke halaman sub-materi yang aktif!
    router.replace(`/dashboard/lesson/structure_part_2/${targetSlug}`);
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
      <h2 style={{ fontWeight: 900 }}>Memuat Progres Belajar...</h2>
    </div>
  );
}