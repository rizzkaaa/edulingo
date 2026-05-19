"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

// Backend Firebase
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
} from "firebase/auth"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  //
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Fungsi Login email & Password
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Gagal Masuk: Email dan Password wajib diisi!");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login Sukses!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const errorCode = err?.code || err?.message || "";

      // Validasi pesan error
      if (
        errorCode === "auth/invalid-credential" || 
        errorCode === "auth/user-not-found" || 
        errorCode === "auth/wrong-password") {

        alert("Email atau Password salah!");

      } else if (errorCode === "auth/too-many-requests") {
        alert("Terlalu banyak percobaan gagal. Coba beberapa saat lagi.");
      } else {
        alert (" Pastikan anda sudah memiliki akun");
      }
      return;
    }
  };

  return (
    <motion.form
      className={styles.form}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.3,
      }}
      onSubmit={handleEmailLogin}
    >
      <label>Email</label>
      <input type="email" 
      placeholder="nama@email.com"
      value={email} onChange={(e) => setEmail(e.target.value)}
      required
      />

      <label>Password</label>
      <div className={styles.passwordBox}>
        <input
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

      {error && (
        <p style={{ 
          color: "#E65100", 
          fontSize: "14px", 
          fontWeight: "600",
          marginBottom: "15px", 
          textAlign: "center" 
        }}>
          {error}
        </p>
      )}

      <motion.button
        type="submit"
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

      <motion.button
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
