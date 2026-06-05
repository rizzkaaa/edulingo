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

    const unsubscribe =
      onAuthStateChanged(auth, async (user) => {

        if (user) {

          try {

            const docRef =
              doc(db, "users", user.uid);

            const docSnap =
              await getDoc(docRef);

            if (docSnap.exists()) {

              const data =
                docSnap.data();

              let formattedDate =
                "Baru saja bergabung";

              if (
                data.createdAt &&
                data.createdAt.toDate
              ) {

                formattedDate =
                  data.createdAt
                    .toDate()
                    .toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    );

              }

              setUserData({
                fullName:
                  data.fullName ||
                  user.displayName ||
                  "User",

                username:
                  data.username ||
                  "user_edulingo",

                email:
                  data.email ||
                  user.email ||
                  "",

                createdAt:
                  formattedDate,

                lessonStatus:
                  data.lessonStatus || [],
              });

            }

          } catch (error) {

            console.error(
              "Gagal mengambil data profil:",
              error
            );

          } finally {

            setLoading(false);

          }

        } else {

          router.push("/login");

        }

      });

    return () => unsubscribe();

  }, [router]);

  const completedLessons =
    userData.lessonStatus.filter(
      (l) => l.status === "done"
    ).length;

  const unlockedLessons =
    userData.lessonStatus.filter(
      (l) =>
        l.status === "done" ||
        l.status === "progress"
    ).length;

  const progressPercent =
    userData.lessonStatus.length > 0
      ? Math.round(
          (completedLessons / 7) * 100
        )
      : 0;

  const allLessonsCompleted =
    completedLessons === 7;

  const handleLogout = async () => {

    if (
      confirm(
        "Apakah Anda yakin ingin keluar?"
      )
    ) {

      try {

        await signOut(auth);

        router.push("/auth/login");

      } catch (error) {

        console.error(
          "Gagal log out:",
          error
        );

      }

    }

  };

  if (loading) {

    return (
      <div className={styles.loading}>
        Memuat profil...
      </div>
    );

  }

  return (

    <div className={styles.container}>

      <h1 className={styles.pageTitle}>
        Profile
      </h1>

      <div className={styles.fullLine}></div>

      <div className={styles.profileCard}>

        <div className={styles.profileHeader}>

          <div className={styles.avatarWrapper}>

            <img
              src="/images/default_profile.png"
              alt="Profile"
              className={styles.avatar}
            />

          </div>

          <div className={styles.userInfo}>

            <div className={styles.nameRow}>

              <h2>
                {userData.fullName.toUpperCase()}
              </h2>

              <div className={styles.premiumBadge}>
                PREMIUM STUDENT
              </div>

            </div>

            <p>
              <FaIcons.FaEnvelope />
              {userData.email}
            </p>

            <p>
              <FaIcons.FaCalendarAlt />
              JOINED {userData.createdAt}
            </p>

          </div>

          <div className={styles.actionButtons}>

            <Link href="/dashboard/profile/edit">

              <button className={styles.editBtn}>
                EDIT PROFILE
              </button>

            </Link>

            <button
              className={styles.logoutBtn}
              onClick={handleLogout}
            >
              LOG OUT
            </button>

          </div>

        </div>

      </div>

      <div className={styles.bottomSection}>

        <div className={styles.progressCard}>

          <div className={styles.progressHeader}>

            <h3>
              LEARNING PROGRESS
            </h3>

            <h1>
              {progressPercent}%
            </h1>

          </div>

          <div className={styles.progressLine}></div>

          <div className={styles.progressBar}>

            <div
              className={styles.progressFill}
              style={{
                width: `${progressPercent}%`
              }}
            ></div>

          </div>

          <div className={styles.statsGrid}>

            <div className={styles.statBox}>

              <h2>
                {completedLessons}
              </h2>

              <p>
                MATERIALS COMPLETED
              </p>

            </div>

            <div className={styles.statBox}>

              <h2>
                {unlockedLessons}
              </h2>

              <p>
                UNLOCKED
              </p>

            </div>

            <div className={styles.statBox}>

              <h2>
                00
              </h2>

              <p>
                SIMULATIONS TAKEN
              </p>

            </div>

          </div>

        </div>

        <div className={styles.sideButtons}>

          <button
            className={styles.continueBtn}
            onClick={() =>
              router.push("/dashboard")
            }
          >

            <FaIcons.FaPlayCircle />

            <span>
              CONTINUE LEARNING
            </span>

          </button>

          {allLessonsCompleted ? (

            <button
              className={styles.simBtn}
              onClick={() =>
                router.push(
                  "/dashboard/simulasi"
                )
              }
            >

              <FaIcons.FaClipboardList />

              <span>
                OPEN SIMULATION
              </span>

            </button>

          ) : (

            <button
              className={styles.lockedSimBtn}
              disabled
            >

              <FaIcons.FaLock />

              <span>
                LOCKED
              </span>

            </button>

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