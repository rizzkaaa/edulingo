"use client";

import styles from "./layout.module.css";
import Link from "next/link";

export default function SimulationLayout({ children }) {
  return (
    <div className={styles.wrapper}>

      <header className={styles.topHeader}>
        <div className={styles.logoSection}>
          <h1>EduLingo</h1>
          <div className={styles.prepBadge}>TOEFL PREP</div>
        </div>

        <div className={styles.breadcrumb}>
          BERANDA › SIMULASI › SIMULASI PENUH
        </div>

        <div className={styles.rightSection}>
          <div className={styles.profileCircle}>HV</div>
          <Link href="/dashboard">
            <button className={styles.exitBtn}>Keluar</button>
          </Link>
        </div>
      </header>

      <main className={styles.mainContent}>
        {children}
      </main>

    </div>
  );
}