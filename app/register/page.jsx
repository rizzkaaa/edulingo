"use client";

import Link from "next/link";
import styles from "./page.module.css";

import { useState } from "react";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import { motion } from "framer-motion";

export default function RegisterPage() {

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (

    <motion.div
      className={styles.container}
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut"
      }}
    >

      <div className={styles.left}>

        <div className={styles.logo}>
          EduLingo
        </div>

        <div className={styles.circle}></div>
        <div className={styles.square}></div>
        <div className={styles.smallSquare}></div>
        <div className={styles.smallCircle}></div>

        <div className={styles.content}>

          <h1>
            Learn English.
            <br />
            No Excuses.
          </h1>

          <div className={styles.line}></div>

          <p>
            Master the English language with interactive lessons,
            real conversations, and personalized learning paths.
          </p>

          <div className={styles.tags}>

            <button>
              📖 Structure
            </button>

            <button>
              🎧 Listening
            </button>

            <button>
              📝 Reading
            </button>

          </div>

        </div>

      </div>

      <div className={styles.right}>

        <motion.div
          className={styles.authBox}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.2
          }}
        >

          <div className={styles.tab}>

            <Link
              href="/login"
              className={styles.tabLink}
            >
              MASUK
            </Link>

            <Link
              href="/register"
              className={`${styles.tabLink} ${styles.activeTab}`}
            >
              DAFTAR
            </Link>

          </div>

          <motion.div
            className={styles.form}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.3
            }}
          >

            <label>Nama Lengkap</label>

            <input
              type="text"
              placeholder="Masukkan nama lengkap"
            />

            <label>Username</label>

            <input
              type="text"
              placeholder="Masukkan username"
            />

            <label>Email</label>

            <input
              type="email"
              placeholder="nama@email.com"
            />

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
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword
                  ? <FaEyeSlash />
                  : <FaEye />
                }
              </button>

            </div>

            <motion.button
              className={styles.loginBtn}
              whileHover={{
                scale: 1.03
              }}
              whileTap={{
                scale: 0.95
              }}
            >
              DAFTAR
            </motion.button>

            <p className={styles.bottomText}>

              Sudah punya akun?

              <Link href="/login">
                <b> Masuk sekarang</b>
              </Link>

            </p>

          </motion.div>

        </motion.div>

      </div>

    </motion.div>
  );
}