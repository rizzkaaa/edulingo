import styles from "./FooterMaterial.module.css";
import SmallShadowBorder from "./SmallShadowBorder";
import Link from "next/link";

export default function FooterMaterial({ title, isEnd, color = "##0A0A0A" }) {
  const text = isEnd
    ? "Uji pemahaman kamu dengan 5 soal awal. \nSetelah Selesai Mengerjakannya, Kamu telah menyelesaikan semua sub-materi Structure Part 1!"
    : "Uji pemahaman kamu dengan 5 soal awal.";

  return (
    <div className={styles.container}>
      <div className={styles.decoration} style={{color: color}}>✦</div>
      <h1>Sudah Paham {title}?🎯</h1>
      <p>{text}</p>
      <Link href="#" className={styles.link}>
        <SmallShadowBorder color="#C5502A" backgroundColor="white">
          MULAI 5 SOAL AWAL →
        </SmallShadowBorder>
      </Link>
      <div className={styles.decoration} style={{color: color}}>✦</div>
    </div>
  );
}
