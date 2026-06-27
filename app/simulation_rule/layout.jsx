"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./layout.module.css";

import Alert from "../components/Alert"; 

import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function SimulationLayout({ children }) {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState({ avatarUrl: null, initials: "U" });
  
  const [alertConfig, setAlertConfig] = useState({
    show: false, text: "", isAlert: false, onOke: () => {},
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        let fullName = currentUser.displayName || "User";
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            if (data.fullName) fullName = data.fullName;
          }
        } catch (error) {
          console.error("Gagal mengambil nama:", error);
        }
        setUserProfile({ avatarUrl: null, initials: fullName.trim().charAt(0).toUpperCase() });
      }
    });
    return () => unsubscribe();
  }, []);

  const performExit = () => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.includes("module_status_") || key.includes("practice")) {
          localStorage.removeItem(key);
        }
      });

      router.push("/dashboard"); 
    } catch (error) {
      console.error("Gagal keluar:", error);
    }
  };

  function handleExit() {
    showAlert(
      "Yakin ingin keluar? Progres simulasi Anda akan dihapus.",
      false, 
      () => performExit() 
    );
  }

  function showAlert(text, isAlert = true, onOke = () => {}) {
    setAlertConfig({ show: true, text, isAlert, onOke });
  }

  function closeAlert() {
    setAlertConfig(prev => ({ ...prev, show: false }));
  }

  return (
    <div className={styles.wrapper}>
      {alertConfig.show && (
        <Alert
          isAlert={alertConfig.isAlert}
          text={alertConfig.text}
          handleClick={() => { closeAlert(); alertConfig.onOke(); }}
          handleCancel={closeAlert}
        />
      )}

      <header className={styles.topHeader}>
        <div className={styles.logoSection}>
          <h1>EduLingo</h1>
          <div className={styles.prepBadge}>TOEFL PREP</div>
        </div>

        <div className={styles.breadcrumb}>
          BERANDA › SIMULASI › SIMULASI PENUH
        </div>

        <div className={styles.rightSection}>
          <div className={styles.profileCircle}>{userProfile.initials}</div>
          
          <button className={styles.exitBtn} onClick={handleExit}>
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