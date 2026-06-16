"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";

import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaBolt,
  FaExclamationCircle,
  FaHeadphones,
  FaBook,
  FaPen,
} from "react-icons/fa";

import { IoArrowBack } from "react-icons/io5";

export default function ResultPage() {
  const router = useRouter();

  // ===== DATA (nanti diganti dari state/API) =====
  const result = {
    grade: "GOOD",
    totalScore: 85,
    description: "Excellent effort! You are currently in the top 15% of all Edulingo students this week.",
    correct: 78,
    incorrect: 22,
    completionTime: "1h 45m",
    quote: '"Success is a series of small wins."',
    sections: [
      { label: "Structure", icon: <FaPen />, score: 80, correct: 24, total: 30 },
      { label: "Reading",   icon: <FaBook />, score: 90, correct: 27, total: 30 },
      { label: "Listening", icon: <FaHeadphones />, score: 85, correct: 34, total: 40 },
    ],
    analytics: {
      totalQuestions: 100,
      answered: 100,
      answeredPct: "100%",
      unanswered: 0,
      averageAccuracy: "85%",
      fastestSection: "Listening",
      hardestSection: "Structure",
    },
  };

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
            onClick={() => router.push("/dashboard")}
          >
            <IoArrowBack className={styles.reviewIcon} />
            <span>BACK TO DASHBOARD</span>
          </button>
        </div>

      </div>

    </div>
  );
}