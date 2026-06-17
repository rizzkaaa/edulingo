"use client";

import Link from "next/link";
import styles from "../login/page.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import Alert from "../../components/Alert";

// Backend Firebase
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading]= useState(false);

  // State alert
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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password || !fullName || !username) {
      showAlert("Semua form input wajib diisi!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|id)$/;
    if (!emailRegex.test(email)) {
      showAlert("Format email tidak valid! Pastikan menyertakan domain lengkap (misal: xxxx@gmail.com)");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi Password tidak cocok!");
      return;
    }

    // edit load
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName,
        username,
        email,
        createdAt: new Date(),
      });

      // Tampilkan alert sukses, klik Oke pindah ke login
      showAlert(
        "Akun berhasil dibuat! Silahkan login menggunakan akun baru.",
        true,
        () => router.push("/auth/login")
      );

    } catch (err) {
      console.error("Register error:", err);
      const errorCode = err?.code || "";

      if (errorCode === "auth/email-already-in-use") {
        showAlert("Email sudah terdaftar. Gunakan email lain.");
      } else if (errorCode === "auth/weak-password") {
        showAlert("Password minimal 6 karakter.");
      } else {
        showAlert("Gagal mendaftar. Silahkan lengkapi data terlebih dahulu.");
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Alert */}
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

      <motion.form
        className={styles.form}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        onSubmit={handleRegister}
      >
        <label>Nama Lengkap</label>
        <input
          type="text"
          placeholder="Masukkan nama lengkap"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          // Edit load
          disabled={isLoading}
        />

        <label>Username</label>
        <input
          type="text"
          placeholder="Masukkan username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          // Edit load
          disabled={isLoading}
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="nama@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          // Edit load
          disabled={isLoading}
        />

        <label>Password</label>
        <div className={styles.passwordBox}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          // Edit load
          disabled={isLoading}
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowPassword(!showPassword)}
          // Edit load
          disabled={isLoading}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <label>Konfirmasi Password</label>
        <div className={styles.passwordBox}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Ulangi password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          // Edit load
          disabled={isLoading}
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            // Edit load
            disabled={isLoading}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

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
          // Edit load
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Edit load */}
          {isLoading ? "MENDAFTAR..." : "DAFTAR"}
        </motion.button>

        <p className={styles.bottomText}>
          Sudah punya akun?
          <Link href="/auth/login">
            <b> Masuk sekarang</b>
          </Link>
        </p>
      </motion.form>
    </>
  );
}