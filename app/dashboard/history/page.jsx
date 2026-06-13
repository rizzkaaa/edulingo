"use client";

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

const historyData = [
  {
    date:"Oct 24, 2023, 14:20",
    category:"Simulation",
    activity:"TOEFL Prediction Test #4",
    score:"540",
    status:"Success",
    success:true
  },
  {
    date:"Oct 23, 2023, 09:15",
    category:"Exercise",
    activity:"Conditional Sentences - Level 2",
    score:"85",
    status:"Success",
    success:true
  },
  {
    date:"Oct 22, 2023, 19:45",
    category:"Exercise",
    activity:"Reading Comprehension Quick Test",
    score:"62",
    status:"Failed",
    success:false
  }
];

export default function HistoryPage(){

  return(

    <div className={styles.container}>

      <div className={styles.heroSection}>

        <div className={styles.heroLeft}>

          <h1>
            Learning History & Scores
          </h1>

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

          <FaSearch/>

          <input
            type="text"
            placeholder="Search activities or materials..."
          />

        </div>

        <button className={styles.filterBtn}>

          <FaFilter/>

          All Categories

        </button>

      </div>

      <div className={styles.statsGrid}>

        <div className={styles.totalCard}>

          <p>
            TOTAL SESSIONS :
          </p>

          <h1>
            42
          </h1>

        </div>

        <div className={styles.averageCard}>

          <p>
            AVERAGE SCORE :
          </p>

          <h1>
            88
          </h1>

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

        {
          historyData.map((item,index)=>(

            <div
              key={index}
              className={styles.tableRow}
            >

              <span>
                {item.date}
              </span>

              <div>

                <div className={
                  item.category === "Simulation"
                  ? styles.simulationBadge
                  : styles.exerciseBadge
                }>
                  {item.category}
                </div>

              </div>

              <h3>
                {item.activity}
              </h3>

              <h2>
                {item.score}
              </h2>

              <div className={
                item.success
                ? styles.successText
                : styles.failedText
              }>

                {
                  item.success
                  ? <FaCheckCircle/>
                  : <FaTimesCircle/>
                }

                {item.status}

              </div>

            </div>

          ))
        }

        <div className={styles.paginationSection}>

          <p>
            Showing 3 of 42 activities
          </p>

          <div className={styles.pagination}>

            <button>
              <FaChevronLeft/>
            </button>

            <button className={styles.activePage}>
              1
            </button>

            <button>
              2
            </button>

            <button>
              <FaChevronRight/>
            </button>

          </div>

        </div>

      </div>

      <div className={styles.challengeBox}>

        <div className={styles.challengeIcon}>
          <FaTrophy/>
        </div>

        <div>

          <h2>
            New Challenge
          </h2>

          <p>
            Complete 3 more simulations for the ‘Master Reader’ badge.
          </p>

        </div>

      </div>

      <div className={styles.bottomCircle}></div>

    </div>

  );

}