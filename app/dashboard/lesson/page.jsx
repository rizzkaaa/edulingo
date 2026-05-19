"use client";

import styles from "./page.module.css";

import Link from "next/link";

import * as FaIcons from "react-icons/fa";

import { useEffect, useState } from "react";

export default function LessonPage() {

  const [lessonStatus, setLessonStatus] = useState([]);

  useEffect(() => {

    const savedLessons =
      JSON.parse(localStorage.getItem("lessonStatus"));

    if (savedLessons) {
      setLessonStatus(savedLessons);
    }

  }, []);

  const getCardClass = (status) => {

    if (status === "done") {
      return styles.cardDone;
    }

    if (status === "progress") {
      return styles.cardProgress;
    }

    return styles.cardLocked;

  };

  const getStatusBadge = (status) => {

    if (status === "done") {

      return (
        <div className={styles.statusDone}>
          SELESAI ✔
        </div>
      );

    }

    if (status === "progress") {

      return (
        <div className={styles.statusProgress}>
          BERJALAN →
        </div>
      );

    }

    return (
      <div className={styles.lockBadge}>
        TERKUNCI 🔒
      </div>
    );

  };

  const getButton = (lesson) => {

    if (lesson.status === "done") {

      return (

        <div className={styles.buttonGroup}>

          <button className={styles.doneBtn}>
            SELESAI ✔
          </button>

          <Link href={lesson.path}>

            <button className={styles.retryBtn}>
              ULANGI →
            </button>

          </Link>

        </div>

      );

    }

    if (lesson.status === "progress") {

      return (

        <Link href={lesson.path}>

          <button className={styles.continueBtn}>
            LANJUTKAN →
          </button>

        </Link>

      );

    }

    return (
      <button className={styles.lockedBtn}>
        🔒 TERKUNCI
      </button>
    );

  };

  const lessonData = [

    {
      id: 1,
      title: "Structure Part 1",
      desc:
        "Pelajari dasar tata bahasa: nouns, pronouns, adjective & adverb",
      topics: [
        "Singular & Plural Nouns",
        "Countable & Uncountable Noun",
        "Subject & Object Pronouns",
        "Possessive Pronoun",
        "Adjective & Adverb"
      ]
    },

    {
      id: 2,
      title: "Structure Part 2",
      desc:
        "Connectors: coordinate, adverb clause, noun clause",
      topics: [
        "Coordinate Connectors",
        "Adverb Clause Connectors",
        "Noun Clause Connectors",
        "Adjective Clause Connectors"
      ]
    },

    {
      id: 3,
      title: "Reading Strategies",
      desc:
        "Teknik skimming, scanning & vocabulary questions",
      topics: [
        "Skimming and Scanning",
        "Vocabulary Questions"
      ]
    },

    {
      id: 4,
      title: "Reading for Details",
      desc:
        "Main ideas, stated & unstated details",
      topics: [
        "Understanding Main Ideas",
        "Stated Detail",
        "Unstated Detail",
        "Inference Questions"
      ]
    },

    {
      id: 5,
      title: "Listening Comprehension",
      desc:
        "Short conversations & talks",
      topics: [
        "Short Conversation",
        "Long Conversation",
        "Talks & Note Taking"
      ]
    }

  ];

  const doneCount =
    lessonStatus.filter(
      (lesson) => lesson.status === "done"
    ).length;

  return (

    <div className={styles.container}>

      <div className={styles.topSection}>

        <div className={styles.breadcrumb}>
          BERANDA › MATERI
        </div>

        <div className={styles.searchBox}>

          <input
            type="text"
            placeholder="Cari materi..."
          />

          <FaIcons.FaSearch />

        </div>

      </div>

      <div className={styles.heroBox}>

        <div className={styles.heroLeft}>

          <p className={styles.heroLabel}>
            SEMUA MATERI ✦
          </p>

          <h1>
            Pilih Materi
          </h1>

          <div className={styles.wave}></div>

          <p className={styles.heroDesc}>
            Pelajari semua topik secara berurutan
            untuk membuka Simulasi 100 Soal
          </p>

          <div className={styles.progressInfo}>

            <span>
              {doneCount} dari 5 materi selesai
            </span>

            <div className={styles.progressDots}>

              {[1, 2, 3, 4, 5].map((item) => (

                <div
                  key={item}
                  className={
                    item <= doneCount
                      ? styles.dotActive
                      : styles.dot
                  }
                ></div>

              ))}

            </div>

            <div className={styles.percentBadge}>
              {doneCount * 20}% Selesai
            </div>

          </div>

        </div>

        <div className={styles.heroRight}>

          <img
            src="/images/lesson.png"
            alt="Lesson"
          />

        </div>

      </div>

      <div className={styles.lessonGrid}>

        {lessonData.map((item, index) => {

          const status =
            lessonStatus[index]?.status || "locked";

          const path =
            lessonStatus[index]?.path || "#";

          return (

            <div
              key={item.id}
              className={getCardClass(status)}
            >

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
                  {item.id < 10
                    ? `0${item.id}`
                    : item.id}
                </div>

                <div className={styles.cardContent}>

                  <h2>
                    {item.title}
                  </h2>

                  <p>
                    {item.desc}
                  </p>

                </div>

                {getStatusBadge(status)}

              </div>

              <ul
                className={
                  status === "locked"
                    ? styles.topicListLocked
                    : styles.topicList
                }
              >

                {item.topics.map((topic, topicIndex) => (

                  <li key={topicIndex}>

                    {status === "done"
                      ? "✓"
                      : status === "progress"
                      ? "→"
                      : "🔒"}

                    {" "}

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

              {getButton({
                status,
                path
              })}

            </div>

          );

        })}

      </div>

    </div>

  );

}