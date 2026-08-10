"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./PredictionRuleTemplate.module.css";
import { usePrediction } from "../PredictionContext";

export default function PredictionRuleTemplate({
  badgeCategory = "PREDICTION TOEFL",
  description = "Uji seluruh kemampuan bahasa Inggrismu dalam satu sesi lengkap mencakup Structure, Written Expression, Reading Strategies, Reading for Details, dan Listening Comprehension sesuai format TOEFL.",
  durationMinutes = "25 Menit",
  topicCount = "3 Sesi",
  subMaterialCount = "36 Sub-Materi",
  startHref = "/simulation/listening",
  buttonText = "MULAI PREDICTION →",
  materiTheme = "green",
  materiTitle = "LISTENING",
  materiDuration = "25 Menit",
  materiQuestionCount = "~36 Soal",
  materiItems = [],
}) {
  const [agreed, setAgreed] = useState(false);
  const { userName } = usePrediction();

  const rulesTerm = "PREDICTION";
  const rulesTitle = "Aturan PREDICTION";

  return (
    <>
      <section className={styles.heroSection}>
        <div className={styles.heroLeft}>
          <div className={styles.topBadges}>
            <div className={styles.orangeBadge}>{badgeCategory}</div>
            <div className={styles.whiteBadge}>100 SOAL</div>
            <div className={styles.whiteBadge}>80 MENIT</div>
          </div>

          <h1>{userName || "User"} </h1>

          <div className={styles.wave}></div>

          <p>{description}</p>

          <div className={styles.infoRow}>
            <div className={styles.infoBox}>📝 100 Soal</div>
            <div className={styles.infoBox}>⏱ {durationMinutes}</div>
            <div className={styles.infoBox}>📚 {topicCount}</div>
            <div className={styles.infoBox}>📝 {subMaterialCount}</div>
          </div>

          <button className={styles.formatBtn}>✦ TOEFL Format</button>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.smallCard}>
            <h1>3</h1>
            <p>SESI</p>
          </div>
          <div className={styles.middleCard}>
            <h1>28</h1>
            <p>SUB-MATERI</p>
          </div>
          <div className={styles.bigCard}>
            <h1>100</h1>
            <p>SOAL TOTAL</p>
          </div>
        </div>

        <div className={styles.sparkle1}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className={styles.sparkle2}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className={styles.sparkle3}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      <div className={styles.contentWrapper}>
        <div className={styles.leftColumn}>
          <div className={styles.rulesCard}>
            <div className={styles.rulesHeader}>
              <h2>⚠ {rulesTitle}</h2>
              <span className={styles.wajibBadge}>WAJIB DIBACA</span>
            </div>

            <div className={styles.ruleItem}>
              <span className={styles.ruleNumber}>01</span>
              <div>
                <h3>Waktu Terbatas per Sesi</h3>
                <p>
                  Timer berjalan otomatis saat Mulai ditekan. Sesi akan otomatis
                  submit jika waktu habis.
                </p>
              </div>
            </div>
            <div className={styles.divider}></div>

            <div className={styles.ruleItem}>
              <span className={styles.ruleNumber}>02</span>
              <div>
                <h3>Tidak Bisa Kembali ke Sesi Sebelumnya</h3>
                <p>
                  Setelah sesi disubmit, kamu tidak bisa kembali untuk mengubah
                  jawaban di sesi tersebut.
                </p>
              </div>
            </div>
            <div className={styles.divider}></div>

            <div className={styles.ruleItem}>
              <span className={styles.ruleNumber}>03</span>
              <div>
                <h3>Urutan Sesi Tetap</h3>
                <p>
                  Sesi dikerjakan berurutan (Listening → Structure → Reading)
                  dan tidak bisa dilewati.
                </p>
              </div>
            </div>
            <div className={styles.divider}></div>

            <div className={styles.ruleItem}>
              <span className={styles.ruleNumber}>04</span>
              <div>
                <h3>Semua Soal Wajib Dijawab</h3>
                <p>
                  Tombol submit hanya aktif setelah seluruh soal dalam sesi
                  terjawab.
                </p>
              </div>
            </div>
            <div className={styles.divider}></div>

            <div className={styles.ruleItem}>
              <span className={styles.ruleNumber}>05</span>
              <div>
                <h3>Bisa Ditandai untuk Ditinjau</h3>
                <p>
                  Gunakan tombol &quot;Mark for Review&quot; untuk menandai soal yang
                  ingin dicek ulang sebelum submit.
                </p>
              </div>
            </div>
            <div className={styles.divider}></div>

            <div className={styles.ruleItem}>
              <span className={styles.ruleNumber}>06</span>
              <div>
                <h3>Tanpa Referensi Eksternal</h3>
                <p>
                  Dilarang menggunakan kamus atau catatan apapun selama{" "}
                  {rulesTerm} berlangsung.
                </p>
              </div>
            </div>
            <div className={styles.divider}></div>

            <div className={styles.ruleItem}>
              <span className={styles.ruleNumber}>07</span>
              <div>
                <h3>Hasil Otomatis</h3>
                <p>
                  Skor dan pembahasan lengkap tersedia setelah seluruh sesi{" "}
                  {rulesTerm} selesai.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.beforeStartCard}>
            <h3>Sebelum Mulai:</h3>

            <label className={styles.checkLine}>
              <input type="checkbox" checked readOnly />
              <span>Punya waktu {durationMinutes} penuh tanpa gangguan.</span>
            </label>
            <div className={styles.divider}></div>

            <label className={styles.checkLine}>
              <input type="checkbox" checked readOnly />
              <span>Koneksi internet stabil dan perangkat siap digunakan.</span>
            </label>

            <div className={styles.confirmBox}>
              <label className={styles.checkLine}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>
                  Saya sudah membaca dan memahami seluruh aturan {rulesTerm} di
                  atas.
                </span>
              </label>

              {agreed ? (
                <Link
                  href={startHref}
                  className={`${styles.startBtn} ${styles.startBtnActive}`}
                >
                  {buttonText}
                </Link>
              ) : (
                <button className={styles.startBtn} disabled>
                  {buttonText}
                </button>
              )}

              <p className={styles.hint}>
                {agreed
                  ? `Tombol aktif, klik untuk memulai ${rulesTerm}`
                  : "Centang pernyataan di atas untuk melanjutkan"}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.materiHeader}>
            <h2>📚 Materi yang Diujikan</h2>
            <span className={styles.summaryBadge}>
              3 Sesi · 28 Sub-Materi · 100 Soal
            </span>
          </div>

          <div className={styles.materiCard}>
            <div
              className={`${styles.materiCardHeader} ${styles[materiTheme] || ""}`}
            >
              <span>{materiTitle}</span>
              <div className={styles.badges}>
                <span className={styles.badge}>{materiDuration}</span>
                <span className={styles.badge}>{materiQuestionCount}</span>
              </div>
            </div>

            <div className={styles.materiBody}>
              {materiItems.map((item, idx) => (
                <div key={idx} className={styles.materiItem}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div
            className={`${styles.totalBar} ${styles[materiTheme] || ""}`}
          >
            <div>
              <h3>Total Keseluruhan</h3>
            </div>
            <span className={styles.totalBadge}>3 Sesi</span>
            <span className={styles.totalBadge}>28 Sub-Materi</span>
            <span className={styles.totalBadge}>100 Soal</span>
            <span className={styles.totalText}>Semua materi siap diujikan ✓</span>
          </div>
        </div>
      </div>
    </>
  );
}
