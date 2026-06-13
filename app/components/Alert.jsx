import styles from "./Alert.module.css";
import { motion, AnimatePresence } from "framer-motion";
import SmallShadowBorder from "./SmallShadowBorder";
import Image from "next/image";

export default function Alert({
  text,
  handleClick = () => {},
  handleCancel = () => {},
  isAlert = true,
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 25,
        }}
        className={styles.overlay}
      >
        <SmallShadowBorder backgroundColor={"white"} className={styles.content}>
          <Image
            src={`/images/alert.png`}
            alt={`alert`}
            width={100}
            height={100}
          />
          <h4>{isAlert ? "PERINGATAN" : "KONFIRMASI"}</h4>
          <p className={styles.text}>{text}</p>
          <div className={styles.btnGroup}>
            {!isAlert ? (
              <button onClick={handleCancel}>
                <SmallShadowBorder
                  textAlign="center"
                  backgroundColor={"#FFDB58"}
                  color={"#2C2A26"}
                >
                  Batal
                </SmallShadowBorder>
              </button>
            ) : null}{" "}
            <button onClick={handleClick}>
              <SmallShadowBorder
                textAlign="center"
                backgroundColor={"#FFDB58"}
                color={"#2C2A26"}
              >
                Oke
              </SmallShadowBorder>
            </button>
          </div>
        </SmallShadowBorder>
      </motion.div>
    </AnimatePresence>
  );
}
