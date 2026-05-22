"use client";

import styles from "./page.module.css";

export default function SimulasiPage() {

  return (

    <div className={styles.container}>

      <div className={styles.hero}>

        <span className={styles.label}>
          TOEFL SIMULATION
        </span>

        <h1>
          Simulasi 100 Soal
        </h1>

        <p>
          Halaman simulasi masih dalam tahap pengembangan.
        </p>

      </div>

      <div className={styles.card}>

        <div className={styles.icon}>
          📝
        </div>

        <h2>
          Belum Tersedia
        </h2>

        <p>
          Nanti soal TOEFL akan ditampilkan di sini.
        </p>

      </div>

    </div>

  );

}