"use client";

import Link from "next/link";
import styles from "./layout.module.css";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function AuthPage({ children }) {
  const path = usePathname();
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      <div className={styles.left}>
        <div className={styles.logo}>EduLingo</div>

        <div className={styles.circle}></div>
        <div className={styles.square}></div>
        <div className={styles.smallSquare}></div>
        <div className={styles.smallCircle}></div>

        <div className={styles.content}>
          <h1>
            Learn English.
            <br />
            No Excuses.
          </h1>

          <div className={styles.line}></div>

          <p>
            Master the English language with interactive lessons, real
            conversations, and personalized learning paths.
          </p>

          <div className={styles.tags}>
            <button>📖 Structure</button>

            <button>🎧 Listening</button>

            <button>📝 Reading</button>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <motion.div
          className={styles.authBox}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.2,
          }}
        >
          <div className={styles.tab}>
            <Link
              href="/auth/login"
              className={`${styles.tabLink} ${path == "/auth/login" ? styles.activeTab : ''}`}
            >
              MASUK
            </Link>

            <Link href="/auth/register" className={`${styles.tabLink} ${path == "/auth/register" ? styles.activeTab : ''}`}>
              DAFTAR
            </Link>
          </div>
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}
