"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// 🌟 Urutan nama folder sub-materi Structure Part 1 sesuai urutan belajar Anda
const SUB_LESSONS_STRUCTURE_1 = [
  "singular_&_plural_nouns",       // Jika progres bernilai 1
  "countable_&_uncountable_noun",   // Jika progres bernilai 2
  "subject_&_object_pronouns",     // Jika progres bernilai 3
  "possessive_pronoun",            // Jika progres bernilai 4
  "adjective_&_adverb",            // Jika progres bernilai 5
];

export default function StructurePart1Redirector() {
  const router = useRouter();

  useEffect(() => {
    // 1. Ambil angka progres langsung dari Local Storage
    const savedProgress = localStorage.getItem("structure_part_1_sub_progress");
    
    let targetSlug = SUB_LESSONS_STRUCTURE_1[0]; // Default fallback ke materi pertama

    if (savedProgress) {
      const progressIndex = parseInt(savedProgress, 10);
      
      // Konversi dari nilai berbasis 1 ke indeks array berbasis 0
      const arrayIndex = progressIndex - 1;

      // Validasi agar indeks tetap aman di dalam jangkauan array
      if (arrayIndex >= 0 && arrayIndex < SUB_LESSONS_STRUCTURE_1.length) {
        targetSlug = SUB_LESSONS_STRUCTURE_1[arrayIndex];
      }
    }

    // 2. Redirect kilat ke sub-materi aktif tanpa hambatan handshake database
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