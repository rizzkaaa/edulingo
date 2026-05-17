"use client";

import styles from "./layout.module.css";

import Link from "next/link";

import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {

  const pathname = usePathname();

  return (

    <div className={styles.dashboardLayout}>

      <aside className={styles.sidebar}>

        <div className={styles.logo}>
          E
        </div>

        <div className={styles.navMenu}>

          <Link href="/dashboard">

            <button
              className={
                pathname === "/dashboard"
                  ? styles.activeBtn
                  : ""
              }
            >
              🏠
            </button>

          </Link>

          <Link href="/dashboard/lesson">

            <button
              className={
                pathname === "/dashboard/lesson"
                  ? styles.activeBtn
                  : ""
              }
            >
              📚
            </button>

          </Link>

          <button>📝</button>

          <button>👤</button>

        </div>

        <div className={styles.profile}>
          HV
        </div>

      </aside>

      <main className={styles.mainContent}>
        {children}
      </main>

    </div>
  );
}