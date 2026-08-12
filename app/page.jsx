import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export const metadata = {
  title: "EduLingo — Platform Belajar & Simulasi TOEFL Interaktif No. 1",
  description:
    "EduLingo adalah platform persiapan TOEFL interaktif terdepan untuk Structure & Written Expression, Listening Comprehension, dan Reading Strategies. Dilengkapi simulasi ujian TOEFL real-time, materi terstruktur, dan prediksi skor akurat.",
  keywords: [
    "EduLingo",
    "Belajar TOEFL",
    "Simulasi TOEFL Online",
    "TOEFL Preparation",
    "TOEFL ITP",
    "Listening Comprehension",
    "Structure Written Expression",
    "Reading Strategies",
    "Latihan Soal TOEFL Gratis",
    "English Learning Platform",
    "Prediksi Skor TOEFL",
  ],
  authors: [{ name: "EduLingo Development Team" }],
  creator: "EduLingo",
  publisher: "EduLingo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "EduLingo — Platform Belajar & Simulasi TOEFL Interaktif",
    description:
      "Tingkatkan skor TOEFL Anda dengan materi terstruktur, simulasi real-time, dan latihan interaktif di EduLingo.",
    url: "https://edulingo.id",
    siteName: "EduLingo",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduLingo — Platform Belajar & Simulasi TOEFL Interaktif",
    description:
      "Tingkatkan skor TOEFL Anda dengan materi terstruktur, simulasi real-time, dan latihan interaktif di EduLingo.",
  },
  alternates: {
    canonical: "/",
  },
};

const developers = [
  {
    name: "AGUS PRAYOGA",
    role: "BACKEND DEV",
    quote: "Making grammar as intuitive as swipe left on a bad match.",
    image: "/images/team/agus.png",
  },
  {
    name: "ALIEF RYANDANU",
    role: "UI/UX DESIGNER",
    quote: "Designing interfaces that are as clear as my English explanations.",
    image: "/images/team/alief.png",
  },
  {
    name: "DANISWARA AHMAD FADHILAH",
    role: "BACKEND DEV",
    quote: "I speak Fluent English and Fluent React. Both are equally complex.",
    image: "/images/team/danis.png",
  },
  {
    name: "EVAN MAHESA",
    role: "UI/UX DESIGNER",
    quote: "Scalability is just my love language for databases.",
    image: "/images/team/evan.png",
  },
  {
    name: "GABRIEL JONATHAN EDI PUTRA",
    role: "UI/UX DESIGNER",
    quote: "Teaching machines to understand nuance, one epoch at a time.",
    image: "/images/team/jojo.png",
  },
  {
    name: "KELVIN ADITYA PRATAMA",
    role: "FRONTEND DEV",
    quote: "Words are blocks, I just build the most efficient castles with them.",
    image: "/images/team/kelvin.png",
  },
  {
    name: "M. RASYID AL GIFFAHRY",
    role: "BACKEND DEV",
    quote: "I organize data better than I organize my actual life.",
    image: "/images/team/rasyid.png",
  },
  {
    name: "RIZKA LAYLA RAMADHANI",
    role: "FRONTEND DEV",
    quote: "If it can be broken, I will find it. And then I will fix it.",
    image: "/images/team/rizka.png",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://edulingo.id/#organization",
      name: "EduLingo",
      url: "https://edulingo.id",
      logo: "https://edulingo.id/images/alert.png",
      description:
        "Platform persiapan TOEFL interaktif berbasis web untuk pelajar dan profesional di Indonesia.",
      sameAs: [],
    },
    {
      "@type": "WebApplication",
      "@id": "https://edulingo.id/#webapp",
      name: "EduLingo Platform",
      applicationCategory: "EducationalApplication",
      operatingSystem: "All modern browsers",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IDR",
      },
    },
    {
      "@type": "Course",
      name: "Persiapan & Simulasi TOEFL ITP Online",
      description:
        "Kursus dan latihan interaktif mencakup Listening Comprehension, Structure & Written Expression, dan Reading Strategies.",
      provider: {
        "@type": "Organization",
        name: "EduLingo",
      },
    },
  ],
};

