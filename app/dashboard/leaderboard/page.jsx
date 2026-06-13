"use client";

import styles from "./page.module.css";

import {
  FaBolt,
  FaArrowTrendUp,
  FaMedal
} from "react-icons/fa6";

const topThree = [
  {
    rank:2,
    name:"Budi Santoso",
    Point:"2,840 Point"
  },
  {
    rank:1,
    name:"Siti Aminah",
    Point:"3,120 Point"
  },
  {
    rank:3,
    name:"Rian Wijaya",
    Point:"2,450 Point"
  }
];

const leaderboard = [
  {
    rank:4,
    name:"Aulia Putri",
    title:"LANGUAGE MASTER",
    Point:"2,100"
  },
  {
    rank:5,
    name:"Dedi Kusuma",
    title:"GRAMMAR EPointERT",
    Point:"1,950"
  },
  {
    rank:6,
    name:"Raka Pratama",
    title:"VOCAB KING",
    Point:"1,820"
  }
];

export default function LeaderboardPage(){

  return(

    <div className={styles.container}>

      <div className={styles.header}>

        <h1>
          LEADERBOARD
        </h1>

        <div className={styles.PointBox}>

          <FaBolt/>

          1,240 Point

        </div>

      </div>

      <div className={styles.fullLine}></div>

      <section className={styles.topThreeSection}>

        <div className={styles.floatingSquare1}></div>
        <div className={styles.floatingSquare2}></div>
        <div className={styles.floatingCircle}></div>

        <div className={styles.topThreeWrapper}>

          {
            topThree.map((user,index)=>(

              <div
                key={index}
                className={
                  user.rank === 1
                  ? styles.firstPlace
                  : styles.otherPlace
                }
              >

                {
                  user.rank === 1 && (
                    <div className={styles.medalIcon}>
                      <FaMedal/>
                    </div>
                  )
                }

                <div className={styles.avatarBox}>

                  <img
                    src="/images/default_profile.png"
                    alt={user.name}
                  />

                  <div
                    className={
                      user.rank === 1
                      ? styles.goldRank
                      : styles.rankBadge
                    }
                  >
                    {user.rank}
                  </div>

                </div>

                <h2>
                  {user.name}
                </h2>

                <p>
                  {user.Point}
                </p>

              </div>

            ))
          }

        </div>

      </section>

      <section className={styles.listSection}>

        {
          leaderboard.map((user,index)=>(

            <div
              key={index}
              className={styles.userCard}
            >

              <div className={styles.leftSide}>

                <h2>
                  {user.rank}
                </h2>

                <img
                  src="/images/default_profile.png"
                  alt={user.name}
                />

                <div>

                  <h3>
                    {user.name}
                  </h3>

                  <p>
                    {user.title}
                  </p>

                </div>

              </div>

              <div className={styles.rightSide}>

                <h1>
                  {user.Point}
                </h1>

                <span>
                  Point
                </span>

              </div>

            </div>

          ))
        }

      </section>

      <div className={styles.bottomBar}>

        <div className={styles.bottomLeft}>

          <h1>
            12
          </h1>

          <div className={styles.youAvatar}>
            HV
          </div>

          <div>

            <h2>
              You (Hendra V.)
            </h2>

            <p>
              LEARNING WARRIOR
            </p>

          </div>

        </div>

        <div className={styles.bottomRight}>

          <div>

            <h1>
              1,240
            </h1>

            <span>
              Point
            </span>

          </div>

          <div className={styles.rankUp}>

            <p>
              UP 2 RANKS
            </p>

            <FaArrowTrendUp/>

          </div>

        </div>

      </div>

    </div>

  );

}