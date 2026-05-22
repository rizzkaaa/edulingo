"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import * as FaIcons from "react-icons/fa";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    fullName: "",
    username: "",
    email: "",
    createdAt: "",
    lessonStatus: [],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

            // Format tanggal bergabung
            let formattedDate = "Baru saja bergabung";
            if (data.createdAt && data.createdAt.toDate) {
              formattedDate = data.createdAt.toDate().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });
            }

            setUserData({
              fullName: data.fullName || user.displayName || "User",
              username: data.username || "user_edulingo",
              email: data.email || user.email || "",
              createdAt: formattedDate,
              lessonStatus: data.lessonStatus || [],
            });
          }
        } catch (error) {
          console.error("Gagal mengambil data profil:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Kalkulasi Statistik
  const completedLessons = userData.lessonStatus.filter((l) => l.status === "done").length;
  const unlockedLessons = userData.lessonStatus.filter((l) => l.status === "done" || l.status === "progress").length;
  const progressPercent = userData.lessonStatus.length > 0 ? Math.round((completedLessons / 7) * 100) : 0;
  
  // Syarat akses simulasi
  const allLessonsCompleted = completedLessons === 7;

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      try {
        await signOut(auth);
        router.push("/login");
      } catch (error) {
        console.error("Gagal log out:", error);
      }
    }
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Memuat profil...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Profile</h1>

      {/* Card Info User */}
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarBox}>
            <img src="/images/avatar.png" alt="Avatar" className={styles.avatar} />
          </div>
          <div className={styles.userInfo}>
            <h2>
              {userData.fullName.toUpperCase()}
              <span className={styles.premiumBadge}>PREMIUM STUDENT</span>
            </h2>
            <p><FaIcons.FaEnvelope /> {userData.email}</p>
            <p><FaIcons.FaCalendarAlt /> Joined {userData.createdAt}</p>
          </div>
          <div className={styles.actionButtons}>
            <Link href="/dashboard/profile/edit">
              <button className={styles.editBtn}>EDIT PROFILE</button>
            </Link>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              LOG OUT
            </button>
          </div>
        </div>
      </div>

      {/* Card Progress Belajar */}
      <div className={styles.statsLayout}>
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <h3>LEARNING PROGRESS</h3>
            <h2>{progressPercent}%</h2>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progressPercent}%` }}></div>
          </div>

          <div className={styles.statsBoxes}>
            <div className={styles.statBox}>
              <h2>{completedLessons}</h2>
              <p>MATERIALS COMPLETED</p>
            </div>
            <div className={styles.statBox}>
              <h2>{unlockedLessons}</h2>
              <p>UNLOCKED</p>
            </div>
            <div className={styles.statBox}>
              <h2>0</h2>
              <p>SIMULATIONS TAKEN</p>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className={styles.sideButtons}>
          <button className={styles.continueBtn} onClick={() => router.push('/dashboard')}>
            <FaIcons.FaPlayCircle />
            CONTINUE LEARNING
          </button>
          
          {allLessonsCompleted ? (
            <button className={styles.simBtn} onClick={() => router.push('/dashboard/simulasi')}>
              <FaIcons.FaClipboardList />
              OPEN SIMULATION
            </button>
          ) : (
            <button className={styles.lockedSimBtn} disabled>
              <FaIcons.FaLock />
              LOCKED (COMPLETE ALL)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}