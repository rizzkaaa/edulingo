"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <motion.form
      className={styles.form}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.3,
      }}
      onSubmit={(e) => {
        e.preventDefault(); // Hapus ini kalau fungsi loginnya uda jadi
        router.push("/dashboard");
      }}
    >
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

      <a href="#">Lupa password?</a>

      <motion.button
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
