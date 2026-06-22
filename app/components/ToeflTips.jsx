import { useState } from "react";
import styles from "./ToeflTips.module.css";
import SmallShadowBorder from "./SmallShadowBorder";
import BorderLeftBox from "./BorderLeftBox";
import ListSentence from "./ListSentences";

export default function ToeflTips({ material }) {
  // Local state khusus untuk tombol ini saja
  const [isUnderstood, setIsUnderstood] = useState(false);

  return (
    <BorderLeftBox
      borderColor={"#2D7A5E"}
      backgroundColor={"#E8F4EF"}
      className={styles.container}
    >
      <h3>{material.title}</h3>
      {Array.isArray(material.explain) ? (
        <ListSentence material={material.explain} />
      ) : (
        <p>{material.explain}</p>
      )}

      {material.contoh ? (
        <SmallShadowBorder backgroundColor={"#E8A838"} color={"black"}>
          {material.contoh}
          
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <button 
              type="button" // 🌟 PENTING 1: Mencegah sifat default form
              onClick={(e) => {
                e.preventDefault(); // Mencegah aksi default browser
                e.stopPropagation(); // 🌟 PENTING 2: Mencegah klik "bocor" ke komponen lain
                setIsUnderstood(true);
              }}
              disabled={isUnderstood}
              style={{
                backgroundColor: isUnderstood ? "#cccccc" : "#E8A838",
                color: isUnderstood ? "#666666" : "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: isUnderstood ? "not-allowed" : "pointer",
                fontWeight: "bold"
              }}
            >
              {isUnderstood ? "✅ Anda sudah memahami ini" : "Saya sudah memahami contoh ini"}
            </button>
          </div>

        </SmallShadowBorder>
      ) : (
        <></>
      )}
    </BorderLeftBox>
  );
}