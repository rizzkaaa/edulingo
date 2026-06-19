"use client";
import styles from "./FooterMaterial.module.css";
import SmallShadowBorder from "./SmallShadowBorder";
import Link from "next/link";

export default function FooterMaterial({ 
  title, 
  isEnd, 
  color = "#0A0A0A", 
  main_part_title,
  part_id,          
  sub_module_id,
  isButtonDisabled 
}) {
  const text = isEnd
    ? `Uji pemahaman kamu dengan 5 soal awal. \nSetelah Selesai Mengerjakannya, Kamu telah menyelesaikan semua sub-materi ${main_part_title || "ini"}!`
    : "Uji pemahaman kamu dengan 5 soal awal.";

  const label = isEnd ? `🎉 ${main_part_title} Selesai!` : `Sudah Paham ${title}? 🎯`;

  // 1. Mengubah "Adjective & Adverb" menjadi "adjective_&_adverb" (untuk pencarian kuis)
  const targetModule = title ? title.toLowerCase().trim().replace(/\s+/g, "_") : "";

  // 2. 🌟 OTOMATISASI: Mengubah "Structure Part 2" menjadi "structure_part_2" 
  // atau "Reading for Details" menjadi "reading_for_details"
  const partFolder = main_part_title 
    ? main_part_title.toLowerCase().trim().replace(/\s+/g, "_") 
    : "structure_part_1";

  return (
    <div className={styles.container}>
      <div className={styles.decoration} style={{ color: color }}>✦</div>
      <h1>{label}</h1>
      <p style={{ whiteSpace: "pre-line" }}>{text}</p>
      
      {/* 3. 🌟 SEKARANG KITA KIRIM JUGA PARAMETER &part AGAR PRACTICE PAGE TIDAK BINGUNG */}
      <Link 
        href={`/practice?module=${encodeURIComponent(targetModule)}&part=${partFolder}`} 
        style={{ textDecoration: "none" }}
      >
        <SmallShadowBorder color="#C5502A" backgroundColor="white">
          MULAI 5 SOAL AWAL →
        </SmallShadowBorder>
      </Link>
      
      <div className={styles.decoration} style={{ color: color }}>✦</div>
    </div>
  );
}