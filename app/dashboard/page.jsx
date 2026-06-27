"use client";

import materials from "@/data/material.json";
import styles from "./page.module.css";
import Link from "next/link";
import * as FaIcons from "react-icons/fa";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
export default function DashboardPage() {
  const [lessonStatus, setLessonStatus] = useState([]);
  const [username, setUsername] = useState("User");
  const defaultLessonsMetadata = materials.materials;
  // const defaultLessonsMetadata = [
  //   {
  //     id: 1,
  //     title: "Written Expression Part 1",
  //     path: "/dashboard/lesson/written_expression_part_1",
  //   },
  //   {
  //     id: 2,
  //     title: "Written Expression Part 2",
  //     path: "/dashboard/lesson/written_expression_part_2",
  //   },
  //   {
  //     id: 3,
  //     title: "Structure Part 1",
  //     path: "/dashboard/lesson/structure_part_1",
  //   },
  //   {
  //     id: 4,
  //     title: "Structure Part 2",
  //     path: "/dashboard/lesson/structure_part_2",
  //   },
  //   {
  //     id: 5,
  //     title: "Reading Strategies",
  //     path: "/dashboard/lesson/reading_strategies",
  //   },
  //   {
  //     id: 6,
  //     title: "Reading for Details",
  //     path: "/dashboard/lesson/reading_for_details",
  //   },
  //   {
  //     id: 7,
  //     title: "Listening Comprehension",
  //     path: "/dashboard/lesson/listening_comprehension",
  //   },
  // ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUsername(data.username || user.displayName || "User");
            const firebaseLessons = data.lessonStatus || [];
            const mergedLessons = defaultLessonsMetadata.map(
              (lesson, index) => {
                const fbLesson = firebaseLessons[index];
                return {
                  id: lesson.part_id,
                  title: lesson.part_title,
                  path: `/dashboard/lesson/${lesson.part_title.toLowerCase().replaceAll(" ", "_")}`,
                  status: fbLesson
                    ? fbLesson.status
                    : index === 0
                      ? "progress"
                      : "locked",
                };
              },
            );

            setLessonStatus(mergedLessons);
          }
        } catch (error) {
          console.error("Gagal mengambil data dari Firebase:", error);
        }
      } else {
        setLessonStatus([]);
        setUsername("User");
      }
    });

    return () => unsubscribe();
  }, []);

  const today = new Date();
  const hari = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];
  const bulan = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MEI",
    "JUN",
    "JUL",
    "AGU",
    "SEP",
    "OKT",
    "NOV",
    "DES",
  ];
  const tanggalText = `${hari[today.getDay()]}, ${today.getDate()} ${bulan[today.getMonth()]}`;

  const doneCount = lessonStatus.filter(
    (lesson) => lesson.status === "done",
  ).length;
  const progressPercent =
    lessonStatus.length > 0 ? Math.round((doneCount / 7) * 100) : 0;
  const currentLesson =
    lessonStatus.find((lesson) => lesson.status === "progress") ||
    lessonStatus[0];
  const currentTitle = currentLesson?.title || "TOEFL Preparation";
  const allLessonsCompleted = doneCount === 7 && lessonStatus.length > 0;

  const handleResetProgress = async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      localStorage.removeItem("structure_part_1_sub_progress");
      localStorage.removeItem("structure_part_2_sub_progress");
      localStorage.removeItem("written_part_1_sub_progress");
      localStorage.removeItem("written_part_2_sub_progress");
      localStorage.removeItem("reading_strategies_sub_progress");
      localStorage.removeItem("reading_for_details_sub_progress");
      localStorage.removeItem("listening_comprehension_sub_progress");

      const resetData = defaultLessonsMetadata.map((l, i) => {
        const generatedPath = `/dashboard/lesson/${l.part_title.toLowerCase().replaceAll(" ", "_")}`;
        return {
          status: i === 0 ? "progress" : "locked",
          path: generatedPath, 
        };
      });

      await updateDoc(doc(db, "users", user.uid), {
        lessonStatus: resetData,
      });

      window.location.reload();
    } catch (error) {
      console.error("Gagal mereset data:", error);
      alert("Terjadi kesalahan saat mereset progress belajar.");
    }
  } else {
    alert("User tidak ditemukan, pastikan kamu sudah login.");
  }
};

  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <h1>SELAMAT DATANG, {username} 👋 ✨</h1>
        <div className={styles.dateBox}>
          <FaIcons.FaCalendarAlt />
          {tanggalText}
        </div>
      </div>

      {allLessonsCompleted ? (
        <div className={styles.heroCompletedSection}>
          <div className={styles.heroCompletedLeft}>
            <p className={styles.heroCompletedLabel}>
              🎉 SEMUA MATERI SELESAI!
            </p>
            <h1>Luar Biasa, {username}!</h1>
            <div className={styles.wave}></div>
            <p>
              Kamu telah menyelesaikan seluruh 7 materi TOEFL Preparation.
              Sekarang kamu siap menghadapi Simulasi 100 Soal.
            </p>
            <Link href="/simulation_rule" className={styles.buttonLink}>
              <button className={styles.simulationHeroBtn}>
                MULAI SIMULASI 100 SOAL →
              </button>
            </Link>
          </div>
          <div className={styles.heroCompletedRight}>
            <img src="/images/completed.png" alt="Completed" />
          </div>
        </div>
      ) : (
        <div className={styles.heroSection}>
          <div className={styles.heroLeft}>
            <p className={styles.label}>KURSUS BERLANGSUNG</p>
            <h2>{currentTitle}</h2>
            <div className={styles.wave}></div>
            <div className={styles.progressTop}>
              <span>Progress Belajar</span>
              <span>{progressPercent}%</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <Link
              href={currentLesson?.path || "#"}
              className={styles.buttonLink}
            >
              <button className={styles.continueBtn}>
                LANJUTKAN
                <FaIcons.FaArrowRight />
              </button>
            </Link>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.badge}>{progressPercent}%</div>
            <img src="/images/book.png" alt="Book" />
          </div>
        </div>
      )}

      <div className={styles.sectionTitle}>MATERI SAYA ✨</div>

      <div className={styles.lessonList}>
        {lessonStatus.map((lesson) => (
          <div key={lesson.id}>
            {lesson.status !== "locked" ? (
              <Link href={lesson.path} className={styles.linkCard}>
                <div
                  className={
                    lesson.status === "done"
                      ? styles.lessonDone
                      : styles.lessonProgress
                  }
                >
                  <div className={styles.lessonInfo}>
                    <h3>
                      {lesson.id < 10 ? `0${lesson.id}` : lesson.id}{" "}
                      {lesson.title}
                    </h3>
                    <p>
                      {lesson.status === "done" ? "Completed" : "In Progress"}
                    </p>
                  </div>
                  <span className={styles.lessonIcon}>
                    {lesson.status === "done" ? (
                      <FaIcons.FaCheck />
                    ) : (
                      <FaIcons.FaPlayCircle />
                    )}
                  </span>
                </div>
              </Link>
            ) : (
              <div className={styles.lessonLocked}>
                <div className={styles.lessonInfo}>
                  <h3>
                    {lesson.id < 10 ? `0${lesson.id}` : lesson.id}{" "}
                    {lesson.title}
                  </h3>
                  <p>Selesaikan materi sebelumnya</p>
                </div>
                <div className={styles.lockedBadge}>
                  <FaIcons.FaLock />
                  LOCKED
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.bottomBanner}>
        <div>
          <h2>
            {allLessonsCompleted
              ? "SIMULASI UJIAN TERBUKA !"
              : "SIAP UJIAN SIMULASI?"}
          </h2>
          <p>
            {allLessonsCompleted
              ? "Buktikan kemampuan English kamu dengan 100 soal simulasi TOEFL penuh!"
              : "Selesaikan 7 materi untuk membuka 100 soal"}
          </p>
        </div>
        {allLessonsCompleted ? (
          <Link href="/simulation_rule" className={styles.buttonLink}>
            <div className={styles.startButton}>MULAI SIMULASI SEKARANG →</div>
          </Link>
        ) : (
          <div className={styles.lockButton}>
            <FaIcons.FaLock />
            TERKUNCI
          </div>
        )}
      </div>

      <button
        onClick={handleResetProgress}
        style={{
          marginTop: "20px",
          padding: "10px",
          cursor: "pointer",
          background: "#ffebee",
          border: "1px solid #ef9a9a",
          borderRadius: "4px",
        }}
      >
        Reset Progress (Firebase)
      </button>
    </div>
  );
}
