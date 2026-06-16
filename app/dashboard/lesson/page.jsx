"use client";

import styles from "./page.module.css";
import Link from "next/link";
import * as FaIcons from "react-icons/fa";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function LessonPage() {
  const [lessonStatus, setLessonStatus] = useState([]);
  const [username, setUsername] = useState("Siswa"); 
  
  const [searchQuery, setSearchQuery] = useState("");

  //backend menyimpan hasil belajar materi ke firebase
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
            }
            
          } else if (user.displayName) {
            setUsername(user.displayName);
          }
        } catch (error) {
          console.error("Gagal mengambil data user:", error);
        }
      } else {
        setLessonStatus([]);
        setUsername("Siswa");
      }
    });

    return () => unsubscribe();
  }, []);


  const lessonData = [
    {
      id: 1,
      title: "Written Expression Part 1",
      desc: "Agreement dan parallel structure",
      topics: [
        "Subject – Verb Agreement",
        "Agreement after Prepositional Phrases",
        "Agreement after Expression of Quantity",
        "Agreement after Certain Words",
        "Parallel Structure",
        "Parallel Structure with Coordinate Conjunction",
        "Parallel Structure with Paired Conjunction"
      ]
    },
    {
      id: 2,
      title: "Written Expression Part 2",
      desc: "Participle dan penggunaan verb yang tepat",
      topics: [
        "Present & Past Participle",
        "Past Participle after Have",
        "Present Participle or Past Participle after Be",
        "Base Form Verb after Modals"
      ]
    },
    {
      id: 3,
      title: "Structure Part 1",
      desc: "Pronouns, possessives, adjective dan adverb",
      topics: [
        "Subject and Object Pronouns",
        "Possessive Pronouns",
        "Adjective and Adverb"
      ]
    },
    {
      id: 4,
      title: "Structure Part 2",
      desc: "Clause connectors dalam berbagai bentuk kalimat",
      topics: [
        "Adverb Clause Connectors",
        "Noun Clause Connectors",
        "Adjective Clause Connectors"
      ]
    },
    {
      id: 5,
      title: "Reading Strategies",
      desc: "Strategi memahami kosakata dalam bacaan",
      topics: ["Vocabulary Questions"]
    },
    {
      id: 6,
      title: "Reading for Details",
      desc: "Memahami informasi utama dan detail dalam teks",
      topics: [
        "Understanding Main Ideas",
        "Stated Detail Information",
        "Unstated Detail Information",
        "Inference Questions",
        "Reference Questions"
      ]
    },
    {
      id: 7,
      title: "Listening Comprehension",
      desc: "Melatih pemahaman percakapan dan monolog bahasa Inggris",
      topics: [
        "Listening to Short Conversation",
        "Listening to Longer Conversation",
        "Listening to Talks and Note Taking"
      ]
    }
  ];

  const getCardClass = (status) => {
    if (status === "done") return styles.cardDone;
    if (status === "progress") return styles.cardProgress;
    return styles.cardLocked;
  };

  const getStatusBadge = (status) => {
    if (status === "done") return <div className={styles.statusDone}>SELESAI ✔</div>;
    if (status === "progress") return <div className={styles.statusProgress}>BERJALAN →</div>;
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

  const doneCount = lessonStatus.filter((lesson) => lesson.status === "done").length;
  const allLessonsCompleted = doneCount === lessonData.length && lessonData.length > 0;

  // Logika Filter / Pencarian Materi
  const filteredLessons = lessonData.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchTitle = item.title.toLowerCase().includes(query);
    const matchDesc = item.desc.toLowerCase().includes(query);
    const matchTopics = item.topics.some((topic) => topic.toLowerCase().includes(query));
    
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
              Semua materi telah selesai. Anda sekarang dapat mengakses Simulasi 100 Soal.
            </p>
            
            <div className={styles.progressInfoCompleted}>
              <span>{doneCount} dari 7 materi selesai</span>
              <div className={styles.progressDots}>
                {[1, 2, 3, 4, 5, 6, 7].map((dotNumber) => (
                  <div
                    key={dotNumber}
                    className={dotNumber <= doneCount ? styles.dotActive : styles.dot}
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
              Pelajari semua topik secara berurutan untuk membuka Simulasi 100 Soal
            </p>

            <div className={styles.progressInfo}>
              <span>{doneCount} dari 7 materi selesai</span>
              <div className={styles.progressDots}>
                {[1, 2, 3, 4, 5, 6, 7].map((dotNumber) => (
                  <div
                    key={dotNumber}
                    className={dotNumber <= doneCount ? styles.dotActive : styles.dot}
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
            // Menyelaraskan indeks asli dari data mentah agar status localStorage tetap sinkron
            const originalIndex = lessonData.findIndex((lesson) => lesson.id === item.id);
            const status = lessonStatus[originalIndex]?.status || "locked";
            const path = lessonStatus[originalIndex]?.path || "#";

            return (
              <div key={item.id} className={getCardClass(status)}>
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
                    {item.id < 10 ? `0${item.id}` : item.id}
                  </div>
                  <div className={styles.cardContent}>
                    <h2>{item.title}</h2>
                  </div>
                  {getStatusBadge(status)}
                </div>

                <p>{item.desc}</p>

                <ul className={status === "locked" ? styles.topicListLocked : styles.topicList}>
                  {item.topics.map((topic, topicIndex) => (
                    <li key={topicIndex}>
                      {status === "done" ? "✓" : status === "progress" ? "→" : "🔒"}{" "}
                      {topic}
                    </li>
                  ))}
                </ul>

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
                    ? `${item.topics.length}/${item.topics.length} sub-materi selesai`
                    : status === "progress"
                    ? `Sedang dipelajari`
                    : `0/${item.topics.length} sub-materi`}
                </div>

                {status === "locked" && (
                  <div className={styles.bigLock}>
                    <FaIcons.FaLock />
                  </div>
                )}

                {getButton({ status, path })}
              </div>
            );
          })
        ) : (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#8C857D", fontWeight: "bold" }}>
            Materi tidak ditemukan 🔍
          </div>
        )}
      </div>

      <div className={styles.bottomBanner}>
        <div>
          <h2>
            {allLessonsCompleted ? "SIMULASI UJIAN TERBUKA !" : "SELESAIKAN SEMUA MATERI"}
          </h2>
          <p>
            {allLessonsCompleted
              ? "Buktikan kemampuan English kamu dengan 100 soal simulasi TOEFL penuh!"
              : "Buka akses 100 Soal Simulasi Ujian penuh setelah menyelesaikan semua materi"}
          </p>
        </div>

        <div className={styles.progressInfo} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div className={styles.progressDots}>
            {[1, 2, 3, 4, 5, 6, 7].map((dotNumber) => (
              <div
                key={dotNumber}
                className={dotNumber <= doneCount ? styles.dotActive : styles.dot}
              ></div>
            ))}
          </div>
          <span>{doneCount} dari 7 materi selesai</span>
        </div>

        {allLessonsCompleted ? (
          <Link href="/simulation_rule" className={styles.buttonLink} style={{ textDecoration: "none", color: "inherit" }}>
            <div className={styles.startButton}>
              MULAI SIMULASI SEKARANG →
            </div>
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