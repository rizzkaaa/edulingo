"use client";

import { useState, useEffect } from "react";
import styles from "./layout.module.css";
import Link from "next/link";

import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function SimulationLayout({ children }) {
  // State untuk data profil user secara dinamis
  const [userProfile, setUserProfile] = useState({
    avatarUrl: null,
    initials: "H", 
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // 1. Ambil foto langsung dari akun Google/Firebase Auth
        let photo = currentUser.photoURL || null;
        let name = currentUser.displayName || "Heri Vian";

        // 2. Cadangan: Jika data profil disimpan terpisah di Firestore koleksi 'users'
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            if (data.name) name = data.name;
            if (data.avatarUrl) photo = data.avatarUrl;
            if (data.photoURL) photo = data.photoURL;
          }
        } catch (error) {
          console.error("Gagal mengambil profil tambahan dari Firestore:", error);
        }

        // Generate inisial otomatis dari nama user (Contoh: Heri Vian -> HV)
        const initials = name
          .split(" ")
          .filter(Boolean)
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2);

        setUserProfile({
          avatarUrl: photo,
          initials: initials || "H",
        });
      } else {
        // Jika tidak ada user login (guest), tampilkan inisial default HV
        setUserProfile({
          avatarUrl: null,
          initials: "HV",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Fungsi aksi klik untuk tombol Keluar
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Bersihkan juga token/id di session lokal jika ada
      localStorage.removeItem("user_id");
      sessionStorage.removeItem("user_id");
      sessionStorage.removeItem("toefl_guest_id");
      
      // Arahkan user kembali ke halaman utama setelah keluar
      window.location.href = "/";
    } catch (error) {
      console.error("Gagal melakukan proses logout:", error);
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
          {/* Kondisional: Tampilkan foto jika ada, jika tidak ada tampilkan inisial teks */}
          {userProfile.avatarUrl ? (
            <img 
              src={userProfile.avatarUrl} 
              className={styles.profileCircle} 
              alt="Profil User" 
              style={{ objectFit: "cover", borderRadius: "50%", display: "block" }}
            />
          ) : (
            <div className={styles.profileCircle}>
              {userProfile.initials}
            </div>
          )}
          
          {/* Mengubah Link biasa menjadi tombol dengan fungsi logout asli */}
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