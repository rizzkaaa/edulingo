'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function DashboardPage() {
  // State untuk melacak rute menu internal di Dashboard
  const [activeMenu, setActiveMenu] = useState('home');

  return (
    <div className={styles.layout}>
      
      {/* SIDEBAR FIXED (Navigasi Kiri) */}
      <aside className={styles.sidebar}>
        <div className={styles.brandLogo}>E</div>
        
        <ul className={styles.menuList}>
          <li 
            className={`${styles.menuItem} ${activeMenu === 'home' ? styles.menuItemActive : ''}`}
            onClick={() => setActiveMenu('home')}
            title="Beranda"
          >
            🏠
          </li>
          <li 
            className={`${styles.menuItem} ${activeMenu === 'book' ? styles.menuItemActive : ''}`}
            onClick={() => setActiveMenu('book')}
            title="Materi"
          >
            📖
          </li>
          <li 
            className={`${styles.menuItem} ${activeMenu === 'chart' ? styles.menuItemActive : ''}`}
            onClick={() => setActiveMenu('chart')}
            title="Statistik"
          >
            📊
          </li>
          <li 
            className={`${styles.menuItem} ${activeMenu === 'edit' ? styles.menuItemActive : ''}`}
            onClick={() => setActiveMenu('edit')}
            title="Tugas"
          >
            📝
          </li>
          <li 
            className={`${styles.menuItem} ${activeMenu === 'trophy' ? styles.menuItemActive : ''}`}
            onClick={() => setActiveMenu('trophy')}
            title="Peringkat"
          >
            🏆
          </li>
        </ul>

        <div className={styles.avatarItem} title="Profil">
          HV
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={styles.mainContainer}>
        
        {/* Jika menu sidebar yang aktif adalah 'home', render isi halaman utama */}
        {activeMenu === 'home' ? (
          <>
            {/* Bagian Atas Dashboard */}
            <header className={styles.header}>
              <h1 className={styles.welcomeText}>Selamat Datang, Evan 👋</h1>
              <div className={styles.dateBadge}>📅 SENIN, 12 OKT</div>
            </header>

            {/* Grid Informasi Kursus & Progres */}
            <div className={styles.topGrid}>
              <div className={styles.currentCourseCard}>
                <p className={styles.tagline}>Kursus Berlangsung</p>
                <h2 className={styles.courseTitle}>Structure Part 1 — Singular & Plural Nouns</h2>
                
                <div className={styles.progressContainer}>
                  <div className={styles.progressLabel}>
                    <span>Progres Belajar</span>
                    <span>64%</span>
                  </div>
                  <div className={styles.progressBarTrack}>
                    <div className={styles.progressBarFill}></div>
                  </div>
                </div>

                <button type="button" className={styles.btnContinue}>LANJUTKAN →</button>
              </div>

              <div className={styles.illustrationCard}>
                <div className={styles.percentBadge}>64%</div>
                <span style={{ fontSize: '64px' }}>📚</span>
              </div>
            </div>

            {/* List Materi Pelajaran */}
            <section>
              <h3 className={styles.sectionTitle}>Materi Saya +</h3>
              
              <div className={styles.materiList}>
                {/* Materi Selesai */}
                <div className={`${styles.materiItem} ${styles.materiDone}`}>
                  <div className={styles.materiInfo}>
                    <span className={styles.materiNum}>01</span>
                    <div>
                      <p className={styles.materiName}>Structure Part 1</p>
                      <p className={styles.materiStatusText}>Completed</p>
                    </div>
                  </div>
                  <span>✔️</span>
                </div>

                {/* Materi Aktif */}
                <div className={`${styles.materiItem} ${styles.materiActive}`}>
                  <div className={styles.materiInfo}>
                    <span className={styles.materiNum}>02</span>
                    <div>
                      <p className={styles.materiName}>Structure Part 2</p>
                      <p className={styles.materiStatusText}>In Progress</p>
                    </div>
                  </div>
                  <span>▶️</span>
                </div>

                {/* Materi Terkunci */}
                <div className={`${styles.materiItem} ${styles.materiLocked}`}>
                  <div className={styles.materiInfo}>
                    <span className={styles.materiNum}>03</span>
                    <div>
                      <p className={styles.materiName}>Reading Strategies</p>
                    </div>
                  </div>
                  <span>🔒 LOCKED</span>
                </div>

                {/* Materi Terkunci */}
                <div className={`${styles.materiItem} ${styles.materiLocked}`}>
                  <div className={styles.materiInfo}>
                    <span className={styles.materiNum}>04</span>
                    <div>
                      <p className={styles.materiName}>Reading for Details</p>
                    </div>
                  </div>
                  <span>🔒 LOCKED</span>
                </div>
              </div>
            </section>

            {/* Banner Simulasi */}
            <div className={styles.simulationBanner}>
              <div>
                <h2 className={styles.bannerTitle}>SIAP UJIAN SIMULASI?</h2>
                <p className={styles.bannerSubtitle}>Selesaikan 5 materi untuk membuka 100 soal</p>
              </div>
              <button type="button" className={styles.btnLocked}>
                🔒 TERKUNCI
              </button>
            </div>
          </>
        ) : (
          /* Tampilan ketika menu sidebar selain home diklik */
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <h2 className={styles.welcomeText}>Halaman {activeMenu.toUpperCase()}</h2>
            <p style={{ marginTop: '10px', color: 'var(--text-muted)' }}>Konten di area ini berubah otomatis berdasarkan menu yang kamu klik.</p>
          </div>
        )}

      </main>
    </div>
  );
}