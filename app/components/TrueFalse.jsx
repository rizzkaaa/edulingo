"use client";
import { useState } from "react";
import styles from "./TrueFalse.module.css";
import { LuCircleCheck, LuX } from "react-icons/lu";
import SmallShadowBorder from "@/app/components/SmallShadowBorder";
import BorderLeftBox from "./BorderLeftBox";

export default function TrueFalse({ material, onAnswered }) {
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const handleConfirm = () => {
    setHasConfirmed(true);
    if (onAnswered) {
      onAnswered();
    }
    window.dispatchEvent(new Event("practice-completed"));
  };

  return (
    <BorderLeftBox backgroundColor={'#faeeda'} borderColor={'#e8a838'} className={styles.container}>
      <h3>{material.title}</h3>
      <div>
        {material.explain.map((item, i) => (
          <div className={styles.box} key={i}>
            <SmallShadowBorder
              color="white"
              backgroundColor={i == 0 ? "#2D7A5E" : "#C5502A"}
            >
              {item.status}
            </SmallShadowBorder>
            <div className={styles.examples}>
              {item.sentences.map((sentence) => (
                <SmallShadowBorder key={sentence} backgroundColor={'#E8F4EF'}>
                  <p
                    className={i == 1 ? "wrongSentence" : ""}
                  >
                    {i == 0 ? (
                      <LuCircleCheck style={{ color: "#2D7A5E" }} />
                    ) : (
                      <LuX style={{ color: "#C5502A" }} />
                    )}{" "}
                    {sentence}
                  </p>
                </SmallShadowBorder>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 🌟 3. Tambahkan Tombol Konfirmasi Pemahaman */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
        {!hasConfirmed ? (
          <button
            onClick={handleConfirm}
            style={{
              padding: "10px 20px",
              backgroundColor: "#e8a838",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <LuCircleCheck /> Saya sudah memahami contoh ini
          </button>
        ) : (
          <div style={{
            padding: "10px 20px",
            color: "#2D7A5E",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <LuCircleCheck size={20} /> Pemahaman terkonfirmasi! Silakan lanjut.
          </div>
        )}
      </div>

    </BorderLeftBox>
  );
}