"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

// ==========================================
// PENAMBAHAN KODE BACKEND FIREBASE
// ==========================================
import { auth } from "../../../lib/firebase"; // Jalur relatif menuju src/lib/firebase.js
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // State Backend untuk menampung input data & error
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Fungsi Logika Login Email & Password
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login Email Sukses!");
      router.push("/dashboard"); // Redirect ke halaman dashboard jika berhasil
    } catch (err) {
      console.error("Error login email:", err);
      const errorCode = err?.code || "";

      // Validasi pesan error bahasa indonesia
      if (errorCode === "auth/invalid-credential" || errorCode === "auth/user-not-found" || errorCode === "auth/wrong-password") {
        setError("Email atau Password salah!");
      } else if (errorCode === "auth/too-many-requests") {
        setError("Terlalu banyak percobaan gagal. Coba beberapa saat lagi.");
      } else {
        setError("Gagal masuk. Pastikan koneksi internet kamu aktif.");
      }
    }
  };

  // Fungsi Logika Login menggunakan Google
  const handleGoogleLogin = async (e) => {
    e.preventDefault(); // Mencegah form trigger submit bawaan HTML
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      console.log("Login Google Sukses!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Error login Google:", err);
      if (err?.code !== "auth/popup-closed-by-user") {
        setError("Gagal masuk menggunakan akun Google.");
      }
    }
  };
  // ==========================================

  return (
    <motion.form
      className={styles.form}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.3,
      }}
      onSubmit={handleEmailLogin} // DIUBAH: Menggunakan fungsi login backend kita
    >
      {/* PENAMBAHAN BACKEND: Elemen UI untuk memunculkan pesan error jika login gagal */}
      {error && (
        <div style={{ color: "#e63946", fontWeight: "600", fontSize: "14px", marginBottom: "12px" }}>
          {error}
        </div>
      )}

      <label htmlFor="email">Email</label>
      {/* PERUBAHAN MINOR: Menambahkan value, onChange, id, dan required */}
      <input 
        id="email"
        type="email" 
        placeholder="nama@email.com" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="password">Password</label>
      <div className={styles.passwordBox}>
        {/* PERUBAHAN MINOR: Menambahkan value, onChange, id, dan required */}
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="button"
          className={styles.eyeBtn}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <a href="#">Lupa password?</a>

      {/* Button submit email login tetap utuh dengan animasi bawaan frontend */}
      <motion.button
        type="submit" // Memastikan tipenya submit form
        className={styles.loginBtn}
        whileHover={{
          scale: 1.03,
        }}
        whileTap={{
          scale: 0.95,
        }}
      >
        MASUK
      </motion.button>

      <div className={styles.divider}>
        <span></span>
        atau
        <span></span>
      </div>

      {/* Button Google Login tetap utuh, dipasang handler klik backend */}
      <motion.button
        type="button" // Diubah ke button biasa agar tidak memicu form submit email
        onClick={handleGoogleLogin} 
        className={styles.googleBtn}
        whileHover={{
          scale: 1.03,
        }}
        whileTap={{
          scale: 0.95,
        }}
      >
        Lanjutkan dengan Google
      </motion.button>

      <p className={styles.bottomText}>
        Belum punya akun?
        <Link href="/auth/register">
          <b> Daftar sekarang</b>
        </Link>
      </p>
    </motion.form>
  );
}