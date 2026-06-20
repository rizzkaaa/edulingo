"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import * as FaIcons from "react-icons/fa";
import { motion } from "framer-motion";
import Alert from "../../components/Alert";

export default function ProfilePage() {

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const [userData, setUserData] = useState({
    fullName: "",
    username: "",
    email: "",
    createdAt: "",
    lessonStatus: [],
    photoBase64: "", // ⬅️ baru: simpan foto profil
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

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
              photoBase64: data.photoBase64 || "", // ⬅️ baru: ambil foto dari Firestore
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

  const completedLessons = userData.lessonStatus.filter((l) => l.status === "done").length;
  const unlockedLessons = userData.lessonStatus.filter((l) => l.status === "done" || l.status === "progress").length;
  const progressPercent = userData.lessonStatus.length > 0 ? Math.round((completedLessons / 7) * 100) : 0;
  const allLessonsCompleted = completedLessons === 7;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth/login");
    } catch (error) {
      console.error("Gagal log out:", error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Memuat profil...</div>;
  }

  return (
    <div className={styles.container}>

      {/* ===== ALERT LOGOUT ===== */}
      {showLogoutAlert && (
        <Alert
          isAlert={false}
          text="Yakin nih mau logout? Kamu harus login lagi untuk melanjutkan."
          handleClick={handleLogout}
          handleCancel={() => setShowLogoutAlert(false)}
        />
      )}

      <h1 className={styles.pageTitle}>Profile</h1>
      <div className={styles.fullLine}></div>

      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>

          <div className={styles.avatarWrapper}>
            <img
              src={userData.photoBase64 || "/images/default_profile.png"} // ⬅️ baru: pakai foto base64 kalau ada
              alt="Profile"
              className={styles.avatar}
            />
          </div>

          <div className={styles.userInfo}>
            <div className={styles.nameRow}>
              <h2>{userData.fullName.toUpperCase()}</h2>
            </div>
            <p><FaIcons.FaEnvelope /> {userData.email}</p>
            <p><FaIcons.FaCalendarAlt /> JOINED {userData.createdAt}</p>
          </div>

          <div className={styles.actionButtons}>
            <Link href="/dashboard/profile/edit">
              <motion.button
                className={styles.editBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                EDIT PROFILE
              </motion.button>
            </Link>

            <motion.button
              className={styles.logoutBtn}
              onClick={() => setShowLogoutAlert(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              LOG OUT
            </motion.button>
          </div>

        </div>
      </div>

      <div className={styles.bottomSection}>

        <div className={styles.progressCard}>
          <div className={styles.progressHeader}>
            <h3>LEARNING PROGRESS</h3>
            <h1>{progressPercent}%</h1>
          </div>

          <div className={styles.progressLine}></div>

          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <h2>{completedLessons}</h2>
              <p>MATERIALS COMPLETED</p>
            </div>
            <div className={styles.statBox}>
              <h2>{unlockedLessons}</h2>
              <p>UNLOCKED</p>
            </div>
            <div className={styles.statBox}>
              <h2>00</h2>
              <p>SIMULATIONS TAKEN</p>
            </div>
          </div>
        </div>

        <div className={styles.sideButtons}>
          <motion.button
            className={styles.continueBtn}
            onClick={() => router.push("/dashboard")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <FaIcons.FaPlayCircle />
            <span>CONTINUE LEARNING</span>
          </motion.button>

          {allLessonsCompleted ? (
            <motion.button
              className={styles.simBtn}
              onClick={() => router.push("/simulation_rule")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <FaIcons.FaClipboardList />
              <span>OPEN SIMULATION</span>
            </motion.button>
          ) : (
            <motion.button
              className={styles.lockedSimBtn}
              disabled
              whileHover={{ scale: 1.02 }}
            >
              <FaIcons.FaLock />
              <span>LOCKED</span>
            </motion.button>
          )}
        </div>

      </div>

      <div className={styles.bottomDecoration}>
        <div className={styles.line}></div>
        <FaIcons.FaBookOpen />
        <div className={styles.line}></div>
      </div>

    </div>
  );
}