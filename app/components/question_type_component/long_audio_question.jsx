"use client";

import { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaVolumeUp, FaCog } from "react-icons/fa";

export default function LongAudioQuestion({
  audioSrc,
  options = [], // Mengambil array sub-soal dari JSON
  onNextQuestion,
  isLastQuestion,
}) {
  const audioRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [isAudioFinished, setIsAudioFinished] = useState(false);
  const [isAudioPlayedOnce, setIsAudioPlayedOnce] = useState(false);

  useEffect(() => {
    setPlaying(false);
    setProgress(0);
    setCurrentTime("0:00");
    setIsAudioFinished(false);
    setIsAudioPlayedOnce(false);
  }, [audioSrc]);

  function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function handlePlayPause() {
    if (isAudioPlayedOnce) return;

    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio) return;

    const pct = (audio.currentTime / audio.duration) * 100;
    setProgress(isNaN(pct) ? 0 : pct);
    setCurrentTime(formatTime(audio.currentTime));
  }

  function handleLoadedMetadata() {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(formatTime(audio.duration));
  }

  function handleAudioEnded() {
    setPlaying(false);
    setIsAudioFinished(true);
    setIsAudioPlayedOnce(true);
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "40px", fontFamily: "sans-serif" }}>
      
      {/* 🌟 AUDIO RAHASIA UNTUK FUNGSI PLAY */}
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      {/* 🌟 1. KOTAK PEMUTAR AUDIO (Sesuai Gambar) */}
      <div style={{
        backgroundColor: "#F2EFEB",
        border: "3px solid #1A1A1A",
        padding: "30px",
        position: "relative",
        marginBottom: "40px",
        boxShadow: "6px 6px 0px #1A1A1A" // Efek shadow solid khas Neo-brutalism
      }}>
        
        {/* Header Audio */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "25px", gap: "20px" }}>
          <div style={{
            backgroundColor: "#F5C24F", // Warna kuning
            border: "2px solid #1A1A1A",
            width: "50px",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "20px",
            color: "#1A1A1A"
          }}>
            <FaVolumeUp />
          </div>
          <div>
            <h2 style={{ margin: "0 0 5px 0", fontSize: "24px", color: "#1A1A1A", fontWeight: "bold" }}>
              Listen to the Audio
            </h2>
            <p style={{ margin: 0, fontSize: "14px", color: "#4A4A4A" }}>
              {isAudioPlayedOnce
                ? "The conversation has ended. Proceed to the questions."
                : "Press the play button to listen to the conversation."}
            </p>
          </div>
        </div>

        {/* Player Controls */}
        <div style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          border: "2px solid #1A1A1A",
          padding: "15px",
          gap: "15px"
        }}>
          {/* Tombol Play/Pause */}
          <button
            onClick={handlePlayPause}
            disabled={isAudioPlayedOnce}
            style={{
              backgroundColor: isAudioPlayedOnce ? "#999" : "#B23B22", // Merah bata
              border: "2px solid #1A1A1A",
              width: "40px",
              height: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              cursor: isAudioPlayedOnce ? "not-allowed" : "pointer",
              boxShadow: "2px 2px 0px #1A1A1A"
            }}
          >
            {playing ? <FaPause size={14} /> : <FaPlay size={14} style={{ marginLeft: "3px" }} />}
          </button>

          {/* Progress Bar & Waktu */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ fontSize: "12px", fontWeight: "bold", color: "#1A1A1A", width: "35px" }}>
              {currentTime}
            </span>
            
            {/* Track Custom */}
            <div style={{ flex: 1, height: "6px", backgroundColor: "#E0E0E0", border: "1px solid #1A1A1A", position: "relative" }}>
              <div style={{ 
                height: "100%", 
                backgroundColor: "#B23B22", 
                width: `${progress}%`,
                transition: "width 0.1s linear"
              }}></div>
              {/* Slider Thumb (Kotak Putih Kecil) */}
              <div style={{
                position: "absolute",
                top: "50%",
                left: `${progress}%`,
                transform: "translate(-50%, -50%)",
                width: "12px",
                height: "16px",
                backgroundColor: "#FFF",
                border: "2px solid #1A1A1A"
              }}></div>
            </div>

            <span style={{ fontSize: "12px", fontWeight: "bold", color: "#1A1A1A" }}>
              {duration}
            </span>
          </div>

          {/* Gear Icon */}
          <div style={{ 
            border: "2px solid #1A1A1A", 
            width: "40px", 
            height: "40px", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            backgroundColor: "#FFF"
          }}>
            <FaCog size={18} color="#1A1A1A" />
          </div>
        </div>
      </div>

      {/* 🌟 2. PRATINJAU OPSI (Hanya Preview, Sesuai Gambar) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        {options && Array.isArray(options) && options.map((subQ, qIndex) => {
          
          // Memastikan bahwa ada array 'option' di dalam sub-soal
          if (!subQ.option || !Array.isArray(subQ.option)) return null;

          return (
            <div key={qIndex} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              
              {/* 🌟 LABEL PRATINJAU SOAL */}
              <h3 style={{ margin: "0 0 5px 0", color: "#1A1A1A", fontSize: "16px" }}>
                Preview Question {qIndex + 1}:
              </h3>
              
              {/* Mapping 4 Pilihan Jawaban (A, B, C, D) */}
              {subQ.option.map((optText, optIndex) => {
                const label = String.fromCharCode(65 + optIndex); // Menghasilkan A, B, C, D
                
                return (
                  <div
                    key={optIndex}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#FFFFFF",
                      border: "2px solid #1A1A1A",
                      padding: "12px 16px",
                      opacity: 0.8, // Memberikan kesan tidak aktif/read-only
                      cursor: "not-allowed", // Kursor dilarang
                    }}
                  >
                    {/* Kotak Huruf (A/B/C/D) */}
                    <div style={{
                      border: "2px solid #1A1A1A",
                      padding: "2px 8px",
                      marginRight: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#1A1A1A",
                      backgroundColor: "#FFF"
                    }}>
                      {label}
                    </div>
                    
                    {/* Teks Opsi */}
                    <span style={{ fontSize: "14px", color: "#333", fontWeight: "500" }}>
                      {optText}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* 🌟 3. TOMBOL LANJUT KE SOAL */}
      {isAudioFinished && (
        <div style={{ marginTop: "50px", textAlign: "right" }}>
          <button 
            onClick={onNextQuestion}
            style={{
              backgroundColor: "#1A1A1A",
              color: "white",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              letterSpacing: "1px",
              boxShadow: "4px 4px 0px #B23B22"
            }}
          >
            {isLastQuestion ? "FINISH SESSION" : "GO TO QUESTIONS →"}
          </button>
        </div>
      )}

    </div>
  );
}