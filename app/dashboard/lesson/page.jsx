"use client";

import materials from "@/data/material.json";
import styles from "./page.module.css";
import Link from "next/link";
import * as FaIcons from "react-icons/fa";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function LessonPage() {
  const [lessonStatus, setLessonStatus] = useState([]);
  const [username, setUsername] = useState("Siswa");
  const [searchQuery, setSearchQuery] = useState("");
  const lessonData = materials.materials;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();

            setUsername(data.username || user.displayName || "Siswa");

            if (data.lessonStatus) {
              setLessonStatus(data.lessonStatus);
            } else {

              const defaultLessonStatus = [
                { path: "/dashboard/lesson/structure_part_1", status: "progress" },
                { path: "/dashboard/lesson/structure_part_2", status: "locked" },
                { path: "/dashboard/lesson/written_expression_part_1", status: "locked" },
                { path: "/dashboard/lesson/written_expression_part_2", status: "locked" },
                { path: "/dashboard/lesson/reading_strategies", status: "locked" },
                { path: "/dashboard/lesson/reading_for_details", status: "locked" },
                { path: "/dashboard/lesson/listening_comprehension", status: "locked" }
              ];
              

              setLessonStatus(defaultLessonStatus);
              
              await updateDoc(userDocRef, {
                lessonStatus: defaultLessonStatus
              });
              
              console.log("lessonStatus default berhasil ditambahkan ke akun baru!");
            }
          } else if (user.displayName) {
            setUsername(user.displayName);
          }
        } catch (error) {
          console.error("Gagal mengambil/memperbarui data user:", error);
        }
      } else {
        setLessonStatus([]);
        setUsername("Siswa");
      }
    });

    return () => unsubscribe();
  }, []);

  const getCardClass = (status) => {
    if (status === "done") return styles.cardDone;
    if (status === "progress") return styles.cardProgress;
    return styles.cardLocked;
  };

  const getStatusBadge = (status) => {
    if (status === "done")
      return <div className={styles.statusDone}>SELESAI ✔</div>;
    if (status === "progress")
      return <div className={styles.statusProgress}>BERJALAN →</div>;
    return <div className={styles.lockBadge}>TERKUNCI 🔒</div>;
  };

  const getButton = (lesson) => {
    if (lesson.status === "done") {
      return (
        <div className={styles.buttonGroup}>
          <button className={styles.doneBtn}>SELESAI ✔</button>
          <Link href={lesson.path} className={styles.retryLink}>
            <button className={styles.retryBtn}>ULANGI →</button>
          </Link>
        </div>
      );
    }
    if (lesson.status === "progress") {
      return (
        <Link href={lesson.path}>
          <button className={styles.continueBtn}>LANJUTKAN →</button>
        </Link>
      );
    }
    return <button className={styles.lockedBtn}>🔒 TERKUNCI</button>;
  };

  const doneCount = lessonStatus.filter(
    (lesson) => lesson.status === "done",
  ).length;

  const allLessonsCompleted =
    doneCount === lessonData.length && lessonData.length > 0;

  const filteredLessons = lessonData.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchTitle = item.part_title.toLowerCase().includes(query);
    const matchDesc = item.desc.toLowerCase().includes(query);
    const matchTopics = item.sub_modules.some((module) =>
      module.title.toLowerCase().includes(query),
    );

    return matchTitle || matchDesc || matchTopics;
  });

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.breadcrumb}>BERANDA › MATERI</div>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Cari materi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaIcons.FaSearch />
        </div>
      </div>

      {allLessonsCompleted ? (
        <div className={`${styles.heroBox} ${styles.heroBoxCompleted || ""}`}>
          <div className={styles.heroLeftCompleted}>
            <p className={styles.heroLabelCompleted}>🎉 SEMUA MATERI SELESAI</p>
            <h1>Selamat, {username}!</h1>
            <div className={styles.wave}></div>
            <p className={styles.heroDescCompleted}>
              Semua materi telah selesai. Anda sekarang dapat mengakses Prediction
              100 Soal.
            </p>

            <div className={styles.progressInfoCompleted}>
              <span>{doneCount} dari 7 materi selesai</span>
              <div className={styles.progressDots}>
                {[1, 2, 3, 4, 5, 6, 7].map((dotNumber) => (
                  <div
                    key={dotNumber}
                    className={
                      dotNumber <= doneCount ? styles.dotActive : styles.dot
                    }
                  ></div>
                ))}
              </div>
              <div className={styles.percentBadge}>
                {Math.round((doneCount / 7) * 100)}% Selesai
              </div>
            </div>
          </div>
          <div className={styles.heroRight}>
            <img src="/images/lesson.png" alt="All Completed" />
          </div>
        </div>
      ) : (
        <div className={styles.heroBox}>
          <div className={styles.heroLeft}>
            <p className={styles.heroLabel}>SEMUA MATERI ✦</p>
            <h1>Pilih Materi</h1>
            <div className={styles.wave}></div>
            <p className={styles.heroDesc}>
              Pelajari semua topik secara berurutan untuk membuka Prediction 100
              Soal
            </p>

            <div className={styles.progressInfo}>
              <span>{doneCount} dari 7 materi selesai</span>
              <div className={styles.progressDots}>
                {[1, 2, 3, 4, 5, 6, 7].map((dotNumber) => (
                  <div
                    key={dotNumber}
                    className={
                      dotNumber <= doneCount ? styles.dotActive : styles.dot
                    }
                  ></div>
                ))}
              </div>
              <div className={styles.percentBadge}>
                {Math.round((doneCount / 7) * 100)}% Selesai
              </div>
            </div>
          </div>
          <div className={styles.heroRight}>
            <img src="/images/lesson.png" alt="Lesson" />
          </div>
        </div>
      )}

      <div className={styles.lessonGrid}>
        {filteredLessons.length > 0 ? (
          filteredLessons.map((item) => {
            const originalIndex = lessonData.findIndex(
              (lesson) => lesson.part_id === item.part_id,
            );
            const status = lessonStatus[originalIndex]?.status || "locked";
            const path = lessonStatus[originalIndex]?.path || "#";

            return (
              <div key={item.part_id} className={getCardClass(status)}>
                <div>
                  <div className={styles.cardTop}>
                    <div
                      className={
                        status === "done"
                          ? styles.lessonNumber
                          : status === "progress"
                            ? styles.lessonNumberYellow
                            : styles.lessonNumberGray
                      }
                    >
                      {item.part_id < 10 ? `0${item.part_id}` : item.part_id}
                    </div>
                    <div className={styles.cardContent}>
                      <h2>{item.part_title}</h2>
                    </div>
                    {getStatusBadge(status)}
                  </div>

                  <p>{item.desc}</p>

                  <ul
                    className={
                      status === "locked"
                        ? styles.topicListLocked
                        : styles.topicList
                    }
                  >
                    {item.sub_modules.map((module, topicIndex) => (
                      <li key={topicIndex}>
                        {status === "done"
                          ? "✓"
                          : status === "progress"
                            ? "→"
                            : "🔒"}{" "}
                        {module.title}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className={styles.progressBar}>
                    <div
                      className={
                        status === "done"
                          ? styles.progressFillDone
                          : status === "progress"
                            ? styles.progressFill
                            : ""
                      }
                    ></div>
                  </div>

                  <div
                    className={
                      status === "done"
                        ? styles.submateriText
                        : status === "progress"
                          ? styles.submateriTextYellow
                          : styles.submateriTextGray
                    }
                  >
                    {status === "done"
                      ? `${item.sub_modules.length}/${item.sub_modules.length} sub-materi selesai`
                      : status === "progress"
                        ? `Sedang dipelajari`
                        : `0/${item.sub_modules.length} sub-materi`}
                  </div>

                  {status === "locked" && (
                    <div className={styles.bigLock}>
                      <FaIcons.FaLock />
                    </div>
                  )}

                  {getButton({ status, path })}
                </div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px",
              color: "#8C857D",
              fontWeight: "bold",
            }}
          >
            Materi tidak ditemukan 🔍
          </div>
        )}
      </div>

      <div className={styles.bottomBanner}>
        <div>
          <h2>
            {allLessonsCompleted
              ? "PREDICTION UJIAN TERBUKA !"
              : "SELESAIKAN SEMUA MATERI"}
          </h2>
          <p>
            {allLessonsCompleted
              ? "Buktikan kemampuan English kamu dengan 100 soal prediction TOEFL penuh!"
              : "Buka akses 100 Soal Prediction Ujian penuh setelah menyelesaikan semua materi"}
          </p>
        </div>

        <div
          className={styles.progressInfo}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div className={styles.progressDots}>
            {[1, 2, 3, 4, 5, 6, 7].map((dotNumber) => (
              <div
                key={dotNumber}
                className={
                  dotNumber <= doneCount ? styles.dotActive : styles.dot
                }
              ></div>
            ))}
          </div>
          <span>{doneCount} dari 7 materi selesai</span>
        </div>

        {allLessonsCompleted ? (
          <Link
            href="/prediction_rule"
            className={styles.buttonLink}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className={styles.startButton}>MULAI PREDICTION SEKARANG →</div>
          </Link>
        ) : (
          <div className={styles.lockButton}>
            <FaIcons.FaLock />
            TERKUNCI
          </div>
        )}
      </div>
    </div>
  );
}