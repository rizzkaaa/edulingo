"use client";

import styles from "./SubmitLoadingModal.module.css";
import { motion, AnimatePresence } from "framer-motion";

export default function SubmitLoadingModal({ isOpen, title = "Memproses Jawaban", message = "Mohon tunggu, sedang menyimpan hasil prediction Anda..." }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className={styles.overlay}>
        <motion.div
          className={styles.modal}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className={styles.spinnerWrapper}>
            <div className={styles.spinner}></div>
          </div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.message}>{message}</p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
