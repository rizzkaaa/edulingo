"use client";

import { useState, useEffect } from "react";
import styles from "./layout.module.css";
import Link from "next/link";

import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function SimulationLayout({ children }) {
  const [userProfile, setUserProfile] = useState({
    avatarUrl: null,
    initials: "U",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        let fullName = currentUser.displayName || "User";

        // Prioritas: Ambil dari Firestore dengan field 'fullName' (sesuai screenshot Anda)
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            // Menggunakan 'fullName' karena itu field yang ada di screenshot Firestore Anda
            if (data.fullName) fullName = data.fullName;
          }
        } catch (error) {
          console.error("Gagal mengambil nama dari Firestore:", error);
        }

        const firstLetter = fullName ? fullName.trim().charAt(0).toUpperCase() : "U";

        setUserProfile({
          avatarUrl: null, 
          initials: firstLetter,
        });
      } else {
        setUserProfile({
          avatarUrl: null,
          initials: "U",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Memperbaiki typo sessionStorage agar tidak menyebabkan error lagi
      sessionStorage.clear();
      localStorage.removeItem("user_id");
      window.location.href = "/";
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

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
          <div className={styles.profileCircle}>
            {userProfile.initials}
          </div>
          
          <button className={styles.exitBtn} onClick={handleLogout}>
            Keluar
          </button>
        </div>
      </header>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}