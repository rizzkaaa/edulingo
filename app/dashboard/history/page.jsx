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

  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  const fetchHistoryData = async (userId) => {
    try {
      const simulationQuery = query(collection(db, "exam_sessions"), where("userId", "==", userId));
      const practiceQuery = query(collection(db, "practice_history"), where("userId", "==", userId));

      const [simulationSnap, practiceSnap] = await Promise.all([
        getDocs(simulationQuery),
        getDocs(practiceQuery)
      ]);

      let fetchedHistory = [];

      simulationSnap.forEach((docSnap) => {
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
          month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
        });

        const passingGrade = 450; 
        const isSuccess = finalScore >= passingGrade;

        fetchedHistory.push({
          id: docSnap.id,
          dateObj: dateObj, 
          date: formattedDate,
          category: "Simulation",
          activity: data.activityName || "TOEFL Prediction Test",
          score: finalScore, 
          status: isSuccess ? "Success" : "Failed",
          success: isSuccess,
        });
      });
      practiceSnap.forEach((docSnap) => {
        const data = docSnap.data();
        const dateObj = data.createdAt?.toDate() || new Date();
        const formattedDate = dateObj.toLocaleString("id-ID", {
          month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
        });

        let activityName = data.moduleId ? `Practice: Module ${data.moduleId.replace("_", ".")}` : "Exercise Practice";
        const isSuccess = (data.score || 0) >= 70;

        fetchedHistory.push({
          id: docSnap.id,
          dateObj: dateObj,
          date: formattedDate,
          category: "Exercise",
          activity: activityName,
          score: data.score || 0,
          status: isSuccess ? "Success" : "Failed",
          success: isSuccess,
        });
      });
      fetchedHistory.sort((a, b) => b.dateObj - a.dateObj);

      setHistoryData(fetchedHistory);
      setTotalSessions(fetchedHistory.length);
      setLoading(false);
    } catch (error) {
      console.error("Gagal memuat data history:", error);
      setLoading(false);
    }
  };

  const filteredHistory = historyData.filter((item) => {
    const matchesCategory = activeCategory === "All Categories" || item.category === activeCategory;
    const matchesSearch = item.activity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const today = new Date();
  const midnightToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const targetDate = new Date(midnightToday);
  targetDate.setDate(targetDate.getDate() - (currentPage - 1));

  const currentItems = filteredHistory.filter((item) => {
    const d = item.dateObj;
    return (
      d.getFullYear() === targetDate.getFullYear() &&
      d.getMonth() === targetDate.getMonth() &&
      d.getDate() === targetDate.getDate()
    );
  });

  const dailyAverageScore = currentItems.length > 0
    ? Math.round(currentItems.reduce((sum, item) => sum + item.score, 0) / currentItems.length)
    : 0;

  let totalPages = 1;
  if (filteredHistory.length > 0) {
    const oldestDate = filteredHistory[filteredHistory.length - 1].dateObj;
    const midnightOldest = new Date(oldestDate.getFullYear(), oldestDate.getMonth(), oldestDate.getDate());
    const diffTime = Math.abs(midnightToday - midnightOldest);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    totalPages = diffDays + 1;
  }

  const simulationCount = historyData.filter(item => item.category === "Simulation").length;

  const getPageDateString = () => {
    if (currentPage === 1) return "Hari Ini";
    if (currentPage === 2) return "Kemarin";
    return targetDate.toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + 2);

  if (endPage - startPage < 2) {
    startPage = Math.max(1, endPage - 2);
  }

  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

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
          <p>DAILY AVG SCORE :</p>
          <h1>{loading ? "..." : dailyAverageScore}</h1> 
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <span>Time</span>
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
          <p style={{ textAlign: "center", padding: "3rem", color: "#888", fontWeight: "500", fontStyle: "italic" }}>
            Tidak ada aktivitas di hari ini
          </p>
        ) : (
          <div 
            style={{ 
              maxHeight: currentItems.length > 5 ? "420px" : "auto", 
              overflowY: currentItems.length > 5 ? "auto" : "visible",
              paddingRight: currentItems.length > 5 ? "6px" : "0px"
            }}
          >
            {currentItems.map((item) => (
              <div key={item.id} className={styles.tableRow}>
                <span>{item.date.split(",")[1]?.trim() || item.date}</span>
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
                <div className={item.success ? styles.successText : styles.failedText}>
                  {item.success ? <FaCheckCircle /> : <FaTimesCircle />}
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.paginationSection}>
          <p>
            Melihat aktivitas tanggal: <strong>{getPageDateString()}</strong> {currentItems.length > 0 && `(${currentItems.length} aktivitas)`}
          </p>
          
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>
              
              {startPage > 1 && <span style={{ color: "#666", margin: "0 6px", alignSelf: "center" }}>...</span>}
              {visiblePages.map((page) => (
                <button
                  key={page}
                  className={currentPage === page ? styles.activePage : ""}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              {endPage < totalPages && <span style={{ color: "#666", margin: "0 6px", alignSelf: "center" }}>...</span>}

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