export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* Schema.org JSON-LD for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* NAVBAR */}
      <header className={styles.navbar}>
        <Link href="/" className={styles.logoBox} aria-label="EduLingo Home">
          <div className={styles.logoBadge}>E</div>
          <span className={styles.logoText}>EduLingo</span>
        </Link>

        <nav aria-label="Main Navigation">
          <ul className={styles.navLinks}>
            <li>
              <a href="#fitur" className={styles.navLink}>
                Fitur Unggulan
              </a>
            </li>
            <li>
              <a href="#modul" className={styles.navLink}>
                Modul TOEFL
              </a>
            </li>
            <li>
              <a href="#keunggulan" className={styles.navLink}>
                Keunggulan
              </a>
            </li>
            <li>
              <a href="#tim" className={styles.navLink}>
                Tim Pengembang
              </a>
            </li>
            <li>
              <a href="#faq" className={styles.navLink}>
                FAQ
              </a>
            </li>
          </ul>
        </nav>

        <div className={styles.navAuth}>
          <Link href="/auth/login" className={styles.btnLogin}>
            Masuk
          </Link>
          <Link href="/auth/register" className={styles.btnRegister}>
            Daftar Gratis
          </Link>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className={styles.heroSection} aria-label="Hero Section">
          <div className={styles.heroContent}>
            <div className={styles.heroTag}>
              ⚡ Platform Persiapan TOEFL Interaktif No. 1
            </div>
            <h1 className={styles.heroTitle}>
              Kuasai TOEFL dengan Cara yang{" "}
              <span className={styles.heroHighlight}>Lebih Cerdas</span> & Interaktif
            </h1>
            <p className={styles.heroDescription}>
              Tingkatkan skor TOEFL Anda secara signifikan melalui pembelajaran
              terstruktur untuk <strong>Structure</strong>, <strong>Listening</strong>,
              dan <strong>Reading</strong>. Uji kesiapan Anda dengan simulasi skor
              real-time terstandar.
            </p>

            <div className={styles.heroCtas}>
              <Link href="/auth/register" className={styles.heroBtnPrimary}>
                Mulai Belajar Sekarang (Gratis) →
              </Link>
              <Link href="/auth/login" className={styles.heroBtnSecondary}>
                Masuk ke Akun Anda
              </Link>
            </div>

            <div className={styles.heroStatsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>50+</span>
                <span className={styles.statLabel}>Sub-Modul Teori</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>1000+</span>
                <span className={styles.statLabel}>Bank Soal & Audio</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>100%</span>
                <span className={styles.statLabel}>Prediksi Real-Time</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>Gratis</span>
                <span className={styles.statLabel}>Akses Penuh</span>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.previewCard}>
              <div className={styles.previewCardHeader}>
                <span className={styles.previewBadge}>Structure & Expression</span>
                <span className={styles.previewTimer}>⏱️ 00:45</span>
              </div>
              <p className={styles.previewQuestionText}>
                The North Platte River from Wyoming into Nebraska is ______ tributary
                of the Platte River.
              </p>
              <div className={styles.previewOptions}>
                <div className={styles.previewOption}>
                  <span className={styles.previewLetter}>A</span>
                  <span>it is the main</span>
                </div>
                <div className={`${styles.previewOption} ${styles.previewOptionActive}`}>
                  <span className={styles.previewLetter}>B</span>
                  <span>the main</span>
                </div>
                <div className={styles.previewOption}>
                  <span className={styles.previewLetter}>C</span>
                  <span>with the main</span>
                </div>
                <div className={styles.previewOption}>
                  <span className={styles.previewLetter}>D</span>
                  <span>that the main</span>
                </div>
              </div>
            </div>

            <div className={styles.floatingScoreBadge}>
              <span className={styles.scoreIcon}>🏆</span>
              <div>
                <div className={styles.scoreTextTitle}>Prediksi Skor TOEFL</div>
                <div className={styles.scoreTextValue}>580 - 620</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 TOEFL PILLARS SECTION */}
        <section id="modul" className={styles.sectionContainer} aria-label="Modul TOEFL">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Kurikulum Komprehensif</span>
            <h2 className={styles.sectionTitle}>3 Pilar Utama Ujian TOEFL</h2>
            <p className={styles.sectionSubtitle}>
              Materi disusun secara sistematis berdasarkan format resmi TOEFL ITP
              untuk memastikan pemahaman konsep mendalam dan kecepatan menjawab soal.
            </p>
          </div>

          <div className={styles.pillarsGrid}>
            {/* Pillar 1: Structure */}
            <article className={styles.pillarCard}>
              <div
                className={styles.pillarIcon}
                style={{ backgroundColor: "#F5C24F" }}
              >
                📖
              </div>
              <h3 className={styles.pillarTitle}>Structure & Written Expression</h3>
              <p className={styles.pillarDescription}>
                Bedah tuntas aturan tata bahasa Inggris, mulai dari Subject-Verb
                Agreement, Clause Connectors, Inversion, hingga Parallel Structures
                dengan contoh benar-salah interaktif.
              </p>
              <ul className={styles.pillarList}>
                <li className={styles.pillarListItem}>
                  <span className={styles.checkIcon}>✓</span> Singular & Plural Nouns
                </li>
                <li className={styles.pillarListItem}>
                  <span className={styles.checkIcon}>✓</span> Coordinate & Adverb Clauses
                </li>
                <li className={styles.pillarListItem}>
                  <span className={styles.checkIcon}>✓</span> Base Form Verbs & Modals
                </li>
                <li className={styles.pillarListItem}>
                  <span className={styles.checkIcon}>✓</span> Tips Jebakan Grammar TOEFL
                </li>
              </ul>
            </article>

            {/* Pillar 2: Listening */}
            <article className={styles.pillarCard}>
              <div
                className={styles.pillarIcon}
                style={{ backgroundColor: "#C5502A", color: "#FFF" }}
              >
                🎧
              </div>
              <h3 className={styles.pillarTitle}>Listening Comprehension</h3>
              <p className={styles.pillarDescription}>
                Latih pendengaran akademis dengan audio sekali putar berstandar ujian
                asli. Mencakup percakapan pendek, percakapan panjang, dan kuliah
                akademik.
              </p>
              <ul className={styles.pillarList}>
                <li className={styles.pillarListItem}>
                  <span className={styles.checkIcon}>✓</span> Short Conversations
                </li>
                <li className={styles.pillarListItem}>
                  <span className={styles.checkIcon}>✓</span> Longer Conversations
                </li>
                <li className={styles.pillarListItem}>
                  <span className={styles.checkIcon}>✓</span> Talks & Academic Lectures
                </li>
                <li className={styles.pillarListItem}>
                  <span className={styles.checkIcon}>✓</span> Audio Player Sekali Putar
                </li>
              </ul>
            </article>

            {/* Pillar 3: Reading */}
            <article className={styles.pillarCard}>
              <div
                className={styles.pillarIcon}
                style={{ backgroundColor: "#2D7A5E", color: "#FFF" }}
              >
                📝
              </div>
              <h3 className={styles.pillarTitle}>Reading Comprehension</h3>
              <p className={styles.pillarDescription}>
                Kuasai teknik membaca cepat dan pemahaman bacaan ilmiah. Pelajari cara
                menemukan ide pokok, menarik kesimpulan (inference), dan menebak arti
                kata dalam konteks.
              </p>
              <ul className={styles.pillarList}>
                <li className={styles.pillarListItem}>
                  <span className={styles.checkIcon}>✓</span> Skimming & Scanning
                </li>
                <li className={styles.pillarListItem}>
                  <span className={styles.checkIcon}>✓</span> Main Idea & Topic Sentences
                </li>
                <li className={styles.pillarListItem}>
                  <span className={styles.checkIcon}>✓</span> Stated & Unstated Details
                </li>
                <li className={styles.pillarListItem}>
                  <span className={styles.checkIcon}>✓</span> Vocabulary in Context
                </li>
              </ul>
            </article>
          </div>
        </section>

        {/* ADVANTAGES / FEATURES SECTION */}
        <section id="keunggulan" className={styles.advantagesBg} aria-label="Keunggulan">
          <div className={styles.advantagesContainer}>
            <div className={styles.advantagesHeader}>
              <span className={styles.sectionBadge}>Kenapa Memilih EduLingo</span>
              <h2 className={styles.sectionTitle}>
                Fitur Canggih yang Dirancang untuk Kelulusan Anda
              </h2>
              <p className={styles.sectionSubtitle}>
                Semua instrumen belajar yang Anda butuhkan untuk mencapai target skor
                550+ tersedia dalam satu platform tanpa biaya tersembunyi.
              </p>
            </div>

            <div className={styles.advantagesGrid}>
              <div className={styles.advantageCard}>
                <div className={styles.advantageNumber}>01</div>
                <h3 className={styles.advantageTitle}>Simulasi Ujian Real-Time</h3>
                <p className={styles.advantageText}>
                  Ujian simulasi lengkap dengan timer otomatis, perhitungan skor konversi
                  TOEFL resmi, dan pembahasan soal yang mendalam.
                </p>
              </div>

              <div className={styles.advantageCard}>
                <div className={styles.advantageNumber}>02</div>
                <h3 className={styles.advantageTitle}>Audio Player Terproteksi</h3>
                <p className={styles.advantageText}>
                  Format audio terstandar ujian nyata: diputar sekali, tidak dapat
                  di-pause atau dimanipulasi posisinya untuk melatih fokus maksimal.
                </p>
              </div>

              <div className={styles.advantageCard}>
                <div className={styles.advantageNumber}>03</div>
                <h3 className={styles.advantageTitle}>Papan Peringkat & Riwayat</h3>
                <p className={styles.advantageText}>
                  Pantau peningkatan skor Anda dari waktu ke waktu dan bandingkan
                  pencapaian dengan peserta lain di seluruh Indonesia.
                </p>
              </div>

              <div className={styles.advantageCard}>
                <div className={styles.advantageNumber}>04</div>
                <h3 className={styles.advantageTitle}>Penjelasan Teori Visual</h3>
                <p className={styles.advantageText}>
                  Materi dilengkapi tabel perbandingan, pola rumus ringkas, dan tip
                  kilat TOEFL yang mudah dihafal saat ujian.
                </p>
              </div>

              <div className={styles.advantageCard}>
                <div className={styles.advantageNumber}>05</div>
                <h3 className={styles.advantageTitle}>Performa Cepat & Responsif</h3>
                <p className={styles.advantageText}>
                  Aplikasi ringan, responsif di semua perangkat (laptop, tablet, dan
                  smartphone), siap digunakan kapan pun dan di mana pun.
                </p>
              </div>

              <div className={styles.advantageCard}>
                <div className={styles.advantageNumber}>06</div>
                <h3 className={styles.advantageTitle}>100% Akses Terbuka</h3>
                <p className={styles.advantageText}>
                  Daftar akun gratis dan langsung akses semua modul latihan serta
                  simulasi tanpa perlu berlangganan atau membayar biaya kursus.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM SECTION */}
        <section id="tim" className={styles.teamSection} aria-label="Tim Pengembang">
          <div className={styles.sectionContainer} style={{ padding: "0" }}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionBadge}>Di Balik EduLingo</span>
              <h2 className={styles.sectionTitle}>Tim Pengembang EduLingo</h2>
              <p className={styles.sectionSubtitle}>
                Kolaborasi tim desainer, insinyur perangkat lunak, dan pengembang yang
                berdedikasi untuk menciptakan pengalaman belajar TOEFL terbaik bagi
                seluruh mahasiswa dan pembelajar bahasa Inggris.
              </p>
            </div>

            <div className={styles.teamGrid}>
              {developers.map((dev, idx) => (
                <div key={idx} className={styles.teamCard}>
                  <Image
                    src={dev.image || "/images/default_profile.png"}
                    alt={`${dev.name} - ${dev.role}`}
                    width={100}
                    height={100}
                    className={styles.teamAvatar}
                  />
                  <h3 className={styles.teamName}>{dev.name}</h3>
                  <span className={styles.teamRole}>{dev.role}</span>
                  <p className={styles.teamQuote}>"{dev.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className={styles.sectionContainer} aria-label="Pertanyaan Umum">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Punya Pertanyaan?</span>
            <h2 className={styles.sectionTitle}>Pertanyaan yang Sering Diajukan</h2>
            <p className={styles.sectionSubtitle}>
              Jawaban cepat untuk pertanyaan umum seputar platform dan materi belajar
              EduLingo.
            </p>
          </div>

          <div className={styles.faqGrid}>
            <details className={styles.faqItem}>
              <summary className={styles.faqSummary}>
                Apakah platform EduLingo ini gratis digunakan?
              </summary>
              <div className={styles.faqContent}>
                Ya! EduLingo dapat digunakan secara 100% gratis. Anda cukup mendaftarkan
                akun melalui halaman pendaftaran dan Anda langsung dapat mengakses seluruh
                materi modul latihan dan simulasi ujian TOEFL.
              </div>
            </details>

            <details className={styles.faqItem}>
              <summary className={styles.faqSummary}>
                Materi apa saja yang dipelajari di EduLingo?
              </summary>
              <div className={styles.faqContent}>
                EduLingo menyediakan kurikulum lengkap persiapan TOEFL ITP yang terdiri
                dari 3 seksi utama: Structure & Written Expression (tata bahasa dan
                koreksi kalimat), Listening Comprehension (percakapan dan kuliah
                akademik), serta Reading Comprehension (strategi bacaan dan kosakata).
              </div>
            </details>

            <details className={styles.faqItem}>
              <summary className={styles.faqSummary}>
                Bagaimana sistem penilaian simulasi TOEFL di EduLingo?
              </summary>
              <div className={styles.faqContent}>
                Penilaian di EduLingo menggunakan tabel konversi skala skor resmi TOEFL
                (skor berkisar antara 310 hingga 677). Sistem secara otomatis menghitung
                jawaban benar pada setiap seksi untuk memberikan estimasi skor prediksi
                yang akurat.
              </div>
            </details>

            <details className={styles.faqItem}>
              <summary className={styles.faqSummary}>
                Apakah saya bisa mengakses EduLingo lewat HP / Smartphone?
              </summary>
              <div className={styles.faqContent}>
                Tentu saja! EduLingo dibangun dengan antarmuka yang sepenuhnya responsif
                sehingga nyaman dibuka di berbagai ukuran layar, termasuk smartphone,
                tablet, maupun laptop.
              </div>
            </details>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className={styles.ctaBanner} aria-label="Call to Action">
          <h2 className={styles.ctaBannerTitle}>
            Siap Meraih Skor TOEFL Terbaikmu Hari Ini?
          </h2>
          <p className={styles.ctaBannerText}>
            Bergabunglah dengan ribuan peserta lain yang telah mempersiapkan ujian TOEFL
            dengan materi interaktif dan simulasi terarah di EduLingo.
          </p>
          <div className={styles.ctaBannerBtns}>
            <Link href="/auth/register" className={styles.heroBtnPrimary}>
              Daftar Akun Baru Sekarang →
            </Link>
            <Link href="/auth/login" className={styles.heroBtnSecondary}>
              Masuk ke Akun
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerBrand}>
            <div className={styles.logoBox}>
              <div className={styles.logoBadge}>E</div>
              <span className={styles.logoText}>EduLingo</span>
            </div>
            <p className={styles.footerTagline}>
              Platform belajar dan simulasi TOEFL interaktif modern untuk membantu
              mahasiswa dan pembelajar mencapai kemahiran bahasa Inggris terbaik.
            </p>
          </div>

          <div>
            <h4 className={styles.footerColTitle}>Modul Belajar</h4>
            <ul className={styles.footerColLinks}>
              <li>
                <Link href="/auth/login" className={styles.footerColLink}>
                  Structure Part 1 & 2
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className={styles.footerColLink}>
                  Written Expression
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className={styles.footerColLink}>
                  Listening Comprehension
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className={styles.footerColLink}>
                  Reading Strategies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={styles.footerColTitle}>Fitur Platform</h4>
            <ul className={styles.footerColLinks}>
              <li>
                <Link href="/auth/login" className={styles.footerColLink}>
                  Simulasi TOEFL
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className={styles.footerColLink}>
                  Leaderboard Peserta
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className={styles.footerColLink}>
                  Riwayat Skor
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className={styles.footerColLink}>
                  Daftar Akun
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={styles.footerColTitle}>Navigasi</h4>
            <ul className={styles.footerColLinks}>
              <li>
                <a href="#modul" className={styles.footerColLink}>
                  Kurikulum
                </a>
              </li>
              <li>
                <a href="#keunggulan" className={styles.footerColLink}>
                  Keunggulan
                </a>
              </li>
              <li>
                <a href="#tim" className={styles.footerColLink}>
                  Tim Pengembang
                </a>
              </li>
              <li>
                <a href="#faq" className={styles.footerColLink}>
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} EduLingo Platform. All rights reserved.</p>
          <p>Dibuat dengan ❤️ oleh Tim Pengembang EduLingo.</p>
        </div>
      </footer>
    </div>
  );
}