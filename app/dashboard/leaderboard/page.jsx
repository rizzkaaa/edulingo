"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

import {
  FaBolt,
  FaArrowTrendUp,
  FaMedal
} from "react-icons/fa6";

const defaultTopThree = [
  { rank: 2, name: "Budi Santoso", Point: "2,840 Point", photo: "/images/default_profile.png" },
  { rank: 1, name: "Siti Aminah", Point: "3,120 Point", photo: "/images/default_profile.png" },
  { rank: 3, name: "Rian Wijaya", Point: "2,450 Point", photo: "/images/default_profile.png" }
];

const defaultLeaderboard = [
  { rank: 4, name: "Aulia Putri", title: "LANGUAGE MASTER", Point: "2,100", photo: "/images/default_profile.png" },
  { rank: 5, name: "Dedi Kusuma", title: "GRAMMAR EXPERT", Point: "1,950", photo: "/images/default_profile.png" },
  { rank: 6, name: "Raka Pratama", title: "VOCAB KING", Point: "1,820", photo: "/images/default_profile.png" }
];

function calculateToeflScore(data) {
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
  const totalTime = (data.reading_time_spent || 0) + (data.structure_time_spent || 0) + (data.listening_time_spent || 0);

  return { finalScore, totalTime };
}

export default function LeaderboardPage(){
  const [topThree, setTopThree] = useState(defaultTopThree);
  const [leaderboard, setLeaderboard] = useState(defaultLeaderboard);

  const [currentUserRank, setCurrentUserRank] = useState("-");
  const [currentUserData, setCurrentUserData] = useState({
    displayName: "You",
    initials: "?",
    title: "BELUM ADA SESI",
    point: "0",
    trendText: "STABLE", 
    trendIcon: false
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        const sessionsSnap = await getDocs(collection(db, "exam_sessions"));
        const bestPerUser = {};

        sessionsSnap.forEach((docSnap) => {
          const data = docSnap.data();
          const userId = data.userId;
          if (!userId) return;

          const { finalScore, totalTime } = calculateToeflScore(data);
          const current = bestPerUser[userId];

          if (
            !current ||
            finalScore > current.score ||
            (finalScore === current.score && totalTime < current.time)
          ) {
            bestPerUser[userId] = { score: finalScore, time: totalTime };
          }
        });

        const userIds = Object.keys(bestPerUser);
        if (userIds.length === 0) return;

        const userDataList = await Promise.all(
          userIds.map(async (uid) => {
            try {
              const userRef = doc(db, "users", uid);
              const userSnap = await getDoc(userRef);
              const userInfo = userSnap.exists() ? userSnap.data() : {};

              return {
                userId: uid,
                name: userInfo.fullName || userInfo.username || "User",
                title: userInfo.username ? `@${userInfo.username}` : "LEARNER",
                photo: userInfo.photoBase64 || "/images/default_profile.png",
                initials: (userInfo.fullName || "U N").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
                score: bestPerUser[uid].score,
                time: bestPerUser[uid].time,
              };
            } catch (err) {
              return null;
            }
          })
        );

        const sorted = userDataList
          .filter(Boolean)
          .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.time - b.time;
          })
          .map((u, index) => ({ ...u, rank: index + 1 }));

        const newTopThree = sorted.slice(0, 3).map((u) => ({
          rank: u.rank,
          name: u.name,
          Point: `${u.score} Point`,
          photo: u.photo,
        }));

        const newLeaderboard = sorted.slice(3).map((u) => ({
          rank: u.rank,
          name: u.name,
          title: u.title,
          Point: `${u.score}`,
          photo: u.photo,
        }));

        setTopThree(newTopThree);
        setLeaderboard(newLeaderboard);

        if (user) {
          const myIndex = sorted.findIndex((u) => u.userId === user.uid);
          if (myIndex !== -1) {
            const myEntry = sorted[myIndex];
            setCurrentUserRank(myEntry.rank);

            // 🌟 FUNGSIONALITAS DYNAMIC RANK TREND: Ambil riwayat sesi pengerjaan user ini
            const mySessions = [];
            sessionsSnap.forEach((docSnap) => {
              const d = docSnap.data();
              if (d.userId === user.uid) {
                const timeSeconds = d.createdAt?.seconds || 0;
                mySessions.push({ ...d, timeSeconds });
              }
            });

            // Urutkan berdasarkan waktu pengerjaan tertua ke terbaru
            mySessions.sort((a, b) => a.timeSeconds - b.timeSeconds);

            let trendText = "STABLE";
            let trendIcon = false;

            if (mySessions.length > 1) {
              // Cari skor tertinggi sebelum sesi paling terakhir dimasukkan
              const previousSessions = mySessions.slice(0, mySessions.length - 1);
              let prevBestScore = 0;
              let prevBestTime = Infinity;

              previousSessions.forEach(s => {
                const { finalScore, totalTime } = calculateToeflScore(s);
                if (finalScore > prevBestScore || (finalScore === prevBestScore && totalTime < prevBestTime)) {
                  prevBestScore = finalScore;
                  prevBestTime = totalTime;
                }
              });

              // Estimasi peringkat hipotesis sebelum update sesi terbaru
              const hypotheticalList = sorted.map(u => {
                if (u.userId === user.uid) {
                  return { ...u, score: prevBestScore, time: prevBestTime };
                }
                return u;
              }).sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return a.time - b.time;
              });

              const prevRank = hypotheticalList.findIndex(u => u.userId === user.uid) + 1;
              const rankDiff = prevRank - myEntry.rank;

              if (rankDiff > 0) {
                trendText = `UP ${rankDiff} RANK${rankDiff > 1 ? 'S' : ''}`;
                trendIcon = true;
              } else if (rankDiff < 0) {
                trendText = `DOWN ${Math.abs(rankDiff)} RANK`;
                trendIcon = false;
              } else if (myIndex > 0) {
                const targetAbove = sorted[myIndex - 1];
                
                // 🌟 JIKA POIN SAMA TAPI KALAH WAKTU
                if (targetAbove.score === myEntry.score) {
                  trendText = "BEAT TIME TO RANK UP";
                  trendIcon = true;
                } else {
                  trendText = `${targetAbove.score - myEntry.score} PTS TO RANK UP`;
                  trendIcon = true;
                }
              } else {
                trendText = "TOP RANK 👑";
                trendIcon = false;
              }
            } else {
              if (myIndex > 0) {
                const targetAbove = sorted[myIndex - 1];
                trendText = `${targetAbove.score - myEntry.score} PTS TO RANK UP`;
                trendIcon = true;
              } else {
                trendText = "TOP RANK 👑";
              }
            }

            setCurrentUserData({
              displayName: `You (${myEntry.name})`,
              initials: myEntry.initials,
              title: myEntry.title,
              point: `${myEntry.score}`,
              trendText: trendText,
              trendIcon: trendIcon
            });
          }
        }
      } catch (error) {
        console.error("Gagal memuat data leaderboard:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  const podiumOrder = [topThree[1], topThree[0], topThree[2]].filter(Boolean);

  return(
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>LEADERBOARD</h1>
        <div className={styles.PointBox}>
          <FaBolt/>
          {currentUserData.point} Point
        </div>
      </div>

      <div className={styles.fullLine}></div>

      <section className={styles.topThreeSection}>
        <div className={styles.floatingSquare1}></div>
        <div className={styles.floatingSquare2}></div>
        <div className={styles.floatingCircle}></div>

        <div className={styles.topThreeWrapper}>
          {podiumOrder.map((user, index) => (
            <div
              key={index}
              className={user.rank === 1 ? styles.firstPlace : styles.otherPlace}
            >
              {user.rank === 1 && (
                <div className={styles.medalIcon}>
                  <FaMedal />
                </div>
              )}
              <div className={styles.avatarBox}>
                <img src={user.photo || "/images/default_profile.png"} alt={user.name} />
                <div className={user.rank === 1 ? styles.goldRank : styles.rankBadge}>
                  {user.rank}
                </div>
              </div>
              <h2>{user.name}</h2>
              <p>{user.Point}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.listSection}>
        {leaderboard.map((user,index)=>(
          <div key={index} className={styles.userCard}>
            <div className={styles.leftSide}>
              <h2>{user.rank}</h2>
              <img src={user.photo || "/images/default_profile.png"} alt={user.name} />
              <div>
                <h3>{user.name}</h3>
                <p>{user.title}</p>
              </div>
            </div>
            <div className={styles.rightSide}>
              <h1>{user.Point}</h1>
              <span>Point</span>
            </div>
          </div>
        ))}
      </section>

      {/* ===== BOTTOM BAR DYNAMIC ===== */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomLeft}>
          <h1>{currentUserRank}</h1>
          <div className={styles.youAvatar}>
            {currentUserData.initials}
          </div>
          <div>
            <h2>{currentUserData.displayName}</h2>
            <p>{currentUserData.title}</p>
          </div>
        </div>

        <div className={styles.bottomRight}>
          <div>
            <h1>{currentUserData.point}</h1>
            <span>Point</span>
          </div>
          <div className={styles.rankUp}>
            <p>{currentUserData.trendText}</p>
            {currentUserData.trendIcon && <FaArrowTrendUp/>}
          </div>
        </div>
      </div>
    </div>
  );
}