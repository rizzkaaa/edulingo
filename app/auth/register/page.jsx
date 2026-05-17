"use client";

import Link from "next/link";
import styles from "../login/page.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <motion.form
      className={styles.form}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.3,
      }}
      onSubmit={(e) => {
        e.preventDefault(); // Hapus ini kalau fungsi registernya uda jadi
        router.push("/auth/login");
      }}
    >
      <label>Nama Lengkap</label>
      <input type="text" placeholder="Masukkan nama lengkap" />

      <label>Username</label>
      <input type="text" placeholder="Masukkan username" />

      <label>Email</label>
      <input type="email" placeholder="nama@email.com" />

      <label>Password</label>
      <div className={styles.passwordBox}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Masukkan password"
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
        />

        <button
          type="button"
          className={styles.eyeBtn}
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

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
