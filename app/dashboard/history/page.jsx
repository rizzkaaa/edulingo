"use client";

import { useState, useEffect, useRef } from "react";
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

import { db, auth } from "@/lib/firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSessions, setTotalSessions] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // LOGIKA BARU: State Paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // LOGIKA BARU: Reset halaman ke nomor 1 jika user melakukan filter atau pencarian baru
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  const fetchHistoryData = async (userId) => {
    try {
      const q = query(
        collection(db, "exam_sessions"),
        where("userId", "==", userId)
      );
      
      const querySnapshot = await getDocs(q);
      let fetchedHistory = [];
      let totalScoreSum = 0;

      querySnapshot.forEach((docSnap) => {
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

        const averagePercentage = activeSectionsCount > 0 ? totalPercentageSum / activeSectionsCount : 0;

        const minToefl = 310;
        const maxToefl = 677;
        const toeflRange = maxToefl - minToefl; 
        
        const finalScore = Math.round(minToefl + (averagePercentage * toeflRange) / 100);

        const dateObj = data.updatedAt?.toDate() || new Date();
        const formattedDate = dateObj.toLocaleString("id-ID", {
          month: "short", 
          day: "numeric", 
          year: "numeric", 
          hour: "2-digit", 
          minute: "2-digit"
        });

        const passingGrade = 450; 
        const isSuccess = finalScore >= passingGrade;

        fetchedHistory.push({
          id: docSnap.id,
          dateObj: dateObj, 
          date: formattedDate,
          category: data.category || data.type || "Simulation",
          activity: data.activityName || "TOEFL Prediction Test",
          score: finalScore, 
          status: isSuccess ? "Success" : "Failed",
          success: isSuccess,
        });

        totalScoreSum += finalScore;
      });

      fetchedHistory.sort((a, b) => b.dateObj - a.dateObj);

      setHistoryData(fetchedHistory);
      setTotalSessions(fetchedHistory.length);
      
      const avg = fetchedHistory.length > 0 ? Math.round(totalScoreSum / fetchedHistory.length) : 0;
      setAverageScore(avg);
      
      setLoading(false);
    } catch (error) {
      console.error("Gagal memuat data history:", error);
      setLoading(false);
    }
  };

  // 1. Filter data berdasarkan input search & kriteria kategori
  const filteredHistory = historyData.filter((item) => {
    const matchesCategory = activeCategory === "All Categories" || item.category === activeCategory;
    const matchesSearch = item.activity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 2. LOGIKA BARU: Hitung indeks data yang akan dipotong (sliced) untuk halaman aktif
  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  
  // Memotong data hasil filter agar hanya berisi maksimal 5 item saja
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  const simulationCount = historyData.filter(item => item.category === "Simulation").length;

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button 
            className={styles.filterBtn} 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <FaFilter />
            {activeCategory}
          </button>
          
          {isDropdownOpen && (
            <div style={{
              position: "absolute",
              top: "110%",
              right: "0",
              background: "#1E1E2F", 
              border: "1px solid #333",
              borderRadius: "8px",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              zIndex: 10,
              minWidth: "160px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
            }}>
              {["All Categories", "Simulation", "Exercise"].map((cat) => (
                <div 
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setIsDropdownOpen(false);
                  }}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    background: activeCategory === cat ? "#333" : "transparent",
                    color: "white",
                    fontSize: "0.9rem",
                    transition: "0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = "#333"}
                  onMouseOut={(e) => e.currentTarget.style.background = activeCategory === cat ? "#333" : "transparent"}
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.totalCard}>
          <p>TOTAL SESSIONS :</p>
          <h1>{loading ? "..." : totalSessions}</h1>
        </div>
        <div className={styles.averageCard}>
          <p>AVERAGE SCORE :</p>
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
        ) : currentItems.length === 0 ? (
          <p style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            Belum ada riwayat yang sesuai.
          </p>
        ) : (
          // PERBAIKAN: Mengganti filteredHistory menjadi currentItems (maksimal 5 item)
          currentItems.map((item) => (
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

        {/* LOGIKA PAGINASI BARU */}
        <div className={styles.paginationSection}>
          <p>
            Showing {filteredHistory.length > 0 ? indexOfFirstItem + 1 : 0} to{" "}
            {Math.min(indexOfLastItem, filteredHistory.length)} of{" "}
            {filteredHistory.length} activities
          </p>
          
          {totalPages > 1 && (
            <div className={styles.pagination}>
              {/* Tombol Sebelumnya */}
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>
              
              {/* Daftar Angka Halaman Dinamis */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={currentPage === page ? styles.activePage : ""}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              {/* Tombol Selanjutnya */}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>

      {simulationCount >= 3 && (
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
      )}

      <div className={styles.bottomCircle}></div>
    </div>
  );
}