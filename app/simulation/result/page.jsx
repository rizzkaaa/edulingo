"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";

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

  const [sessionId, setSessionId] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const currentSession = sessionStorage.getItem("current_exam_session");
    if (currentSession) {
      setSessionId(currentSession);
    } else {
      console.warn("Session ID tidak ditemukan. Mungkin ujian belum dikerjakan.");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    const fetchExamResult = async () => {
      try {
        const docRef = doc(db, "exam_sessions", sessionId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const sections = [
            { 
              name: "Reading", 
              correct: Number(data.reading_correct_answers) || 0, 
              total: Number(data.reading_total_questions) || 0, 
              time: Number(data.reading_time_spent) || 0, 
              score: Number(data.reading_score_percentage) || 0 
            },
            { 
              name: "Structure", 
              correct: Number(data.structure_correct_answers) || 0, 
              total: Number(data.structure_total_questions) || 0, 
              time: Number(data.structure_time_spent) || 0, 
              score: Number(data.structure_score_percentage) || 0 
            },
            { 
              name: "Listening", 
              correct: Number(data.listening_correct_answers) || 0, 
              total: Number(data.listening_total_questions) || 0, 
              time: Number(data.listening_time_spent) || 0, 
              score: Number(data.listening_score_percentage) || 0 
            }
          ];
          const totalCorrect = sections.reduce((sum, s) => sum + s.correct, 0);
          const totalQuestions = sections.reduce((sum, s) => sum + s.total, 0);
          
          const totalAnswered = totalQuestions; 
          const totalUnanswered = 0;
          
          const totalScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
          const totalTimeSpent = sections.reduce((sum, s) => sum + s.time, 0);

          const validSections = sections.filter(s => s.time > 0);
          const fastestSection = validSections.length > 0 
            ? validSections.reduce((prev, curr) => prev.time < curr.time ? prev : curr).name 
            : "-";
          
          const hardestSection = sections.reduce((prev, curr) => prev.score < curr.score ? prev : curr).name;

          let grade = "NEED IMPROVEMENT";
          let description = "Keep practicing! Every mistake is a step closer to mastering the exam.";
          if (totalScore >= 80) {
            grade = "GOOD";
            description = "Excellent effort! You are currently performing remarkably well in this simulation.";
          } else if (totalScore >= 65) {
            grade = "AVERAGE";
            description = "Great job! With a little more focus on your weak sections, you can ace this.";
          }
          setResult({
            grade,
            totalScore,
            description,
            correct: totalCorrect,
            incorrect: totalQuestions - totalCorrect,
            completionTime: formatCompletionTime(totalTimeSpent),
            quote: '"Success is a series of small wins."',
            sections: sections.map(s => ({
              label: s.name,
              icon: s.name === "Reading" ? <FaBook /> : s.name === "Structure" ? <FaPen /> : <FaHeadphones />,
              score: s.score,
              correct: s.correct,
              total: s.total
            })),
            analytics: {
              totalQuestions,
              answered: totalAnswered,
              answeredPct: totalQuestions > 0 ? `${Math.round((totalAnswered / totalQuestions) * 100)}%` : "0%",
              unanswered: totalUnanswered,
              averageAccuracy: `${totalScore}%`,
              fastestSection,
              hardestSection,
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
  }, [sessionId]);

  const handleFinishAndReview = () => {
    sessionStorage.removeItem("current_exam_session");
    router.push("/dashboard/history");
  };

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

      <div className={styles.topRow}>

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

      <div className={styles.bottomRow}>

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

        <div className={styles.reviewSection}>
          <button
            className={styles.reviewBtn}
            onClick={handleFinishAndReview}
          >
            <FaEye className={styles.reviewIcon} />
            <span>CHECK YOUR HISTORY</span>
          </button>
        </div>

      </div>

    </div>
  );
}