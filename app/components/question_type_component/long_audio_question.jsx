"use client";

import { useState, useRef, useEffect } from "react";
import { FaPlay, FaVolumeUp } from "react-icons/fa"; 
import { isAudioPlayed, markAudioAsPlayed } from "@/lib/audioTracker";

export default function LongAudioQuestion({
  audioSrc,
  options = [], 
  onNextQuestion,
  isLastQuestion,
}) {
  const audioRef = useRef(null);
  const lastValidTimeRef = useRef(0);

  const audioKey = audioSrc || "long_audio_global";
  const alreadyPlayed = isAudioPlayed(audioKey);

  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(alreadyPlayed);
  const [progress, setProgress] = useState(alreadyPlayed ? 100 : 0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [isAudioFinished, setIsAudioFinished] = useState(alreadyPlayed);

  useEffect(() => {
    const currentAudio = audioRef.current;
    const isPlayed = isAudioPlayed(audioKey);

    setPlaying(false);
    setHasStarted(isPlayed);
    setProgress(isPlayed ? 100 : 0);
    setCurrentTime("0:00");
    setIsAudioFinished(isPlayed);
    lastValidTimeRef.current = 0;

    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [audioSrc, audioKey]);

  function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function handlePlay() {
    if (hasStarted || isAudioFinished || isAudioPlayed(audioKey)) return;

    const audio = audioRef.current;
    if (!audio) return;

    markAudioAsPlayed(audioKey);
    setHasStarted(true);
    setPlaying(true);

    audio.playbackRate = 1.0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setPlaying(true);
        })
        .catch((error) => {
          console.log("Audio play error:", error);
          setPlaying(false);
        });
    }
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio) return;

    lastValidTimeRef.current = audio.currentTime;
    const pct = (audio.currentTime / audio.duration) * 100;
    setProgress(isNaN(pct) ? 0 : pct);
    setCurrentTime(formatTime(audio.currentTime));
  }

  function handleSeeking() {
    const audio = audioRef.current;
    if (!audio) return;
    // Mencegah seeking atau melompat-lompat pemutaran audio
    if (Math.abs(audio.currentTime - lastValidTimeRef.current) > 1) {
      audio.currentTime = lastValidTimeRef.current;
    }
  }

  function handleRateChange() {
    const audio = audioRef.current;
    if (!audio) return;
    // Mencegah mempercepat atau memperlambat audio
    if (audio.playbackRate !== 1.0) {
      audio.playbackRate = 1.0;
    }
  }

  function handleLoadedMetadata() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = 1.0;
    setDuration(formatTime(audio.duration));
  }

  function handleAudioEnded() {
    markAudioAsPlayed(audioKey);
    setPlaying(false);
    setIsAudioFinished(true);
    setProgress(100);
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "40px", fontFamily: "sans-serif" }}>
      
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        onSeeking={handleSeeking}
        onRateChange={handleRateChange}
        preload="metadata"
        tabIndex={-1}
      />

      <div style={{
        backgroundColor: "#F2EFEB",
        border: "3px solid #1A1A1A",
        padding: "30px",
        position: "relative",
        marginBottom: "40px",
        boxShadow: "6px 6px 0px #1A1A1A" 
      }}>
        
        <div style={{ display: "flex", alignItems: "center", marginBottom: "25px", gap: "20px" }}>
          <div style={{
            backgroundColor: "#F5C24F", 
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
              {isAudioFinished
                ? "The conversation has ended. Proceed to the questions."
                : hasStarted
                ? "The audio is currently playing. Please listen carefully."
                : "Press the play button to listen. The audio can only be played once."}
            </p>
          </div>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          border: "2px solid #1A1A1A",
          padding: "15px",
          gap: "15px"
        }}>
          <button
            onClick={handlePlay}
            disabled={hasStarted || isAudioFinished}
            style={{
              backgroundColor: hasStarted || isAudioFinished ? "#999" : "#B23B22", 
              border: "2px solid #1A1A1A",
              width: "40px",
              height: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              cursor: hasStarted || isAudioFinished ? "not-allowed" : "pointer",
              boxShadow: "2px 2px 0px #1A1A1A",
              opacity: hasStarted || isAudioFinished ? 0.7 : 1,
            }}
            title={
              isAudioFinished
                ? "Audio selesai diputar"
                : hasStarted
                ? "Audio sedang diputar"
                : "Putar audio (hanya 1 kali)"
            }
          >
            <FaPlay size={14} style={{ marginLeft: "3px" }} />
          </button>

          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ fontSize: "12px", fontWeight: "bold", color: "#1A1A1A", width: "35px" }}>
              {currentTime}
            </span>
            
            <div style={{ 
              flex: 1, 
              height: "6px", 
              backgroundColor: "#E0E0E0", 
              border: "1px solid #1A1A1A", 
              position: "relative",
              pointerEvents: "none",
              userSelect: "none"
            }}>
              <div style={{ 
                height: "100%", 
                backgroundColor: "#B23B22", 
                width: `${progress}%`,
                transition: "width 0.1s linear"
              }}></div>
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
        </div>
        {isAudioFinished && (
          <div style={{ marginTop: "25px", textAlign: "right" }}>
            <button 
              onClick={onNextQuestion}
              style={{
                backgroundColor: "#B23B22",
                color: "white",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "bold",
                border: "2px solid #1A1A1A",
                cursor: "pointer",
                letterSpacing: "1px",
                boxShadow: "4px 4px 0px #1A1A1A"
              }}
            >
              {isLastQuestion ? "FINISH SESSION" : "GO TO QUESTIONS →"}
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        {options && Array.isArray(options) && options.map((subQ, qIndex) => {
          if (!subQ.option || !Array.isArray(subQ.option)) return null;

          return (
            <div key={qIndex} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h3 style={{ margin: "0 0 5px 0", color: "#1A1A1A", fontSize: "16px" }}>
                Preview Question {qIndex + 1}:
              </h3>
              
              {subQ.option.map((optText, optIndex) => {
                const label = String.fromCharCode(65 + optIndex);
                
                return (
                  <div
                    key={optIndex}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#FFFFFF",
                      border: "2px solid #1A1A1A",
                      padding: "12px 16px",
                      opacity: 0.8, 
                      cursor: "not-allowed", 
                    }}
                  >
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

    </div>
  );
}