"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";

// Import Firebase
import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

import {
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaClock,
  FaBolt,
  FaExclamationCircle,
  FaHeadphones,
  FaBook,
  FaPen,
} from "react-icons/fa";

export default function ResultPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper fungsi untuk mengubah detik menjadi format jam/menit/detik yang rapi
  const formatCompletionTime = (totalSeconds) => {
    if (!totalSeconds || totalSeconds <= 0) return "0m";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let timeString = "";
    if (hours > 0) timeString += `${hours}h `;
    if (minutes > 0) timeString += `${minutes}m `;
    if (hours === 0 && minutes === 0) timeString += `${seconds}s`;
    return timeString.trim();
  };

  // 1. Ambil User ID yang aktif saat ini
  useEffect(() => {
    let loggedInUser = localStorage.getItem("user_id") || sessionStorage.getItem("user_id");
    
    if (loggedInUser) {
      setUserId(loggedInUser);
    } else {
      // Fallback jika guest id digunakan
      let storedId = sessionStorage.getItem("toefl_guest_id");
      if (storedId) {
        setUserId(storedId);
      } else {
        console.warn("User ID tidak ditemukan.");
        setIsLoading(false);
      }
    }
  }, []);

  // 2. Tarik data hasil simulasi dari Firebase Firestore
  useEffect(() => {
    if (!userId) return;

    const fetchExamResult = async () => {
      try {
        const docRef = doc(db, "exam_sessions", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // Ambil metrik tiap sesi (Sediakan default nilai 0 jika sesi lain belum dikerjakan)
          const readingCorrect = data.reading_correct_answers || 0;
          const readingTotal = data.reading_total_questions || 0;
          const readingScore = data.reading_score_percentage || 0;
          const readingTime = data.reading_time_spent || 0;

          const structureCorrect = data.structure_correct_answers || 0;
          const structureTotal = data.structure_total_questions || 0;
          const structureScore = data.structure_score_percentage || 0;
          const structureTime = data.structure_time_spent || 0;

          const listeningCorrect = data.listening_correct_answers || 0;
          const listeningTotal = data.listening_total_questions || 0;
          const listeningScore = data.listening_score_percentage || 0;
          const listeningTime = data.listening_time_spent || 0;

          // Akumulasi Total Keseluruhan
          const totalCorrect = readingCorrect + structureCorrect + listeningCorrect;
          const totalQuestions = readingTotal + structureTotal + listeningTotal;
          const totalIncorrect = totalQuestions - totalCorrect;
          
          // Rata-rata skor atau skor gabungan akumulatif
          const totalScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
          const totalTimeSpent = readingTime + structureTime + listeningTime;

          // Menentukan Grade & Deskripsi Berdasarkan Skor Akumulasi
          let grade = "NEED IMPROVEMENT";
          let description = "Keep practicing! Every mistake is a step closer to mastering the exam.";
          if (totalScore >= 80) {
            grade = "GOOD";
            description = "Excellent effort! You are currently performing remarkably well in this simulation.";
          } else if (totalScore >= 65) {
            grade = "AVERAGE";
            description = "Great job! With a little more focus on your weak sections, you can ace this.";
          }

          // Cari section tercepat dan tersulit secara dinamis sederhana
          const scoresArr = [
            { name: "Reading", score: readingScore },
            { name: "Structure", score: structureScore },
            { name: "Listening", score: listeningScore }
          ];
          
          // Urutkan untuk mencari skor paling rendah (termasuk yang paling sulit)
          const hardestSection = scoresArr.reduce((prev, current) => (prev.score < current.score) ? prev : current).name;

          // Susun state object hasil akhir
          setResult({
            grade: grade,
            totalScore: totalScore,
            description: description,
            correct: totalCorrect,
            incorrect: totalIncorrect,
            completionTime: formatCompletionTime(totalTimeSpent),
            quote: '"Success is a series of small wins."',
            sections: [
              { label: "Structure", icon: <FaPen />, score: structureScore, correct: structureCorrect, total: structureTotal },
              { label: "Reading", icon: <FaBook />, score: readingScore, correct: readingCorrect, total: readingTotal },
              { label: "Listening", icon: <FaHeadphones />, score: listeningScore, correct: listeningCorrect, total: listeningTotal },
            ],
            analytics: {
              totalQuestions: totalQuestions,
              answered: totalCorrect + totalIncorrect,
              answeredPct: totalQuestions > 0 ? `${Math.round(((totalCorrect + totalIncorrect) / totalQuestions) * 100)}%` : "0%",
              unanswered: totalQuestions - (totalCorrect + totalIncorrect),
              averageAccuracy: `${totalScore}%`,
              fastestSection: "Reading", // Anda bisa kembangkan tracking waktu per sesi jika ada datanya di Firestore
              hardestSection: hardestSection,
            },
          });
        } else {
          console.error("Dokumen hasil ujian tidak ditemukan di Firebase.");
        }
      } catch (error) {
        console.error("Gagal mengambil data dari Firebase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamResult();
  }, [userId]);

  if (isLoading) {
    return <div className={styles.page} style={{ color: "white", textAlign: "center", paddingTop: "20vh" }}>Loading simulation results...</div>;
  }

  if (!result) {
    return (
      <div className={styles.page} style={{ color: "white", textAlign: "center", paddingTop: "20vh" }}>
        <h3>Belum ada data hasil ujian.</h3>
        <p>Silakan selesaikan sesi simulasi Anda terlebih dahulu.</p>
        <button className={styles.reviewBtn} onClick={() => router.push("/dashboard/history")} style={{ marginTop: "20px" }}>
          MENU HISTORY
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>

      <h1 className={styles.pageTitle}>Simulation Result</h1>
      <div className={styles.pageDivider}></div>

      {/* ===== ROW 1: PERFORMANCE + QUOTE ===== */}
      <div className={styles.topRow}>

        {/* Performance Card */}
        <div className={styles.performanceCard}>

          <div className={styles.scoreSection}>
            <div className={styles.scoreCircle}>
              <span className={styles.scoreNumber}>{result.totalScore}</span>
              <span className={styles.scoreLabel}>TOTAL SCORE</span>
            </div>

            <div className={styles.scoreDetails}>
              <div className={styles.gradeBadge}>{result.grade}</div>
              <h2 className={styles.performanceTitle}>Simulation Performance</h2>
              <p className={styles.performanceDesc}>{result.description}</p>

              <div className={styles.statsRow}>
                <div className={styles.statBox}>
                  <FaCheckCircle className={styles.iconCorrect} />
                  <div>
                    <div className={styles.statNum}>{result.correct}</div>
                    <div className={styles.statLbl}>CORRECT</div>
                  </div>
                </div>

                <div className={styles.statBox}>
                  <FaTimesCircle className={styles.iconIncorrect} />
                  <div>
                    <div className={styles.statNum}>{result.incorrect}</div>
                    <div className={styles.statLbl}>INCORRECT</div>
                  </div>
                </div>
              </div>

              <div className={styles.timeBox}>
                <FaClock className={styles.iconTime} />
                <div>
                  <div className={styles.statNum}>{result.completionTime}</div>
                  <div className={styles.statLbl}>COMPLETION TIME</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Quote Card */}
        <div className={styles.quoteCard}>
          <div className={styles.quoteLabel}>TODAYS QUOTE</div>

          <div className={styles.quoteImageWrapper}>
            <Image
              src="/images/result.png"
              alt="Today's Quote"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>

          <p className={styles.quoteText}>{result.quote}</p>
        </div>

      </div>

      {/* ===== ROW 2: SECTION SCORES ===== */}
      <div className={styles.sectionRow}>
        {result.sections.map((sec) => (
          <div key={sec.label} className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>{sec.icon}</span>
                <span>{sec.label}</span>
              </div>
              <span className={styles.sectionScore}>{sec.score}%</span>
            </div>

            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${sec.score}%` }}
              ></div>
            </div>

            <p className={styles.sectionStat}>{sec.correct}/{sec.total} Questions</p>
          </div>
        ))}
      </div>

      {/* ===== ROW 3: ANALYTICS + REVIEW ===== */}
      <div className={styles.bottomRow}>

        {/* Analytics Table */}
        <div className={styles.analyticsCard}>
          <div className={styles.analyticsHeader}>TECHNICAL ANALYTICS</div>

          <table className={styles.analyticsTable}>
            <tbody>
              <tr>
                <td className={styles.tdLabel}>Total Questions</td>
                <td className={styles.tdValue}>{result.analytics.totalQuestions}</td>
              </tr>
              <tr>
                <td className={styles.tdLabel}>Answered</td>
                <td className={styles.tdValue}>
                  {result.analytics.answered}
                  <span className={styles.tdMuted}> ({result.analytics.answeredPct})</span>
                </td>
              </tr>
              <tr>
                <td className={styles.tdLabel}>Unanswered</td>
                <td className={`${styles.tdValue} ${styles.tdRed}`}>
                  {result.analytics.unanswered}
                </td>
              </tr>
              <tr>
                <td className={styles.tdLabel}>Average Accuracy</td>
                <td className={styles.tdValue}>{result.analytics.averageAccuracy}</td>
              </tr>
              <tr>
                <td className={styles.tdLabel}>Fastest Section</td>
                <td className={styles.tdValue}>
                  <FaBolt className={styles.iconBolt} /> {result.analytics.fastestSection}
                </td>
              </tr>
              <tr>
                <td className={styles.tdLabel}>Hardest Section</td>
                <td className={styles.tdValue}>
                  <FaExclamationCircle className={styles.iconHard} /> {result.analytics.hardestSection}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Review Button */}
        <div className={styles.reviewSection}>
          <button
            className={styles.reviewBtn}
            onClick={() => router.push("/dashboard/history")}
          >
            <FaEye className={styles.reviewIcon} />
            <span>CHECK YOUR HISTORY</span>
          </button>
        </div>

      </div>

    </div>
  );
}