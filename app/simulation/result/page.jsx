"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";

import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { calculateToeflScores } from "@/lib/toeflScore";

import {
  FaCheckCircle,
  FaTimesCircle,
  FaQuestionCircle,
  FaEye,
  FaClock,
  FaBolt,
  FaExclamationCircle,
  FaHeadphones,
  FaBook,
  FaPen,
  FaCalculator,
} from "react-icons/fa";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    const querySession = searchParams ? (searchParams.get("sessionId") || searchParams.get("id")) : null;
    const currentSession = querySession || sessionStorage.getItem("current_exam_session");

    if (currentSession) {
      setSessionId(currentSession);
    } else {
      console.warn("Session ID tidak ditemukan.");
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!sessionId) return;

    const fetchExamResult = async () => {
      try {
        const docRef = doc(db, "exam_sessions", sessionId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const listeningCorrect = Number(data.listening_correct_answers) || 0;
          const listeningTotal = Number(data.listening_total_questions) || 36;
          const listeningAnswered = data.listening_answered_questions !== undefined 
            ? Number(data.listening_answered_questions) 
            : listeningTotal;

          const structureCorrect = Number(data.structure_correct_answers) || 0;
          const structureTotal = Number(data.structure_total_questions) || 28;
          const structureAnswered = data.structure_answered_questions !== undefined 
            ? Number(data.structure_answered_questions) 
            : structureTotal;

          const readingCorrect = Number(data.reading_correct_answers) || 0;
          const readingTotal = Number(data.reading_total_questions) || 36;
          const readingAnswered = data.reading_answered_questions !== undefined 
            ? Number(data.reading_answered_questions) 
            : readingTotal;

          const toeflCalc = calculateToeflScores({
            listeningCorrect,
            listeningTotal,
            structureCorrect,
            structureTotal,
            readingCorrect,
            readingTotal,
          });

          const sections = [
            {
              name: "Listening",
              correct: listeningCorrect,
              answered: listeningAnswered,
              total: listeningTotal,
              time: Number(data.listening_time_spent) || 0,
              scorePct: Number(data.listening_score_percentage) || toeflCalc.listening.percentage,
              converted: toeflCalc.listening.converted,
            },
            {
              name: "Structure",
              correct: structureCorrect,
              answered: structureAnswered,
              total: structureTotal,
              time: Number(data.structure_time_spent) || 0,
              scorePct: Number(data.structure_score_percentage) || toeflCalc.structure.percentage,
              converted: toeflCalc.structure.converted,
            },
            {
              name: "Reading",
              correct: readingCorrect,
              answered: readingAnswered,
              total: readingTotal,
              time: Number(data.reading_time_spent) || 0,
              scorePct: Number(data.reading_score_percentage) || toeflCalc.reading.percentage,
              converted: toeflCalc.reading.converted,
            },
          ];

          const totalCorrect = listeningCorrect + structureCorrect + readingCorrect;
          const totalQuestions = listeningTotal + structureTotal + readingTotal;
          const totalAnswered = Math.min(totalQuestions, listeningAnswered + structureAnswered + readingAnswered);
          const totalUnanswered = Math.max(0, totalQuestions - totalAnswered);
          const totalIncorrect = Math.max(0, totalAnswered - totalCorrect);
          const totalTimeSpent = sections.reduce((sum, s) => sum + s.time, 0);

          const validSections = sections.filter((s) => s.time > 0);
          const fastestSection =
            validSections.length > 0
              ? validSections.reduce((prev, curr) => (prev.time < curr.time ? prev : curr)).name
              : "-";

          const hardestSection = sections.reduce((prev, curr) =>
            prev.scorePct < curr.scorePct ? prev : curr
          ).name;

          let grade = "NEED IMPROVEMENT";
          let description = "Keep practicing! Every mistake is a step closer to mastering the exam.";
          if (toeflCalc.finalToeflScore >= 550) {
            grade = "EXCELLENT";
            description = "Outstanding performance! You achieved a top-tier TOEFL score.";
          } else if (toeflCalc.finalToeflScore >= 480) {
            grade = "GOOD";
            description = "Great effort! You are performing remarkably well in this simulation.";
          } else if (toeflCalc.finalToeflScore >= 420) {
            grade = "AVERAGE";
            description = "Good progress! Focus on your weak sections to boost your final score.";
          }

          setResult({
            grade,
            totalScore: toeflCalc.finalToeflScore,
            toeflCalc,
            description,
            correct: totalCorrect,
            incorrect: totalIncorrect,
            unanswered: totalUnanswered,
            completionTime: formatCompletionTime(totalTimeSpent),
            quote: '"Success is a series of small wins."',
            sections: sections.map((s) => ({
              label: s.name,
              icon: s.name === "Reading" ? <FaBook /> : s.name === "Structure" ? <FaPen /> : <FaHeadphones />,
              scorePct: s.scorePct,
              correct: s.correct,
              answered: s.answered,
              total: s.total,
              time: s.time,
              converted: s.converted,
            })),
            analytics: {
              totalQuestions,
              answered: totalAnswered,
              answeredPct: totalQuestions > 0 ? `${Math.round((totalAnswered / totalQuestions) * 100)}%` : "0%",
              unanswered: totalUnanswered,
              averageAccuracy: `${Math.round((totalCorrect / (totalAnswered || 1)) * 100)}%`,
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
    return (
      <div className={styles.page} style={{ color: "#1D1B18", textAlign: "center", paddingTop: "20vh" }}>
        Loading simulation results...
      </div>
    );
  }

  if (!result) {
    return (
      <div className={styles.page} style={{ color: "#1D1B18", textAlign: "center", paddingTop: "20vh" }}>
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
              <span className={styles.scoreLabel}>SKOR TOEFL</span>
            </div>

            <div className={styles.scoreDetails}>
              <div className={styles.gradeBadge}>{result.grade}</div>
              <h2 className={styles.performanceTitle}>Simulation Performance</h2>
              <p className={styles.performanceDesc}>{result.description}</p>

              <div className={styles.statsRow} style={{ gridTemplateColumns: result.unanswered > 0 ? "1fr 1fr 1fr" : "1fr 1fr" }}>
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

                {result.unanswered > 0 && (
                  <div className={styles.statBox}>
                    <FaQuestionCircle style={{ fontSize: "22px", color: "#E8A33D", flexShrink: 0 }} />
                    <div>
                      <div className={styles.statNum}>{result.unanswered}</div>
                      <div className={styles.statLbl}>UNANSWERED</div>
                    </div>
                  </div>
                )}
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
            <Image src="/images/result.png" alt="Today's Quote" fill style={{ objectFit: "cover" }} />
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
              <span className={styles.sectionScore}>{sec.scorePct}%</span>
            </div>

            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${sec.scorePct}%` }}></div>
            </div>

            <p className={styles.sectionStat}>
              {sec.correct}/{sec.total} Jawaban Benar (Konversi: <strong>{sec.converted}</strong>)
            </p>
            <p style={{ fontSize: "12px", color: "#57423C", margin: "4px 0 0 0", fontWeight: "600" }}>
              ⏱️ Waktu Sesi: <strong>{formatCompletionTime(sec.time)}</strong>
            </p>
          </div>
        ))}
      </div>

      {/* ===== DETAILED TOEFL SCORE CONVERSION & CALCULATION BREAKDOWN ===== */}
      <div className={styles.conversionCard}>
        <div className={styles.conversionHeader}>
          <span><FaCalculator style={{ marginRight: "8px", verticalAlign: "middle" }} /> RINCIAN KONVERSI & PERHITUNGAN SKOR TOEFL</span>
          <span style={{ fontSize: "12px", background: "#FFD02C", color: "#1D1B18", padding: "2px 8px", fontWeight: "900" }}>
            STANDARD TOEFL PBT SCALE
          </span>
        </div>

        <div className={styles.conversionBody}>
          <p style={{ margin: 0, fontSize: "14px", color: "#57423C", fontWeight: "600" }}>
            Berikut adalah rincian jawaban benar tiap sesi yang dikonversi ke dalam skala nilai standar TOEFL PBT (31–68) serta tahapan kalkulasi menuju skor akhir:
          </p>

          <div className={styles.conversionTableWrapper}>
            <table className={styles.conversionTable}>
              <thead>
                <tr>
                  <th>Sesi Ujian</th>
                  <th>Jawaban Benar</th>
                  <th>Terjawab</th>
                  <th>Total Soal</th>
                  <th>Akurasi</th>
                  <th>Nilai Konversi</th>
                </tr>
              </thead>
              <tbody>
                {result.sections.map((sec) => (
                  <tr key={sec.label}>
                    <td>
                      {sec.label === "Listening" ? "🎧 Listening Comprehension" : sec.label === "Structure" ? "✍️ Structure & Written Expression" : "📖 Reading Comprehension"}
                    </td>
                    <td>{sec.correct}</td>
                    <td>
                      {sec.answered}
                      {sec.answered < sec.total && (
                        <span style={{ fontSize: "12px", color: "#C7302C", marginLeft: "4px", fontWeight: "bold" }}>
                          ({sec.total - sec.answered} tak terjawab)
                        </span>
                      )}
                    </td>
                    <td>{sec.total}</td>
                    <td>{sec.scorePct}%</td>
                    <td>
                      <span className={styles.convertedScoreBadge}>{sec.converted}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.calcStepsBox}>
            <div className={styles.calcStepsTitle}>📐 Tahapan Perhitungan Skor Akhir TOEFL:</div>

            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>1</div>
              <div>
                <strong>Jumlahkan Nilai Konversi Ketiga Sesi:</strong>
                <br />
                <code>
                  Listening ({result.toeflCalc.listening.converted}) + Structure ({result.toeflCalc.structure.converted}) + Reading ({result.toeflCalc.reading.converted}) = <strong>{result.toeflCalc.calculationSteps.sumConverted}</strong>
                </code>
              </div>
            </div>

            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>2</div>
              <div>
                <strong>Kalikan dengan 10:</strong>
                <br />
                <code>
                  {result.toeflCalc.calculationSteps.sumConverted} × 10 = <strong>{result.toeflCalc.calculationSteps.stepMultiply}</strong>
                </code>
              </div>
            </div>

            <div className={styles.stepItem}>
              <div className={styles.stepNumber}>3</div>
              <div>
                <strong>Bagi dengan 3 (Rumus Resmi TOEFL PBT):</strong>
                <br />
                <code>
                  {result.toeflCalc.calculationSteps.stepMultiply} ÷ 3 = <strong>{result.toeflCalc.finalToeflScore}</strong>
                </code>
              </div>
            </div>
          </div>

          <div className={styles.finalScoreBanner}>
            <div className={styles.finalScoreBannerText}>HASIL PERHITUNGAN SKOR AKHIR TOEFL</div>
            <div className={styles.finalScoreBannerNum}>{result.toeflCalc.finalToeflScore} <span style={{ fontSize: "18px", color: "#FFF" }}>/ 677</span></div>
          </div>
        </div>
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
                <td className={`${styles.tdValue} ${styles.tdRed}`}>{result.analytics.unanswered}</td>
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
          <button className={styles.reviewBtn} onClick={handleFinishAndReview}>
            <FaEye className={styles.reviewIcon} />
            <span>CHECK YOUR HISTORY</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className={styles.page} style={{ color: "#1D1B18", textAlign: "center", paddingTop: "20vh" }}>Loading result page...</div>}>
      <ResultContent />
    </Suspense>
  );
}