"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SUB_LESSONS_LISTENING = [
  "listening_to_short_conversation",    
  "listening_to_longer_conversation",  
  "listening_to_talks_and_note_taking", 
];

export default function ListeningComprehensionRedirector() {
  const router = useRouter();

  useEffect(() => {
    const savedProgress = localStorage.getItem("listening_comprehension_sub_progress");
    
    let targetSlug = SUB_LESSONS_LISTENING[0]; 

    if (savedProgress) {
      const progressIndex = parseInt(savedProgress, 10);
      const arrayIndex = progressIndex - 1; 

      if (arrayIndex >= 0 && arrayIndex < SUB_LESSONS_LISTENING.length) {
        targetSlug = SUB_LESSONS_LISTENING[arrayIndex];
      }
    }

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