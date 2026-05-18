import styles from "./page.module.css";
import * as FaIcons from "react-icons/fa";

export default function DashboardPage() {

  const today = new Date();

  const hari = [
    "MINGGU",
    "SENIN",
    "SELASA",
    "RABU",
    "KAMIS",
    "JUMAT",
    "SABTU"
  ];

  const bulan = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MEI",
    "JUN",
    "JUL",
    "AGU",
    "SEP",
    "OKT",
    "NOV",
    "DES"
  ];

  const tanggalText =
    `${hari[today.getDay()]}, ${today.getDate()} ${bulan[today.getMonth()]}`;

  return (

    <div className={styles.container}>

      <div className={styles.topbar}>

        <h1>
          SELAMAT DATANG, EVAN 👋
        </h1>

        <div className={styles.dateBox}>
          📅 {tanggalText}
        </div>

      </div>

      <div className={styles.heroSection}>

        <div className={styles.heroLeft}>

          <p className={styles.label}>
            KURSUS BERLANGSUNG
          </p>

          <h2>
            Structure Part 1 —
            <br />
            Singular & Plural Nouns
          </h2>

          <div className={styles.wave}></div>

          <div className={styles.progressTop}>

            <span>
              Progres Belajar
            </span>

            <span>
              64%
            </span>

          </div>

          <div className={styles.progressBar}>

            <div className={styles.progressFill}></div>

          </div>

          <button className={styles.continueBtn}>
            LANJUTKAN →
          </button>

        </div>

        <div className={styles.heroRight}>

          <div className={styles.badge}>
            64%
          </div>

          <img
            src="/images/book.png"
            alt="Book"
          />

        </div>

      </div>

      <div className={styles.sectionTitle}>
        MATERI SAYA ✨
      </div>

      <div className={styles.lessonList}>

        <div className={styles.lessonDone}>

          <div>

            <h3>
              01 Structure Part 1
            </h3>

            <p>
              Completed
            </p>

          </div>

          <span className={styles.doneIcon}>
            <FaIcons.FaCheck />
          </span>

        </div>

        <div className={styles.lessonProgress}>

          <div>

            <h3>
              02 Structure Part 2
            </h3>

            <p>
              In Progress
            </p>

          </div>

          <span className={styles.progressIcon}>
            <FaIcons.FaPlayCircle />
          </span>

        </div>

        <div className={styles.lessonLocked}>

          <div>

            <h3>
              03 Reading Strategies
            </h3>

          </div>

          <div className={styles.lockedBadge}>

            <FaIcons.FaLock />

            LOCKED

          </div>

        </div>

        <div className={styles.lessonLocked}>

          <div>

            <h3>
              04 Reading for Details
            </h3>

          </div>

          <div className={styles.lockedBadge}>

            <FaIcons.FaLock />

            LOCKED

          </div>

        </div>

        <div className={styles.lessonLocked}>

          <div>

            <h3>
              05 Listening Comprehension
            </h3>

          </div>

          <div className={styles.lockedBadge}>

            <FaIcons.FaLock />

            LOCKED

          </div>

        </div>

      </div>

      <div className={styles.bottomBanner}>

        <div>

          <h2>
            SIAP UJIAN SIMULASI?
          </h2>

          <p>
            Selesaikan 5 materi untuk membuka 100 soal
          </p>

        </div>

        <div className={styles.lockButton}>

          <FaIcons.FaLock />

          TERKUNCI

        </div>

      </div>

    </div>

  );
}