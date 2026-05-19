"use client";

import Link from "next/link";
import styles from "../login/page.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

// Backend Firebase
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"


export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State untuk input dan error
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Fungsi Registrasi Akun
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !fullName || !username) {
      alert("Gagal Mendaftar: Semua form input wajib diisi!");
      return; 
    }

    // Validasi password.
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi Password tidak cocok!");
      return;
    }

    try {
      // Daftar akun
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Simpan data ke firebase
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        username: username,
        email: email,
        createdAt: new Date(),

      });

      console.log("Registrasi Sukses!");
      alert("Registrasi Berhasil! Silakan masuk menggunakan akun baru.");
      router.push("/auth/login");
    } catch (err){
      console.error("Register error:", err);
      const errorCode = err?.code || "";

      // Validasi pesan
      if (errorCode === "auth/email-already-in-use") {
        alert("Email sudah terdaftar. Gunakan email lain");
      } else if (errorCode === "auth/weak-password"){
        alert("Password minimal 6 karakter.");
      } else {
        alert ("Gagal mendaftar. Silahkan lengkapi data terlebih dahulu")
      }
    }
  };



  return (
    <motion.form
      className={styles.form}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.3,
      }}
      onSubmit={handleRegister}
    >
      <label>Nama Lengkap</label>
      <input type="text"
       placeholder="Masukkan nama lengkap"
       value={fullName}
       onChange={(e) => setFullName(e.target.value)}
        />

      <label>Username</label>
      <input type="text" 
      placeholder="Masukkan username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
       />

      <label>Email</label>
      <input type="email"
       placeholder="nama@email.com"
        value={email}
      onChange={(e) => setEmail(e.target.value)}
        />

      <label>Password</label>
      <div className={styles.passwordBox}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          className={styles.eyeBtn}
          onClick={() => setShowPassword(!showPassword)}
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
        />

        <button
          type="button"
          className={styles.eyeBtn}
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
        className={styles.loginBtn}
        whileHover={{
          scale: 1.03,
        }}
        whileTap={{
          scale: 0.95,
        }}
      >
        DAFTAR
      </motion.button>

      <p className={styles.bottomText}>
        Sudah punya akun?
        <Link href="/auth/login">
          <b> Masuk sekarang</b>
        </Link>
      </p>
    </motion.form>
  );
}
