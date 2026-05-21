"use client";

import styles from "./page.module.css";

import Link from "next/link";

import * as FaIcons from "react-icons/fa";

import { useEffect, useState } from "react";

import { auth, db } from "@/lib/firebase";

import { onAuthStateChanged } from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

export default function DashboardPage() {

  const [lessonStatus, setLessonStatus] = useState([]);

  const [username, setUsername] = useState("User");

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {

        if (user) {

          const docRef = doc(
            db,
            "users",
            user.uid
          );

          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {

            setUsername(
              docSnap.data().username
            );

          }

        }

      }
    );

    return () => unsubscribe();

  }, []);

  useEffect(() => {

    const savedLessons =
      JSON.parse(
        localStorage.getItem("lessonStatus")
      );

    if (savedLessons) {

      setLessonStatus(savedLessons);

    } else {

      const defaultLessons = [

        {
          id: 1,
          title: "Structure Part 1",
          path: "/dashboard/lesson/structure_part_1",
          status: "progress",
        },

        {
          id: 2,
          title: "Structure Part 2",
          path: "/dashboard/lesson/structure_part_2",
          status: "locked",
        },

        {
          id: 3,
          title: "Reading Strategies",
          path: "/dashboard/lesson/reading_strategist",
          status: "locked",
        },

        {
          id: 4,
          title: "Reading for Details",
          path: "/dashboard/lesson/reading_for_details",
          status: "locked",
        },

        {
          id: 5,
          title: "Listening Comprehension",
          path: "/dashboard/lesson/listening_comprehension",
          status: "locked",
        },

      ];

      localStorage.setItem(
        "lessonStatus",
        JSON.stringify(defaultLessons)
      );

      setLessonStatus(defaultLessons);

    }

  }, []);

  const today = new Date();

  const hari = [
    "MINGGU",
    "SENIN",
    "SELASA",
    "RABU",
    "KAMIS",
    "JUMAT",
    "SABTU"
  ];

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
    "DES"
  ];

  const tanggalText =
    `${hari[today.getDay()]}, ${today.getDate()} ${bulan[today.getMonth()]}`;

  const doneCount =
    lessonStatus.filter(
      (lesson) =>
        lesson.status === "done"
    ).length;

  const progressPercent =
    doneCount * 20;

    const currentLesson =
      lessonStatus.find(
        (lesson) => lesson.status === "progress"
      ) || lessonStatus[0];

    const currentTitle =
      currentLesson?.title ||
      "TOEFL Preparation";

  return (

    <div className={styles.container}>

      <div className={styles.topbar}>

        <h1>
          SELAMAT DATANG,
          {" "}
          {username}
          {" 👋"}
        </h1>

        <div className={styles.dateBox}>

          <FaIcons.FaCalendarAlt />

          {tanggalText}

        </div>

      </div>

      <div className={styles.heroSection}>

        <div className={styles.heroLeft}>

          <p className={styles.label}>
            KURSUS BERLANGSUNG
          </p>

          <h2>
            {currentTitle}
          </h2>

          <div className={styles.wave}></div>

          <div className={styles.progressTop}>

            <span>
              Progress Belajar
            </span>

            <span>
              {progressPercent}%
            </span>

          </div>

          <div className={styles.progressBar}>

            <div
              className={styles.progressFill}
              style={{
                width: `${progressPercent}%`
              }}
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

          <div className={styles.badge}>
            {progressPercent}%
          </div>

          <img
            src="/images/book.png"
            alt="Book"
          />

        </div>

      </div>

      <div className={styles.sectionTitle}>
        MATERI SAYA ✨
      </div>

      <div className={styles.lessonList}>

        {lessonStatus.map((lesson) => (

          <div key={lesson.id}>

            {lesson.status !== "locked" ? (

              <Link
                href={lesson.path}
                className={styles.linkCard}
              >

                <div
                  className={
                    lesson.status === "done"
                      ? styles.lessonDone
                      : styles.lessonProgress
                  }
                >

                  <div className={styles.lessonInfo}>

                    <h3>

                      {lesson.id < 10
                        ? `0${lesson.id}`
                        : lesson.id}

                      {" "}

                      {lesson.title}

                    </h3>

                    <p>

                      {lesson.status === "done"
                        ? "Completed"
                        : "In Progress"}

                    </p>

                  </div>

                  <span className={styles.lessonIcon}>

                    {lesson.status === "done"
                      ? <FaIcons.FaCheck />
                      : <FaIcons.FaPlayCircle />}

                  </span>

                </div>

              </Link>

            ) : (

              <div className={styles.lessonLocked}>

                <div className={styles.lessonInfo}>

                  <h3>

                    {lesson.id < 10
                      ? `0${lesson.id}`
                      : lesson.id}

                    {" "}

                    {lesson.title}

                  </h3>

                  <p>
                    Selesaikan materi sebelumnya
                  </p>

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
            SIAP UJIAN SIMULASI?
          </h2>

          <p>
            Selesaikan 5 materi untuk membuka 100 soal
          </p>

        </div>

        {doneCount === 5 ? (

          <Link
            href="/dashboard/simulasi"
            className={styles.buttonLink}
          >

            <div className={styles.startButton}>

              <FaIcons.FaRocket />

              MULAI

            </div>

          </Link>

        ) : (

          <div className={styles.lockButton}>

            <FaIcons.FaLock />

            TERKUNCI

          </div>

        )}

      </div>
              <button
  onClick={() => {
    localStorage.removeItem("lessonStatus");
    window.location.reload();
  }}
>
  Reset Progress
</button>

    </div>

  );

}