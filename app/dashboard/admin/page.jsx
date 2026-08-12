"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { calculateToeflScores } from "@/lib/toeflScore";
import {
  generateAndDownloadCertificatesZip,
  generateSingleCertificatePDF,
} from "@/lib/certificateGenerator";
import {
  FaSearch,
  FaTimes,
  FaSyncAlt,
  FaUserCheck,
  FaUserSlash,
  FaUsers,
  FaShieldAlt,
  FaTrophy,
  FaBookOpen,
  FaHistory,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaSortAmountDown,
  FaArrowLeft,
  FaFileCsv,
  FaFileArchive,
  FaDownload,
} from "react-icons/fa";
import { LuClock, LuTarget, LuAward } from "react-icons/lu";

const ADMIN_EMAIL = "p@gmail.com";

export default function AdminDashboardPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Raw data from Firestore
  const [usersList, setUsersList] = useState([]);
  const [examSessions, setExamSessions] = useState([]);
  const [practiceHistory, setPracticeHistory] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters and Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'active' | 'inactive' | 'has_simulation' | 'no_simulation'
  const [sortOption, setSortOption] = useState("terbaru");

  // Selected User for History Modal
  const [selectedUserForHistory, setSelectedUserForHistory] = useState(null);
  const [activeHistoryTab, setActiveHistoryTab] = useState("simulation"); // 'simulation' | 'practice'

  // Confirm Modal state for single toggle or bulk action
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "", // 'single_toggle' | 'bulk_activate' | 'bulk_deactivate'
    targetUser: null,
    title: "",
    message: "",
    confirmAction: null,
    isDanger: false,
  });

  // Action in progress (loading state)
  const [actionLoading, setActionLoading] = useState(false);

  // Certificate generation progress state
  const [certProgress, setCertProgress] = useState({
    isGenerating: false,
    current: 0,
    total: 0,
    statusText: "",
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 1. Check Auth & Verify Admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch all collections from Firestore
  const fetchAllData = useCallback(async (showIndicator = false) => {
    if (showIndicator) setIsRefreshing(true);
    try {
      const [usersSnap, sessionsSnap, practiceSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "exam_sessions")),
        getDocs(collection(db, "practice_history")),
      ]);

      const users = [];
      usersSnap.forEach((docSnap) => {
        users.push({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });

      const sessions = [];
      sessionsSnap.forEach((docSnap) => {
        sessions.push({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });

      const practices = [];
      practiceSnap.forEach((docSnap) => {
        practices.push({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });

      setUsersList(users);
      setExamSessions(sessions);
      setPracticeHistory(practices);
    } catch (error) {
      console.error("Gagal memuat data admin:", error);
      showToast("Gagal memuat data dari database!");
    } finally {
      setIsDataLoading(false);
      if (showIndicator) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      (async () => {
        if (isMounted) {
          await fetchAllData();
        }
      })();
    }
    return () => {
      isMounted = false;
    };
  }, [currentUser, fetchAllData]);

  // 3. Process each user with enriched simulation and practice metrics
  const processedUsers = useMemo(() => {
    return usersList.map((u) => {
      const isUserActive =
        u.isActive !== false && u.status !== "inactive";
      const isAdminAccount =
        u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      // Find all simulation sessions belonging to this user
      const userSessions = examSessions
        .filter((s) => s.userId === u.id || s.uid === u.id)
        .map((s) => {
          const listeningCorrect = Number(s.listening_correct_answers) || 0;
          const listeningTotal = Number(s.listening_total_questions) || 36;
          const structureCorrect = Number(s.structure_correct_answers) || 0;
          const structureTotal = Number(s.structure_total_questions) || 28;
          const readingCorrect = Number(s.reading_correct_answers) || 0;
          const readingTotal = Number(s.reading_total_questions) || 36;

          const toeflCalc = calculateToeflScores({
            listeningCorrect,
            listeningTotal,
            structureCorrect,
            structureTotal,
            readingCorrect,
            readingTotal,
          });

          const finalScore = toeflCalc.finalToeflScore;
          const dateObj =
            s.updatedAt?.toDate?.() ||
            s.createdAt?.toDate?.() ||
            new Date();

          return {
            id: s.id,
            dateObj,
            formattedDate: dateObj.toLocaleString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            activity: s.activityName || "TOEFL Prediction Test",
            score: finalScore,
            isPassed: finalScore >= 450,
            listening: {
              correct: listeningCorrect,
              total: listeningTotal,
              score: toeflCalc.listening.converted,
              pct: toeflCalc.listening.percentage,
              time: Number(s.listening_time_spent) || 0,
            },
            structure: {
              correct: structureCorrect,
              total: structureTotal,
              score: toeflCalc.structure.converted,
              pct: toeflCalc.structure.percentage,
              time: Number(s.structure_time_spent) || 0,
            },
            reading: {
              correct: readingCorrect,
              total: readingTotal,
              score: toeflCalc.reading.converted,
              pct: toeflCalc.reading.percentage,
              time: Number(s.reading_time_spent) || 0,
            },
            totalTime:
              Number(s.total_time_spent) ||
              (Number(s.listening_time_spent) || 0) +
                (Number(s.structure_time_spent) || 0) +
                (Number(s.reading_time_spent) || 0),
          };
        })
        .sort((a, b) => b.dateObj - a.dateObj);

      // Find all practice records
      const userPractices = practiceHistory
        .filter((p) => p.userId === u.id || p.uid === u.id)
        .map((p) => {
          const dateObj = p.createdAt?.toDate?.() || new Date();
          return {
            id: p.id,
            dateObj,
            formattedDate: dateObj.toLocaleString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            moduleId: p.moduleId || "Exercise",
            score: p.score || 0,
            isPassed: (p.score || 0) >= 70,
          };
        })
        .sort((a, b) => b.dateObj - a.dateObj);

      // Calculations
      const simulationCount = userSessions.length;
      const highestScore =
        simulationCount > 0
          ? Math.max(...userSessions.map((s) => s.score))
          : null;
      const averageScore =
        simulationCount > 0
          ? Math.round(
              userSessions.reduce((acc, curr) => acc + curr.score, 0) /
                simulationCount
            )
          : null;

      const createdDateObj = u.createdAt?.toDate?.() || null;
      const formattedCreatedDate = createdDateObj
        ? createdDateObj.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "Belum tercatat";

      return {
        ...u,
        isActive: isUserActive,
        isAdmin: isAdminAccount,
        createdDateObj,
        formattedCreatedDate,
        simulations: userSessions,
        simulationCount,
        highestScore,
        averageScore,
        practices: userPractices,
        practiceCount: userPractices.length,
      };
    });
  }, [usersList, examSessions, practiceHistory]);

  // 4. Overall Platform Statistics
  const statsOverview = useMemo(() => {
    const totalUsers = processedUsers.length;
    const activeUsers = processedUsers.filter((u) => u.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;
    const totalSimulations = examSessions.length;

    // Calculate total average score across all simulation sessions
    let totalScoreSum = 0;
    let passedCount = 0;
    examSessions.forEach((s) => {
      const listeningCorrect = Number(s.listening_correct_answers) || 0;
      const listeningTotal = Number(s.listening_total_questions) || 36;
      const structureCorrect = Number(s.structure_correct_answers) || 0;
      const structureTotal = Number(s.structure_total_questions) || 28;
      const readingCorrect = Number(s.reading_correct_answers) || 0;
      const readingTotal = Number(s.reading_total_questions) || 36;

      const { finalToeflScore } = calculateToeflScores({
        listeningCorrect,
        listeningTotal,
        structureCorrect,
        structureTotal,
        readingCorrect,
        readingTotal,
      });

      totalScoreSum += finalToeflScore;
      if (finalToeflScore >= 450) passedCount++;
    });

    const averageToeflScore =
      totalSimulations > 0 ? Math.round(totalScoreSum / totalSimulations) : 0;
    const passPercentage =
      totalSimulations > 0
        ? Math.round((passedCount / totalSimulations) * 100)
        : 0;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalSimulations,
      averageToeflScore,
      passPercentage,
    };
  }, [processedUsers, examSessions]);

  // 5. Filter & Sort Logic
  const filteredAndSortedUsers = useMemo(() => {
    let result = [...processedUsers];

    // Search filter (name, username, email)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (u) =>
          (u.fullName || "").toLowerCase().includes(q) ||
          (u.username || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter === "active") {
      result = result.filter((u) => u.isActive);
    } else if (statusFilter === "inactive") {
      result = result.filter((u) => !u.isActive);
    } else if (statusFilter === "has_simulation") {
      result = result.filter((u) => u.simulationCount > 0);
    } else if (statusFilter === "no_simulation") {
      result = result.filter((u) => u.simulationCount === 0);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOption === "nama-asc") {
        return (a.fullName || a.username || "").localeCompare(
          b.fullName || b.username || ""
        );
      }
      if (sortOption === "nama-desc") {
        return (b.fullName || b.username || "").localeCompare(
          a.fullName || a.username || ""
        );
      }
      if (sortOption === "terbaru") {
        const timeA = a.createdDateObj ? a.createdDateObj.getTime() : 0;
        const timeB = b.createdDateObj ? b.createdDateObj.getTime() : 0;
        return timeB - timeA;
      }
      if (sortOption === "terlama") {
        const timeA = a.createdDateObj ? a.createdDateObj.getTime() : 0;
        const timeB = b.createdDateObj ? b.createdDateObj.getTime() : 0;
        return timeA - timeB;
      }
      if (sortOption === "skor-tinggi") {
        return (b.highestScore || 0) - (a.highestScore || 0);
      }
      if (sortOption === "simulasi-banyak") {
        return b.simulationCount - a.simulationCount;
      }
      if (sortOption === "aktif-dulu") {
        return (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0);
      }
      if (sortOption === "nonaktif-dulu") {
        return (a.isActive ? 1 : 0) - (b.isActive ? 1 : 0);
      }
      return 0;
    });

    return result;
  }, [processedUsers, searchQuery, statusFilter, sortOption]);

  // 6. Action Handlers (Toggle Single User, Bulk Activate, Bulk Deactivate)
  const handleToggleSingleUser = (user) => {
    if (user.isAdmin) {
      showToast("Akun Administrator utama tidak dapat dinonaktifkan!");
      return;
    }

    const nextState = !user.isActive;
    setConfirmModal({
      isOpen: true,
      type: "single_toggle",
      targetUser: user,
      title: nextState ? "Aktifkan Akun Peserta?" : "Nonaktifkan Akun Peserta?",
      message: nextState
        ? `Apakah Anda yakin ingin mengaktifkan akun ${user.fullName || user.username || user.email}? Peserta akan dapat kembali masuk dan belajar di EduLingo.`
        : `Apakah Anda yakin ingin menonaktifkan akun ${user.fullName || user.username || user.email}? Peserta tidak akan dapat mengakses sesi belajar atau simulasi selama akun nonaktif.`,
      isDanger: !nextState,
      confirmAction: async () => {
        setActionLoading(true);
        try {
          const userRef = doc(db, "users", user.id);
          await updateDoc(userRef, {
            isActive: nextState,
            status: nextState ? "active" : "inactive",
            updatedAt: new Date(),
          });

          // Optimistic local update
          setUsersList((prev) =>
            prev.map((item) =>
              item.id === user.id
                ? {
                    ...item,
                    isActive: nextState,
                    status: nextState ? "active" : "inactive",
                  }
                : item
            )
          );

          showToast(
            `Berhasil ${nextState ? "mengaktifkan" : "menonaktifkan"} akun ${
              user.fullName || user.username
            }!`
          );
        } catch (err) {
          console.error("Gagal mengubah status akun:", err);
          showToast("Gagal memperbarui status akun di database.");
        } finally {
          setActionLoading(false);
          setConfirmModal({ isOpen: false });
        }
      },
    });
  };

  const handleBulkActivateAll = () => {
    const targetUsers = usersList.filter(
      (u) =>
        u.isActive === false || u.status === "inactive"
    );

    if (targetUsers.length === 0) {
      showToast("Semua peserta sudah dalam status aktif!");
      return;
    }

    setConfirmModal({
      isOpen: true,
      type: "bulk_activate",
      targetUser: null,
      title: "Aktifkan Seluruh Peserta?",
      message: `Tindakan ini akan mengaktifkan ${targetUsers.length} peserta yang saat ini nonaktif. Seluruh peserta akan dapat kembali mengakses EduLingo.`,
      isDanger: false,
      confirmAction: async () => {
        setActionLoading(true);
        try {
          const batch = writeBatch(db);
          targetUsers.forEach((u) => {
            const uRef = doc(db, "users", u.id);
            batch.update(uRef, {
              isActive: true,
              status: "active",
              updatedAt: new Date(),
            });
          });
          await batch.commit();

          setUsersList((prev) =>
            prev.map((u) => ({
              ...u,
              isActive: true,
              status: "active",
            }))
          );

          showToast(
            `Berhasil mengaktifkan ${targetUsers.length} peserta sekaligus!`
          );
        } catch (err) {
          console.error("Gagal mengaktifkan seluruh peserta:", err);
          showToast("Terjadi kesalahan saat aktivasi massal.");
        } finally {
          setActionLoading(false);
          setConfirmModal({ isOpen: false });
        }
      },
    });
  };

  const handleBulkDeactivateAll = () => {
    // Exclude admin account
    const targetUsers = usersList.filter(
      (u) =>
        u.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase() &&
        u.isActive !== false &&
        u.status !== "inactive"
    );

    if (targetUsers.length === 0) {
      showToast("Semua peserta sudah dalam status nonaktif!");
      return;
    }

    setConfirmModal({
      isOpen: true,
      type: "bulk_deactivate",
      targetUser: null,
      title: "Nonaktifkan Seluruh Peserta?",
      message: `Tindakan ini akan menonaktifkan ${targetUsers.length} peserta sekaligus (Akun Admin ${ADMIN_EMAIL} tetap aktif). Peserta tidak akan dapat login sampai diaktifkan kembali.`,
      isDanger: true,
      confirmAction: async () => {
        setActionLoading(true);
        try {
          const batch = writeBatch(db);
          targetUsers.forEach((u) => {
            const uRef = doc(db, "users", u.id);
            batch.update(uRef, {
              isActive: false,
              status: "inactive",
              updatedAt: new Date(),
            });
          });
          await batch.commit();

          setUsersList((prev) =>
            prev.map((u) => {
              if (u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
                return u;
              }
              return {
                ...u,
                isActive: false,
                status: "inactive",
              };
            })
          );

          showToast(
            `Berhasil menonaktifkan ${targetUsers.length} peserta sekaligus!`
          );
        } catch (err) {
          console.error("Gagal menonaktifkan seluruh peserta:", err);
          showToast("Terjadi kesalahan saat deaktivasi massal.");
        } finally {
          setActionLoading(false);
          setConfirmModal({ isOpen: false });
        }
      },
    });
  };

  // --------------------------------------------------------------------------
  // 6.5. EXPORT TO CSV: Rekap Nilai Simulasi TOEFL
  // --------------------------------------------------------------------------
  const handleExportSimulationCSV = (targetUsers = null) => {
    // Tentukan sumber data peserta yang akan diekspor:
    // 1. targetUsers (spesifik peserta jika dipanggil dari modal)
    // 2. filteredAndSortedUsers (jika admin sedang melakukan search / filter)
    // 3. processedUsers (seluruh peserta jika tidak ada filter)
    const sourceUsers = targetUsers || (
      (searchQuery || statusFilter !== "all")
        ? filteredAndSortedUsers
        : processedUsers
    );

    const rows = [];

    sourceUsers.forEach((user) => {
      const fullName = user.fullName || user.username || "Tanpa Nama";
      const email = user.email || "-";
      const username = user.username || "-";

      (user.simulations || []).forEach((session) => {
        rows.push({
          fullName,
          email,
          username,
          date: session.formattedDate,
          dateObj: session.dateObj,
          listeningScore: session.listening.score, // Skor Listening terkonversi (converted)
          structureScore: session.structure.score, // Skor Structure terkonversi (converted)
          readingScore: session.reading.score,     // Skor Reading terkonversi (converted)
          finalScore: session.score,               // Skor Akhir TOEFL
          status: session.isPassed ? "Lolos (>=450)" : "Perlu Peningkatan (<450)",
        });
      });
    });

    if (rows.length === 0) {
      showToast("Tidak ada data nilai simulasi yang dapat diekspor!");
      return;
    }

    // Urutkan riwayat ujian dari yang paling baru
    rows.sort((a, b) => (b.dateObj || 0) - (a.dateObj || 0));

    // Headers CSV sesuai permintaan
    const headers = [
      "No",
      "Full Name",
      "Email",
      "Username",
      "Tanggal Ujian",
      "Listening (Converted)",
      "Structure (Converted)",
      "Reading (Converted)",
      "Skor Akhir TOEFL",
      "Status Kelulusan",
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val);
      if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return `"${str}"`;
    };

    const csvLines = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row, idx) =>
        [
          idx + 1,
          row.fullName,
          row.email,
          row.username,
          row.date,
          row.listeningScore,
          row.structureScore,
          row.readingScore,
          row.finalScore,
          row.status,
        ]
          .map(escapeCsv)
          .join(",")
      ),
    ];

    // Tambahkan UTF-8 BOM (\uFEFF) agar Microsoft Excel membaca format dan karakter dengan sempurna
    const csvContent = "\uFEFF" + csvLines.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;

    link.setAttribute("href", url);
    link.setAttribute("download", `edulingo_nilai_simulasi_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Berhasil mengekspor ${rows.length} data nilai simulasi ke CSV!`);
  };

  // --------------------------------------------------------------------------
  // 6.6. GENERATE SERTIFIKAT TOEFL (ZIP & INDIVIDUAL PDF)
  // --------------------------------------------------------------------------
  const handleGenerateCertificatesZip = async (targetUsers = null) => {
    const sourceUsers = targetUsers || (
      (searchQuery || statusFilter !== "all")
        ? filteredAndSortedUsers
        : processedUsers
    );

    const eligibleUsers = sourceUsers.filter(
      (u) => (u.simulations || []).length > 0
    );

    if (eligibleUsers.length === 0) {
      showToast("Tidak ada peserta dengan riwayat simulasi untuk dibuatkan sertifikat!");
      return;
    }

    const certificatesData = eligibleUsers.map((user) => {
      // Ambil sesi ujian dengan skor tertinggi
      const bestSession = [...user.simulations].sort((a, b) => b.score - a.score)[0];
      return {
        fullName: user.fullName || user.username || "PESERTA",
        listeningScore: bestSession.listening.score, // Skor konversi
        structureScore: bestSession.structure.score, // Skor konversi
        readingScore: bestSession.reading.score,     // Skor konversi
        totalScore: bestSession.score,               // Total skor TOEFL
      };
    });

    try {
      setCertProgress({
        isGenerating: true,
        current: 0,
        total: certificatesData.length,
        statusText: "Menyiapkan template dan font sertifikat...",
      });

      const result = await generateAndDownloadCertificatesZip(
        certificatesData,
        (current, total, statusText) => {
          setCertProgress({
            isGenerating: true,
            current,
            total,
            statusText,
          });
        }
      );

      showToast(`Berhasil mengunduh file ${result.zipFileName} (${result.total} sertifikat)!`);
    } catch (error) {
      console.error("Gagal membuat sertifikat ZIP:", error);
      showToast("Terjadi kesalahan saat membuat file ZIP sertifikat.");
    } finally {
      setCertProgress({
        isGenerating: false,
        current: 0,
        total: 0,
        statusText: "",
      });
    }
  };

  const handleDownloadSingleCertificate = async (user, session = null) => {
    const sim =
      session ||
      (user.simulations && [...user.simulations].sort((a, b) => b.score - a.score)[0]);

    if (!sim) {
      showToast("Peserta ini belum memiliki nilai ujian simulasi!");
      return;
    }

    const fullName = user.fullName || user.username || "PESERTA";
    try {
      showToast(`Sedang membuat sertifikat PDF untuk ${fullName}...`);
      const pdf = await generateSingleCertificatePDF({
        fullName,
        listeningScore: sim.listening.score,
        structureScore: sim.structure.score,
        readingScore: sim.reading.score,
        totalScore: sim.score,
      });

      const safeName = fullName.replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 50);
      pdf.save(`Sertifikat_TOEFL_${safeName}_${sim.score}pts.pdf`);
      showToast(`Sertifikat ${fullName} berhasil diunduh!`);
    } catch (err) {
      console.error("Gagal mendownload sertifikat single:", err);
      showToast("Gagal membuat sertifikat PDF.");
    }
  };

  // 7. Security Check Rendering
  if (authLoading) {
    return (
      <div className={styles.container}>
        <div style={{ padding: "60px 0", textAlign: "center", fontWeight: "700" }}>
          Memverifikasi hak akses Administrator...
        </div>
      </div>
    );
  }

  const isAuthorizedAdmin =
    currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  if (!isAuthorizedAdmin) {
    return (
      <div className={styles.container}>
        <div className={styles.unauthorizedContainer}>
          <div className={styles.unauthorizedCard}>
            <div className={styles.unauthorizedIcon}>
              <FaShieldAlt />
            </div>
            <h1 className={styles.unauthorizedTitle}>Akses Ditolak</h1>
            <p className={styles.unauthorizedDesc}>
              Halaman ini khusus untuk Administrator dengan akun resmi{" "}
              <strong>{ADMIN_EMAIL}</strong>. Akun Anda (
              {currentUser?.email || "Pengguna"}) tidak memiliki izin untuk
              mengakses panel manajemen ini.
            </p>
            <Link href="/dashboard" className={styles.btnReturnDashboard}>
              <FaArrowLeft /> Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toast}>
          <FaCheckCircle color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <section className={styles.headerSection}>
        <div className={styles.headerLeft}>
          <div className={styles.titleRow}>
            <h1 className={styles.pageTitle}>Admin Panel</h1>
            <div className={styles.adminBadge}>
              <span className={styles.pulseDot}></span>
              <FaShieldAlt /> {ADMIN_EMAIL}
            </div>
          </div>
          <p className={styles.pageSubtitle}>
            Kelola akses peserta, pantau rekam jejak hasil ujian simulasi TOEFL,
            serta aktifkan atau nonaktifkan akun peserta secara individu maupun
            massal.
          </p>
        </div>

        <div className={styles.decorWrapper}>
          <div className={styles.decorBoxYellow}></div>
          <div className={styles.decorBoxRed}></div>
          <div className={styles.decorCircle}></div>
        </div>
      </section>

      {/* Platform Statistics Overview Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Total Peserta</span>
            <div className={styles.statIcon}>
              <FaUsers />
            </div>
          </div>
          <div className={styles.statValue}>{statsOverview.totalUsers}</div>
          <div className={styles.statDesc}>Akun terdaftar di EduLingo</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Peserta Aktif</span>
            <div className={styles.statIcon} style={{ color: "#16a34a" }}>
              <FaUserCheck />
            </div>
          </div>
          <div className={styles.statValue} style={{ color: "#16a34a" }}>
            {statsOverview.activeUsers}
          </div>
          <div className={styles.statDesc}>Dapat mengakses materi & ujian</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Peserta Nonaktif</span>
            <div className={styles.statIcon} style={{ color: "#dc2626" }}>
              <FaUserSlash />
            </div>
          </div>
          <div className={styles.statValue} style={{ color: "#dc2626" }}>
            {statsOverview.inactiveUsers}
          </div>
          <div className={styles.statDesc}>Akses dibekukan sementara</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Sesi Simulasi</span>
            <div className={styles.statIcon} style={{ color: "#ca8a04" }}>
              <FaHistory />
            </div>
          </div>
          <div className={styles.statValue}>
            {statsOverview.totalSimulations}
          </div>
          <div className={styles.statDesc}>Total pengerjaan ujian simulasi</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Rata-rata Skor</span>
            <div className={styles.statIcon} style={{ color: "#2563eb" }}>
              <FaTrophy />
            </div>
          </div>
          <div className={styles.statValue}>
            {statsOverview.averageToeflScore || "-"}
          </div>
          <div className={styles.statDesc}>Skor TOEFL rata-rata peserta</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Tingkat Lolos</span>
            <div className={styles.statIcon} style={{ color: "#9333ea" }}>
              <LuAward />
            </div>
          </div>
          <div className={styles.statValue}>
            {statsOverview.passPercentage}%
          </div>
          <div className={styles.statDesc}>Skor mencapai &ge; 450 poin</div>
        </div>
      </div>

      {/* Controls & Actions Toolbar */}
      <div className={styles.toolbarCard}>
        {/* Top Row: Search & Bulk Action Buttons */}
        <div className={styles.toolbarTopRow}>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, username, atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery("")}
                title="Hapus pencarian"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className={styles.bulkActionsGroup}>
            <button
              className={styles.btnBulkActivate}
              onClick={handleBulkActivateAll}
              disabled={actionLoading}
              title="Aktifkan seluruh peserta yang sedang nonaktif"
            >
              <FaUserCheck /> Aktifkan Semua
            </button>

            <button
              className={styles.btnBulkDeactivate}
              onClick={handleBulkDeactivateAll}
              disabled={actionLoading}
              title="Nonaktifkan semua akun peserta sekaligus"
            >
              <FaUserSlash /> Nonaktifkan Semua
            </button>

            <button
              className={styles.btnRefresh}
              onClick={() => fetchAllData(true)}
              disabled={isRefreshing || actionLoading}
              title="Perbarui data dari server"
            >
              <FaSyncAlt className={isRefreshing ? styles.spinning : ""} /> Refresh
            </button>

            <button
              className={styles.btnExportCsv}
              onClick={() => handleExportSimulationCSV()}
              disabled={isDataLoading || certProgress.isGenerating}
              title="Ekspor seluruh rekap nilai simulasi TOEFL peserta ke format CSV"
            >
              <FaFileCsv /> Export to CSV
            </button>

            <button
              className={styles.btnGenerateCert}
              onClick={() => handleGenerateCertificatesZip()}
              disabled={isDataLoading || certProgress.isGenerating}
              title="Generate seluruh sertifikat peserta ke dalam format PDF dan download langsung sebagai file ZIP"
            >
              <FaFileArchive /> Generate Sertifikat (ZIP)
            </button>
          </div>
        </div>

        {/* Bottom Row: Filter Badges & Sort Selector */}
        <div className={styles.toolbarBottomRow}>
          <div className={styles.filterPills}>
            <button
              className={`${styles.filterBtn} ${
                statusFilter === "all" ? styles.filterBtnActive : ""
              }`}
              onClick={() => setStatusFilter("all")}
            >
              Semua Peserta{" "}
              <span className={styles.pillBadge}>{processedUsers.length}</span>
            </button>

            <button
              className={`${styles.filterBtn} ${
                statusFilter === "active" ? styles.filterBtnActive : ""
              }`}
              onClick={() => setStatusFilter("active")}
            >
              Aktif{" "}
              <span className={styles.pillBadge}>
                {processedUsers.filter((u) => u.isActive).length}
              </span>
            </button>

            <button
              className={`${styles.filterBtn} ${
                statusFilter === "inactive" ? styles.filterBtnActive : ""
              }`}
              onClick={() => setStatusFilter("inactive")}
            >
              Nonaktif{" "}
              <span className={styles.pillBadge}>
                {processedUsers.filter((u) => !u.isActive).length}
              </span>
            </button>

            <button
              className={`${styles.filterBtn} ${
                statusFilter === "has_simulation" ? styles.filterBtnActive : ""
              }`}
              onClick={() => setStatusFilter("has_simulation")}
            >
              Pernah Simulasi{" "}
              <span className={styles.pillBadge}>
                {processedUsers.filter((u) => u.simulationCount > 0).length}
              </span>
            </button>

            <button
              className={`${styles.filterBtn} ${
                statusFilter === "no_simulation" ? styles.filterBtnActive : ""
              }`}
              onClick={() => setStatusFilter("no_simulation")}
            >
              Belum Simulasi{" "}
              <span className={styles.pillBadge}>
                {processedUsers.filter((u) => u.simulationCount === 0).length}
              </span>
            </button>
          </div>

          <div className={styles.sortGroup}>
            <span className={styles.sortLabel}>
              <FaSortAmountDown /> Urutkan:
            </span>
            <select
              className={styles.sortSelect}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="terbaru">Pendaftaran Terbaru</option>
              <option value="terlama">Pendaftaran Terlama</option>
              <option value="nama-asc">Nama (A - Z)</option>
              <option value="nama-desc">Nama (Z - A)</option>
              <option value="skor-tinggi">Skor TOEFL Tertinggi</option>
              <option value="simulasi-banyak">Jumlah Simulasi Terbanyak</option>
              <option value="aktif-dulu">Status: Aktif Terlebih Dahulu</option>
              <option value="nonaktif-dulu">Status: Nonaktif Terlebih Dahulu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Data Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeaderBar}>
          <div className={styles.tableHeaderTitle}>
            Daftar Peserta EduLingo
          </div>
          <div className={styles.tableHeaderRight}>
            <button
              className={styles.btnExportCsvSecondary}
              onClick={() => handleExportSimulationCSV()}
              disabled={isDataLoading || certProgress.isGenerating}
              title="Ekspor rekap nilai simulasi ke file CSV"
            >
              <FaFileCsv /> Export CSV
            </button>
            <button
              className={styles.btnExportCsvSecondary}
              onClick={() => handleGenerateCertificatesZip()}
              disabled={isDataLoading || certProgress.isGenerating}
              title="Generate seluruh sertifikat peserta ke ZIP"
            >
              <FaFileArchive /> Download ZIP Sertifikat
            </button>
            <div className={styles.resultCount}>
              Menampilkan <strong>{filteredAndSortedUsers.length}</strong> dari{" "}
              <strong>{processedUsers.length}</strong> peserta
            </div>
          </div>
        </div>

        <div className={styles.tableResponsive}>
          {isDataLoading ? (
            <div style={{ padding: "50px", textAlign: "center", fontWeight: "700" }}>
              Memuat data peserta dan riwayat ujian...
            </div>
          ) : filteredAndSortedUsers.length === 0 ? (
            <div className={styles.emptyState}>
              <FaUsers className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>Tidak ada peserta ditemukan</h3>
              <p className={styles.emptyDesc}>
                Tidak ada data peserta yang cocok dengan kriteria pencarian atau
                filter yang dipilih saat ini.
              </p>
              {(searchQuery || statusFilter !== "all") && (
                <button
                  className={styles.btnResetFilters}
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                >
                  Reset Pencarian & Filter
                </button>
              )}
            </div>
          ) : (
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>No</th>
                  <th>Informasi Peserta</th>
                  <th>Status Akun</th>
                  <th>Total Simulasi</th>
                  <th>Skor Terbaik</th>
                  <th>Rata-rata Skor</th>
                  <th style={{ textAlign: "center" }}>Aksi Manajemen</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedUsers.map((user, index) => {
                  const initials = (user.fullName || user.username || "U")
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr
                      key={user.id}
                      className={!user.isActive ? styles.inactiveRow : ""}
                    >
                      <td style={{ fontWeight: "800", color: "#6b635b" }}>
                        {index + 1}
                      </td>

                      {/* User Cell */}
                      <td>
                        <div className={styles.userCell}>
                          <div className={styles.userAvatar}>
                            {user.photoBase64 ? (
                              <img
                                src={user.photoBase64}
                                alt={user.fullName || "User"}
                                className={styles.userAvatarImg}
                              />
                            ) : (
                              initials
                            )}
                          </div>
                          <div className={styles.userMeta}>
                            <div className={styles.userNameRow}>
                              <span className={styles.userName}>
                                {user.fullName || user.username || "Tanpa Nama"}
                              </span>
                              {user.isAdmin && (
                                <span className={styles.adminTag}>Admin</span>
                              )}
                            </div>
                            <span className={styles.userEmail}>
                              {user.email || "-"} • @{user.username || "user"}
                            </span>
                            <span className={styles.userJoined}>
                              Bergabung: {user.formattedCreatedDate}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        {user.isActive ? (
                          <span className={styles.statusBadgeActive}>
                            <span className={styles.statusDot}></span> Aktif
                          </span>
                        ) : (
                          <span className={styles.statusBadgeInactive}>
                            <span className={styles.statusDot}></span> Nonaktif
                          </span>
                        )}
                      </td>

                      {/* Total Simulation Count */}
                      <td>
                        <div style={{ fontWeight: "800" }}>
                          {user.simulationCount > 0 ? (
                            <span style={{ color: "#1d1b18" }}>
                              {user.simulationCount} Sesi Ujian
                            </span>
                          ) : (
                            <span className={styles.noScore}>Belum pernah</span>
                          )}
                        </div>
                      </td>

                      {/* Best Score */}
                      <td>
                        {user.highestScore !== null ? (
                          <span
                            className={`${styles.scorePill} ${
                              user.highestScore >= 550
                                ? styles.scoreHigh
                                : user.highestScore >= 450
                                ? styles.scorePass
                                : ""
                            }`}
                          >
                            <FaTrophy
                              color={
                                user.highestScore >= 450 ? "#ca8a04" : "#6b635b"
                              }
                            />
                            {user.highestScore} Poin
                          </span>
                        ) : (
                          <span className={styles.noScore}>-</span>
                        )}
                      </td>

                      {/* Average Score */}
                      <td>
                        {user.averageScore !== null ? (
                          <span className={styles.scorePill}>
                            {user.averageScore} Poin
                          </span>
                        ) : (
                          <span className={styles.noScore}>-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td>
                        <div
                          className={styles.actionButtonGroup}
                          style={{ justifyContent: "center" }}
                        >
                          <button
                            className={styles.btnViewHistory}
                            onClick={() => {
                              setSelectedUserForHistory(user);
                              setActiveHistoryTab("simulation");
                            }}
                            title="Lihat riwayat ujian dan latihan user ini"
                          >
                            <FaHistory /> Riwayat
                          </button>

                          {user.simulationCount > 0 && (
                            <button
                              className={styles.btnSingleCert}
                              onClick={() => handleDownloadSingleCertificate(user)}
                              disabled={certProgress.isGenerating}
                              title="Download Sertifikat PDF (Nilai Terbaik)"
                            >
                              <LuAward /> Sertifikat
                            </button>
                          )}

                          {user.isAdmin ? (
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: "800",
                                color: "#8c827a",
                                padding: "6px 10px",
                              }}
                            >
                              Admin Utama
                            </span>
                          ) : (
                            <button
                              className={`${styles.btnToggleStatus} ${
                                user.isActive
                                  ? styles.btnToggleDeactivate
                                  : styles.btnToggleActivate
                              }`}
                              onClick={() => handleToggleSingleUser(user)}
                              disabled={actionLoading}
                              title={
                                user.isActive
                                  ? "Nonaktifkan akun peserta ini"
                                  : "Aktifkan kembali akun peserta ini"
                              }
                            >
                              {user.isActive ? (
                                <>
                                  <FaUserSlash /> Nonaktifkan
                                </>
                              ) : (
                                <>
                                  <FaUserCheck /> Aktifkan
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ====================================================================
          MODAL: USER SIMULATION & PRACTICE HISTORY
          ==================================================================== */}
      {selectedUserForHistory && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setSelectedUserForHistory(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleWrapper}>
                <FaHistory size={20} color="#fdba49" />
                <h2 className={styles.modalTitle}>
                  Detail Rekam Jejak Simulasi & Latihan
                </h2>
              </div>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setSelectedUserForHistory(null)}
              >
                <FaTimes />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* User Identity Card */}
              <div className={styles.modalUserCard}>
                <div className={styles.modalUserLeft}>
                  <div className={styles.modalUserAvatar}>
                    {selectedUserForHistory.photoBase64 ? (
                      <img
                        src={selectedUserForHistory.photoBase64}
                        alt={selectedUserForHistory.fullName || "User"}
                        className={styles.userAvatarImg}
                      />
                    ) : (
                      (selectedUserForHistory.fullName || "U")
                        .charAt(0)
                        .toUpperCase()
                    )}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <h3 style={{ fontSize: "18px", fontWeight: "900", margin: 0 }}>
                        {selectedUserForHistory.fullName ||
                          selectedUserForHistory.username ||
                          "Tanpa Nama"}
                      </h3>
                      {selectedUserForHistory.isActive ? (
                        <span className={styles.statusBadgeActive}>Aktif</span>
                      ) : (
                        <span className={styles.statusBadgeInactive}>
                          Nonaktif
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#58423b",
                        margin: "4px 0 0 0",
                        fontWeight: "600",
                      }}
                    >
                      {selectedUserForHistory.email} • @
                      {selectedUserForHistory.username || "user"}
                    </p>
                  </div>
                </div>

                <div className={styles.modalUserStats}>
                  <div className={styles.modalMiniStat}>
                    <div className={styles.modalMiniStatLabel}>Total Simulasi</div>
                    <div className={styles.modalMiniStatValue}>
                      {selectedUserForHistory.simulationCount}
                    </div>
                  </div>
                  <div className={styles.modalMiniStat}>
                    <div className={styles.modalMiniStatLabel}>Skor Tertinggi</div>
                    <div
                      className={styles.modalMiniStatValue}
                      style={{ color: "#c5502a" }}
                    >
                      {selectedUserForHistory.highestScore || "-"}
                    </div>
                  </div>
                  <div className={styles.modalMiniStat}>
                    <div className={styles.modalMiniStatLabel}>Rata-rata Skor</div>
                    <div className={styles.modalMiniStatValue}>
                      {selectedUserForHistory.averageScore || "-"}
                    </div>
                  </div>
                  <div className={styles.modalMiniStat}>
                    <div className={styles.modalMiniStatLabel}>Total Latihan</div>
                    <div className={styles.modalMiniStatValue}>
                      {selectedUserForHistory.practiceCount}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs in Modal */}
              <div className={styles.modalTabs}>
                <button
                  className={`${styles.modalTabBtn} ${
                    activeHistoryTab === "simulation"
                      ? styles.modalTabBtnActive
                      : ""
                  }`}
                  onClick={() => setActiveHistoryTab("simulation")}
                >
                  <FaTrophy /> Riwayat Simulasi TOEFL (
                  {selectedUserForHistory.simulations.length})
                </button>
                <button
                  className={`${styles.modalTabBtn} ${
                    activeHistoryTab === "practice"
                      ? styles.modalTabBtnActive
                      : ""
                  }`}
                  onClick={() => setActiveHistoryTab("practice")}
                >
                  <FaBookOpen /> Latihan Mandiri (
                  {selectedUserForHistory.practices.length})
                </button>
              </div>

              {/* Simulation Sessions List */}
              {activeHistoryTab === "simulation" && (
                <div className={styles.simulationList}>
                  {selectedUserForHistory.simulations.length > 0 && (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginBottom: "12px" }}>
                      <button
                        className={styles.btnExportCsvSecondary}
                        onClick={() => handleExportSimulationCSV([selectedUserForHistory])}
                        title="Ekspor rekap simulasi peserta ini ke CSV"
                      >
                        <FaFileCsv /> Export CSV
                      </button>
                      <button
                        className={styles.btnExportCsvSecondary}
                        onClick={() => handleGenerateCertificatesZip([selectedUserForHistory])}
                        title="Download ZIP sertifikat untuk peserta ini"
                      >
                        <FaFileArchive /> Download Sertifikat (ZIP)
                      </button>
                    </div>
                  )}

                  {selectedUserForHistory.simulations.length === 0 ? (
                    <div className={styles.emptyState}>
                      <FaTrophy className={styles.emptyIcon} />
                      <h4 className={styles.emptyTitle}>
                        Belum Ada Riwayat Simulasi
                      </h4>
                      <p className={styles.emptyDesc}>
                        Peserta ini belum pernah menyelesaikan ujian simulasi
                        TOEFL Prediction Test.
                      </p>
                    </div>
                  ) : (
                    selectedUserForHistory.simulations.map((session, sIdx) => (
                      <div key={session.id || sIdx} className={styles.sessionCard}>
                        <div className={styles.sessionCardHeader}>
                          <div>
                            <div className={styles.sessionActivity}>
                              {session.activity}
                            </div>
                            <div className={styles.sessionDate}>
                              <LuClock style={{ verticalAlign: "middle", marginRight: "4px" }} />
                              {session.formattedDate} • Durasi pengerjaan:{" "}
                              {Math.round((session.totalTime || 0) / 60)} menit
                            </div>
                          </div>

                          <div className={styles.sessionScoreBadge}>
                            <div>
                              {session.isPassed ? (
                                <span className={styles.statusBadgeActive}>
                                  <FaCheckCircle /> Lolos (&ge;450)
                                </span>
                              ) : (
                                <span className={styles.statusBadgeInactive}>
                                  <FaTimesCircle /> Perlu Peningkatan (&lt;450)
                                </span>
                              )}
                            </div>
                            <div className={styles.scoreTotalDisplay}>
                              {session.score} <span style={{ fontSize: "13px", color: "#f8f6f2" }}>/ 677</span>
                            </div>
                          </div>
                        </div>

                        {/* Section Breakdown 3 Boxes */}
                        <div className={styles.sectionBreakdownGrid}>
                          <div className={styles.sectionBox}>
                            <div className={styles.sectionName}>
                              Section 1: Listening
                            </div>
                            <div className={styles.sectionScoreMain}>
                              {session.listening.score}{" "}
                              <span style={{ fontSize: "12px", color: "#6b635b" }}>
                                ({session.listening.pct}%)
                              </span>
                            </div>
                            <div className={styles.sectionDetails}>
                              <span>
                                Benar: {session.listening.correct} /{" "}
                                {session.listening.total}
                              </span>
                              <span>
                                {Math.round(session.listening.time / 60)} mnt
                              </span>
                            </div>
                          </div>

                          <div className={styles.sectionBox}>
                            <div className={styles.sectionName}>
                              Section 2: Structure
                            </div>
                            <div className={styles.sectionScoreMain}>
                              {session.structure.score}{" "}
                              <span style={{ fontSize: "12px", color: "#6b635b" }}>
                                ({session.structure.pct}%)
                              </span>
                            </div>
                            <div className={styles.sectionDetails}>
                              <span>
                                Benar: {session.structure.correct} /{" "}
                                {session.structure.total}
                              </span>
                              <span>
                                {Math.round(session.structure.time / 60)} mnt
                              </span>
                            </div>
                          </div>

                          <div className={styles.sectionBox}>
                            <div className={styles.sectionName}>
                              Section 3: Reading
                            </div>
                            <div className={styles.sectionScoreMain}>
                              {session.reading.score}{" "}
                              <span style={{ fontSize: "12px", color: "#6b635b" }}>
                                ({session.reading.pct}%)
                              </span>
                            </div>
                            <div className={styles.sectionDetails}>
                              <span>
                                Benar: {session.reading.correct} /{" "}
                                {session.reading.total}
                              </span>
                              <span>
                                {Math.round(session.reading.time / 60)} mnt
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Download button for this specific session */}
                        <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
                          <button
                            className={styles.btnSingleCert}
                            onClick={() =>
                              handleDownloadSingleCertificate(
                                selectedUserForHistory,
                                session
                              )
                            }
                            title="Download Sertifikat PDF untuk sesi simulasi ini"
                          >
                            <LuAward /> Download Sertifikat Sesi Ini (PDF)
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Practice History List */}
              {activeHistoryTab === "practice" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {selectedUserForHistory.practices.length === 0 ? (
                    <div className={styles.emptyState}>
                      <FaBookOpen className={styles.emptyIcon} />
                      <h4 className={styles.emptyTitle}>
                        Belum Ada Riwayat Latihan
                      </h4>
                      <p className={styles.emptyDesc}>
                        Peserta ini belum pernah mengerjakan latihan soal mandiri.
                      </p>
                    </div>
                  ) : (
                    selectedUserForHistory.practices.map((p, pIdx) => (
                      <div key={p.id || pIdx} className={styles.practiceItem}>
                        <div>
                          <div className={styles.practiceTitle}>
                            Modul: {p.moduleId.replace("_", " ")}
                          </div>
                          <div className={styles.practiceDate}>
                            Dikerjakan pada: {p.formattedDate}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span
                            className={
                              p.isPassed
                                ? styles.statusBadgeActive
                                : styles.statusBadgeInactive
                            }
                          >
                            {p.isPassed ? "Tuntas" : "Belum Tuntas"}
                          </span>
                          <span
                            className={styles.scorePill}
                            style={{ fontWeight: "900" }}
                          >
                            Skor: {p.score}%
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: ACTION CONFIRMATION (Single Toggle & Bulk Actions)
          ==================================================================== */}
      {confirmModal.isOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => !actionLoading && setConfirmModal({ isOpen: false })}
        >
          <div
            className={styles.confirmModal}
            onClick={(e) => e.stopPropagation()}
          >
            {confirmModal.isDanger ? (
              <FaExclamationTriangle className={styles.confirmIconWarn} />
            ) : (
              <FaCheckCircle className={styles.confirmIconSuccess} />
            )}

            <h3 className={styles.confirmTitle}>{confirmModal.title}</h3>
            <p className={styles.confirmMessage}>{confirmModal.message}</p>

            <div className={styles.confirmActions}>
              <button
                className={styles.btnCancel}
                onClick={() => setConfirmModal({ isOpen: false })}
                disabled={actionLoading}
              >
                Batal
              </button>
              <button
                className={
                  confirmModal.isDanger
                    ? styles.btnConfirmDanger
                    : styles.btnConfirmSuccess
                }
                onClick={confirmModal.confirmAction}
                disabled={actionLoading}
              >
                {actionLoading ? "Memproses..." : "Ya, Lanjutkan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: CERTIFICATE GENERATION PROGRESS OVERLAY
          ==================================================================== */}
      {certProgress.isGenerating && (
        <div className={styles.modalBackdrop} style={{ zIndex: 9999 }}>
          <div className={styles.progressModalCard}>
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "50%",
                background: "#f3eee8",
                border: "3px solid #1d1b18",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#254083",
                fontSize: "24px",
              }}
            >
              <LuAward />
            </div>
            <h3 style={{ margin: 0, fontWeight: "900", color: "#1d1b18", fontSize: "18px" }}>
              Memproses Sertifikat TOEFL
            </h3>
            <p style={{ margin: 0, fontSize: "14px", color: "#58423b", fontWeight: "600" }}>
              {certProgress.statusText}
            </p>
            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBarFill}
                style={{
                  width: `${
                    certProgress.total > 0
                      ? Math.round((certProgress.current / certProgress.total) * 100)
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <div style={{ fontSize: "13px", fontWeight: "800", color: "#254083" }}>
              {certProgress.total > 0
                ? `${certProgress.current} dari ${certProgress.total} (${Math.round(
                    (certProgress.current / certProgress.total) * 100
                  )}%)`
                : "Mohon tunggu..."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
