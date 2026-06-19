"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import {
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronLeft,
  FaChevronRight,
  FaTrophy
} from "react-icons/fa";

// Import Firebase
import { db, auth } from "@/lib/firebase"; 
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSessions, setTotalSessions] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchHistoryData(user.uid);
      } else {
        setHistoryData([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchHistoryData = async (userId) => {
    try {
      const docRef = doc(db, "exam_sessions", userId);
      const docSnap = await getDoc(docRef);

      let fetchedHistory = [];

      if (docSnap.exists()) {
        const data = docSnap.data();

        let totalPercentageSum = 0;
        let activeSectionsCount = 0;

        if (data.reading_score_percentage !== undefined) {
          totalPercentageSum += data.reading_score_percentage;
          activeSectionsCount++;
        }

        if (data.structure_score_percentage !== undefined) {
          totalPercentageSum += data.structure_score_percentage;
          activeSectionsCount++;
        }

        if (data.listening_score_percentage !== undefined) {
          totalPercentageSum += data.listening_score_percentage;
          activeSectionsCount++;
        }

        // 1. Hitung rata-rata persentase pengerjaan (0 - 100)
        const averagePercentage = activeSectionsCount > 0 ? totalPercentageSum / activeSectionsCount : 0;

        // 2. KONVERSI KE SKOR TOEFL PBT (Rentang 310 - 677)
        // Rumus prediksi cepat: Skor Minimal (310) + (Persentase * Rentang Skor / 100)
        const minToefl = 310;
        const maxToefl = 677;
        const toeflRange = maxToefl - minToefl; // 367
        
        const finalScore = Math.round(minToefl + (averagePercentage * toeflRange) / 100);

        // Format Tanggal
        const dateObj = data.updatedAt?.toDate() || new Date();
        const formattedDate = dateObj.toLocaleString("id-ID", {
          month: "short", 
          day: "numeric", 
          year: "numeric", 
          hour: "2-digit", 
          minute: "2-digit"
        });

        // 3. BATAS KELULUSAN SKOR TOEFL (Misal: Lulus jika skor >= 450)
        const passingGrade = 450; 
        const isSuccess = finalScore >= passingGrade;

        fetchedHistory.push({
          id: docSnap.id,
          date: formattedDate,
          category: "Simulation",
          activity: "TOEFL Prediction Test",
          score: finalScore, // Berupa angka skor TOEFL (misal: 420, 510, dst)
          status: isSuccess ? "Success" : "Failed",
          success: isSuccess,
        });

        setHistoryData(fetchedHistory);
        setTotalSessions(fetchedHistory.length);
        setAverageScore(finalScore);
      } else {
        setHistoryData([]);
        setTotalSessions(0);
        setAverageScore(0);
      }

      setLoading(false);
    } catch (error) {
      console.error("Gagal memuat data history:", error);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <div className={styles.heroLeft}>
          <h1>Learning History & Scores</h1>
          <p>
            Review your learning journey in detail. Track your simulation progress and daily exercises.
          </p>
        </div>
        <div className={styles.decorWrapper}>
          <div className={styles.square}></div>
          <div className={styles.decorBottom}>
            <div className={styles.redBox}></div>
            <div className={styles.yellowCircle}></div>
            <div className={styles.grayBox}></div>
          </div>
        </div>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchBox}>
          <FaSearch />
          <input
            type="text"
            placeholder="Search activities or materials..."
          />
        </div>
        <button className={styles.filterBtn}>
          <FaFilter />
          All Categories
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.totalCard}>
          <p>TOTAL SESSIONS :</p>
          <h1>{loading ? "..." : totalSessions}</h1>
        </div>
        <div className={styles.averageCard}>
          <p>AVERAGE SCORE :</p>
          {/* DI SINI: Menghapus tanda % */}
          <h1>{loading ? "..." : averageScore}</h1> 
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <span>Date</span>
          <span>Category</span>
          <span>Activity</span>
          <span>Score</span>
          <span>Status</span>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            Loading data...
          </p>
        ) : historyData.length === 0 ? (
          <p style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            Belum ada riwayat ujian yang tercatat untuk akun Anda.
          </p>
        ) : (
          historyData.map((item) => (
            <div key={item.id} className={styles.tableRow}>
              <span>{item.date}</span>
              <div>
                <div
                  className={
                    item.category === "Simulation"
                      ? styles.simulationBadge
                      : styles.exerciseBadge
                  }
                >
                  {item.category}
                </div>
              </div>
              <h3>{item.activity}</h3>
              {/* DI SINI: Menghapus tanda % di dalam baris tabel */}
              <h2>{item.score}</h2> 
              <div
                className={
                  item.success ? styles.successText : styles.failedText
                }
              >
                {item.success ? <FaCheckCircle /> : <FaTimesCircle />}
                {item.status}
              </div>
            </div>
          ))
        )}

        <div className={styles.paginationSection}>
          <p>
            Showing {historyData.length} of {totalSessions} activities
          </p>
          <div className={styles.pagination}>
            <button>
              <FaChevronLeft />
            </button>
            <button className={styles.activePage}>1</button>
            <button>2</button>
            <button>
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.challengeBox}>
        <div className={styles.challengeIcon}>
          <FaTrophy />
        </div>
        <div>
          <h2>New Challenge</h2>
          <p>
            Complete 3 more simulations for the ‘Master Reader’ badge.
          </p>
        </div>
      </div>

      <div className={styles.bottomCircle}></div>
    </div>
  );
}