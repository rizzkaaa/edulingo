"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

export default function ListeningPage() {
  const [agreed, setAgreed] = useState(false);

  return (
    <>
      {/* ===== HERO KUNING (ikut scroll) ===== */}
      <section className={styles.heroSection}>

        <div className={styles.heroLeft}>
          <div className={styles.topBadges}>
            <div className={styles.orangeBadge}>SIMULASI TOEFL</div>
            <div className={styles.whiteBadge}>100 SOAL</div>
            <div className={styles.whiteBadge}>80 MENIT</div>
          </div>

          <h1>Simulasi Penuh TOEFL</h1>

          <div className={styles.wave}></div>

          <p>
            Uji seluruh kemampuan bahasa Inggrismu dalam satu sesi simulasi lengkap
            mencakup Structure, Written Expression, Reading Strategies, Reading for
            Details, dan Listening Comprehension sesuai format TOEFL.
          </p>

          <div className={styles.infoRow}>
            <div className={styles.infoBox}>📝 100 Soal</div>
            <div className={styles.infoBox}>⏱ 80 Menit</div>
            <div className={styles.infoBox}>📚 3 Sesi</div>
            <div className={styles.infoBox}>📝 28 Sub-Materi</div>
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
            <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill="currentColor"/>
          </svg>
        </div>
        <div className={styles.sparkle2}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill="currentColor"/>
          </svg>
        </div>
        <div className={styles.sparkle3}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill="currentColor"/>
          </svg>
        </div>
      </section>

      {/* ===== KONTEN BAWAH (Aturan + Materi) ===== */}
      <div className={styles.contentWrapper}>

        <div className={styles.leftColumn}>
          <div className={styles.rulesCard}>
            <div className={styles.rulesHeader}>
              <h2>⚠ Aturan Simulasi</h2>
              <span className={styles.wajibBadge}>WAJIB DIBACA</span>
            </div>

            <div className={styles.ruleItem}>
              <span className={styles.ruleNumber}>01</span>
              <div>
                <h3>Waktu Terbatas per Sesi</h3>
                <p>Timer berjalan otomatis saat Mulai ditekan. Sesi akan otomatis submit jika waktu habis.</p>
              </div>
            </div>
            <div className={styles.divider}></div>

            <div className={styles.ruleItem}>
              <span className={styles.ruleNumber}>02</span>
              <div>
                <h3>Tidak Bisa Kembali ke Sesi Sebelumnya</h3>
                <p>Setelah sesi disubmit, kamu tidak bisa kembali untuk mengubah jawaban di sesi tersebut.</p>
              </div>
            </div>
            <div className={styles.divider}></div>

            <div className={styles.ruleItem}>
              <span className={styles.ruleNumber}>03</span>
              <div>
                <h3>Urutan Sesi Tetap</h3>
                <p>Sesi dikerjakan berurutan (Listening → Structure → Reading) dan tidak bisa dilewati.</p>
              </div>
            </div>
            <div className={styles.divider}></div>

            <div className={styles.ruleItem}>
              <span className={styles.ruleNumber}>04</span>
              <div>
                <h3>Semua Soal Wajib Dijawab</h3>
                <p>Tombol submit hanya aktif setelah seluruh soal dalam sesi terjawab.</p>
              </div>
            </div>
            <div className={styles.divider}></div>

            <div className={styles.ruleItem}>
              <span className={styles.ruleNumber}>05</span>
              <div>
                <h3>Bisa Ditandai untuk Ditinjau</h3>
                <p>Gunakan tombol "Mark for Review" untuk menandai soal yang ingin dicek ulang sebelum submit.</p>
              </div>
            </div>
            <div className={styles.divider}></div>

            <div className={styles.ruleItem}>
              <span className={styles.ruleNumber}>06</span>
              <div>
                <h3>Tanpa Referensi Eksternal</h3>
                <p>Dilarang menggunakan kamus atau catatan apapun selama simulasi berlangsung.</p>
              </div>
            </div>
            <div className={styles.divider}></div>

            <div className={styles.ruleItem}>
              <span className={styles.ruleNumber}>07</span>
              <div>
                <h3>Hasil Otomatis</h3>
                <p>Skor dan pembahasan lengkap tersedia setelah seluruh sesi simulasi selesai.</p>
              </div>
            </div>
          </div>

          <div className={styles.beforeStartCard}>
            <h3>Sebelum Mulai:</h3>

            {/* Checkbox 1 - dikunci, selalu tercentang */}
            <label className={styles.checkLine}>
              <input type="checkbox" checked readOnly />
              <span>Punya waktu 25 menit penuh tanpa gangguan.</span>
            </label>
            <div className={styles.divider}></div>

            {/* Checkbox 2 - dikunci, selalu tercentang */}
            <label className={styles.checkLine}>
              <input type="checkbox" checked readOnly />
              <span>Koneksi internet stabil dan perangkat siap digunakan.</span>
            </label>

            <div className={styles.confirmBox}>
              {/* Checkbox 3 - ngontrol tombol */}
              <label className={styles.checkLine}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>
                  Saya sudah membaca dan memahami seluruh aturan simulasi di atas.
                </span>
              </label>

            {
                agreed ? (

                  <Link
                    href="/simulation/listening"
                    className={`${styles.startBtn} ${styles.startBtnActive}`}
                  >
                    MULAI SIMULASI →
                  </Link>

                ) : (

                  <button
                    className={styles.startBtn}
                    disabled
                  >
                    MULAI SIMULASI →
                  </button>

                )
              }

              <p className={styles.hint}>
                {agreed
                  ? "Tombol aktif, klik untuk memulai simulasi"
                  : "Centang pernyataan di atas untuk melanjutkan"}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.materiHeader}>
            <h2>📚 Materi yang Diujikan</h2>
            <span className={styles.summaryBadge}>3 Sesi · 28 Sub-Materi · 100 Soal</span>
          </div>

          <div className={styles.materiCard}>
            <div className={`${styles.materiCardHeader} ${styles.green}`}>
              <span>LISTENING</span>
              <div className={styles.badges}>
                <span className={styles.badge}>25 Menit</span>
                <span className={styles.badge}>~36 Soal</span>
              </div>
            </div>

            <div className={styles.materiBody}>
              <div className={styles.materiItem}>🔲 Listening to Short Conversation</div>
              <div className={styles.materiItem}>🔲 Listening to Longer Conversation</div>
              <div className={styles.materiItem}>🔲 Listening to Talks and Note Taking</div>
            </div>
          </div>

          <div className={`${styles.totalBar} ${styles.green}`}>
            <div><h3>Total Keseluruhan</h3></div>
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