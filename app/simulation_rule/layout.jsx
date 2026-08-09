"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./layout.module.css";

import Alert from "../components/Alert"; 

import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";

export default function SimulationLayout({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userProfile, setUserProfile] = useState({ avatarUrl: null, initials: "U" });
  
  const [alertConfig, setAlertConfig] = useState({
    show: false, text: "", isAlert: false, onOke: () => {},
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        let fullName = user.displayName || "User";
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            if (data.fullName) fullName = data.fullName;
          }
        } catch (error) {
          console.error("Gagal mengambil nama:", error);
        }
        setUserProfile({ avatarUrl: null, initials: fullName.trim().charAt(0).toUpperCase() });
      };
      fetchUserData();
    }
  }, [user]);

  if (loading || !user) {
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