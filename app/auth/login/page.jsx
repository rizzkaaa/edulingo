"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import Alert from "../../components/Alert";

// Backend Firebase
import { auth, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  //
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
 
  // Fungsi untuk Load login
  const [isLoading, setIsLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    text: "",
    isAlert: true,
    onOke: () => {},
  });

  function showAlert(text, isAlert = true, onOke = () => {}) {
    setAlertConfig({ show: true, text, isAlert, onOke });
  }

  function closeAlert() {
    setAlertConfig(prev => ({ ...prev, show: false }));
  }

  // Fungsi Login email & Password
  const handleEmailLogin = async (e) => {
    e.preventDefault();

const emailRegex = /^[^\s@]+@[^\s@]+\.(com|id)$/;
    if (!emailRegex.test(email)) {
      showAlert("Format email tidak valid! Pastikan menyertakan domain lengkap dengan akhiran .com");
      return;
    }

    if (!email || !password) {
      showAlert("Gagal Masuk: Email dan Password wajib diisi!");
      return;
    }

    // Load
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;

      // Verifikasi status keaktifan akun user (kecuali admin utama p@gmail.com)
      if (loggedInUser.email?.toLowerCase() !== "p@gmail.com") {
        const userDocRef = doc(db, "users", loggedInUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.isActive === false || userData.status === "inactive") {
            await signOut(auth);
            setIsLoading(false);
            showAlert(
              "Akun Anda telah dinonaktifkan oleh administrator. Silakan hubungi admin di p@gmail.com untuk info lebih lanjut."
            );
            return;
          }
        }
      }

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

        showAlert("Email atau Password salah!");

      } else if (errorCode === "auth/too-many-requests") {
        showAlert("Terlalu banyak percobaan gagal. Coba beberapa saat lagi.");
      } else {
        showAlert(" Pastikan anda sudah memiliki akun");
      }

      // edit load
      setIsLoading(false);
      return;
    }
  };


  return (
    <>
      {/*  */}
      {alertConfig.show && (
        <Alert
          isAlert={alertConfig.isAlert}
          text={alertConfig.text}
          handleClick={() => {
            closeAlert();
            alertConfig.onOke();
          }}
          handleCancel={closeAlert}
        />
      )}
      {/* ===*/}
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
      placeholder="nama@gmail.com"
      value={email} onChange={(e) => setEmail(e.target.value)}
      required
      // edit load
      disabled={isLoading}
      />

      <label>Password</label>
      <div className={styles.passwordBox}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
         // edit load
         disabled={isLoading}
        />

        <button
          type="button"
          className={styles.eyeBtn}
          onClick={() => setShowPassword(!showPassword)}
          // edit load
          disabled={isLoading}
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
        // edit load
        disabled={isLoading}
        style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
        whileHover={{
          scale: 1.03,
        }}
        whileTap={{
          scale: 0.95,
        }}
      >
      {/* edit Load*/}
        {isLoading ? "MEMUAT..." : "MASUK"}
        {/* ===*/}
      </motion.button>

      <div className={styles.divider}>
        <span></span>
        atau
        <span></span>
      </div>

      <motion.button
        className={styles.googleBtn}
        // Edit Load
        disabled={isLoading}
        style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
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
    </>
  );
}
