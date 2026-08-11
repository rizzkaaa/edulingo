"use client";

import Link from "next/link";
import styles from "./layout.module.css";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function AuthPage({ children }) {
  const path = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const initialCheckRef = useRef(false);

  useEffect(() => {
    if (!loading && !initialCheckRef.current) {
      initialCheckRef.current = true;
      if (user) {
        // Jika sudah login sebelumnya dan membuka halaman auth, verifikasi status keaktifan
        const verifyInitialSession = async () => {
          try {
            if (user.email?.toLowerCase() === "p@gmail.com") {
              router.replace("/dashboard");
              return;
            }
            const userDocSnap = await getDoc(doc(db, "users", user.uid));
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              const isInactive =
                userData.isActive === false ||
                userData.status === "inactive" ||
                userData.status === "nonaktif" ||
                userData.isActive === "false";

              if (isInactive) {
                await signOut(auth);
                return;
              }
            }
            router.replace("/dashboard");
          } catch (err) {
            console.error("Session verification error:", err);
          }
        };
        verifyInitialSession();
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0A0A12",
        color: "#ffffff",
        fontSize: "1.2rem",
        fontWeight: "600"
      }}>
        Memuat data sesi...
      </div>
    );
  }

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
