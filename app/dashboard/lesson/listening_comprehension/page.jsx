"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// 🌟 Urutan nama folder sub-materi Listening Comprehension
const SUB_LESSONS_LISTENING = [
  "listening_to_short_conversation",     // Jika progres bernilai 1
  "listening_to_longer_conversation",    // Jika progres bernilai 2
  "listening_to_talks_and_note_taking",  // Jika progres bernilai 3
];

export default function ListeningComprehensionRedirector() {
  const router = useRouter();

  useEffect(() => {
    // 1. Ambil angka progres dari Local Storage
    const savedProgress = localStorage.getItem("listening_comprehension_sub_progress");
    
    let targetSlug = SUB_LESSONS_LISTENING[0]; // Default fallback ke materi pertama

    if (savedProgress) {
      const progressIndex = parseInt(savedProgress, 10);
      const arrayIndex = progressIndex - 1; // Konversi dari berbasis 1 ke indeks array (0)

      if (arrayIndex >= 0 && arrayIndex < SUB_LESSONS_LISTENING.length) {
        targetSlug = SUB_LESSONS_LISTENING[arrayIndex];
      }
    }

    // 2. Langsung lempar ke halaman sub-materi yang aktif
    router.replace(`/dashboard/lesson/listening_comprehension/${targetSlug}`);
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
      <h2 style={{ fontWeight: 900 }}>Memuat Progres Listening...</h2>
    </div>
  );
}