"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./audio_question.module.css";
import shared from "./shared.module.css";
import { FaPlay, FaVolumeUp } from "react-icons/fa";
import { isAudioPlayed, markAudioAsPlayed } from "@/lib/audioTracker";

export default function AudioQuestion({ 
  questionNumber, 
  totalQuestions, 
  audioSrc, 
  question, 
  options, 
  onAnswer, 
  selectedAnswer 
}) {
  const audioRef = useRef(null);
  const lastValidTimeRef = useRef(0);

  const audioKey = audioSrc || `audio_q_${questionNumber}`;
  const alreadyPlayed = isAudioPlayed(audioKey);

  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(alreadyPlayed);
  const [progress, setProgress] = useState(alreadyPlayed ? 100 : 0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [ended, setEnded] = useState(alreadyPlayed);

  useEffect(() => {
    const currentAudio = audioRef.current;
    const isPlayed = isAudioPlayed(audioKey);

    setPlaying(false);
    setHasStarted(isPlayed);
    setProgress(isPlayed ? 100 : 0);
    setCurrentTime("0:00");
    setEnded(isPlayed);
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
    if (hasStarted || ended || isAudioPlayed(audioKey)) return; 
    
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

  function handleEnded() {
    markAudioAsPlayed(audioKey);
    setPlaying(false);
    setEnded(true); 
    setProgress(100);
  }

  return (
    <div className={shared.wrapper}>

      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onSeeking={handleSeeking}
        onRateChange={handleRateChange}
        preload="metadata"
        tabIndex={-1}
      />

      {/* ===== AUDIO SECTION ===== */}
      <div className={shared.mediaSection}>
        <div className={styles.audioHeader}>
          <div className={styles.audioIcon}>
            <FaVolumeUp />
          </div>
          <div>
            <h3 className={styles.audioTitle}>Listen to the Audio</h3>
            <p className={styles.audioSub}>
            {ended
              ? "The audio has finished playing and cannot be replayed."
              : hasStarted
              ? "The audio is currently playing. Please listen carefully."
              : "Listen carefully to the audio. The audio can only be played once."
            }
            </p>
          </div>
        </div>

        <div className={styles.audioPlayer}>
          <button
            className={`${styles.playBtn} ${hasStarted || ended ? styles.playBtnDisabled : ""}`}
            onClick={handlePlay}
            disabled={hasStarted || ended}
            title={
              ended
                ? "Audio selesai diputar"
                : hasStarted
                ? "Audio sedang diputar"
                : "Putar audio (hanya 1 kali)"
            }
          >
            <FaPlay />
          </button>

          <div className={styles.progressWrapper}>
            <div
              className={styles.progressTrack}
              style={{ cursor: "default", pointerEvents: "none", userSelect: "none" }}
            >
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
              <div
                className={styles.progressThumb}
                style={{ left: `${progress}%` }}
              />
            </div>
            <div className={styles.progressTimes}>
              <span>{currentTime}</span>
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== QUESTION SECTION ===== */}
      <div className={shared.questionSection}>
        <span className={shared.questionLabel}>
          QUESTION {questionNumber} OF {totalQuestions}
        </span>

        <h2 className={shared.questionText}>{question}</h2>

        {/* 🌟 SEKARANG SUDAH SAMA PERSIS DENGAN BASIC_QUESTION */}
        <div className={shared.options}>
          {options && Array.isArray(options) && options.length > 0 ? (
            options.map((opt, i) => (
              <button
                key={i}
                className={`${shared.option} ${selectedAnswer === i ? shared.optionSelected : ""}`}
                onClick={() => {
                  if (selectedAnswer === i) {
                    onAnswer(undefined);
                  } else {
                    onAnswer(i);
                  }
                }}
              >
                <span className={`${shared.radio} ${selectedAnswer === i ? shared.radioSelected : ""}`}>
                  {selectedAnswer === i && <span className={shared.radioFill} />}
                </span>
                <span className={`${shared.optionText} ${selectedAnswer === i ? shared.optionTextSelected : ""}`}>
                  {opt}
                </span>
              </button>
            ))
          ) : (
            <p style={{ color: "red" }}>
              {options === undefined ? "Data options belum diterima (Cek PracticePage.js)" : "Pilihan tidak tersedia."}
            </p>
          )}
        </div>
      </div>

    </div>
  );
}