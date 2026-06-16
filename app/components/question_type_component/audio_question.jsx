"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./audio_question.module.css";
import shared from "./shared.module.css";
import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";

export default function AudioQuestion({ questionNumber, totalQuestions, audioSrc, question, options, onAnswer, selectedAnswer }) {
  const audioRef = useRef(null);
  const [playing, setPlaying]       = useState(false);
  const [progress, setProgress]     = useState(0);   // 0-100
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration]     = useState("0:00");

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function handlePlayPause() {
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

  function handleEnded() {
    setPlaying(false);
    setProgress(0);
    setCurrentTime("0:00");
    if (audioRef.current) audioRef.current.currentTime = 0;
  }

  function handleProgressClick(e) {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = clickX / rect.width;
    audio.currentTime = pct * audio.duration;
  }

  return (
    <div className={shared.wrapper}>

      {/* Audio element tersembunyi */}
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* ===== AUDIO SECTION ===== */}
      <div className={shared.mediaSection}>

        <div className={styles.audioHeader}>
          <div className={styles.audioIcon}>
            <FaVolumeUp />
          </div>
          <div>
            <h3 className={styles.audioTitle}>Listen to the Audio</h3>
            <p className={styles.audioSub}>Press the play button to listen to the conversation.</p>
          </div>
        </div>

        <div className={styles.audioPlayer}>

          <button className={styles.playBtn} onClick={handlePlayPause}>
            {playing ? <FaPause /> : <FaPlay />}
          </button>

          <div className={styles.progressWrapper}>
            <div
              className={styles.progressTrack}
              onClick={handleProgressClick}
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

        <div className={shared.options}>
          {options.map((opt, i) => (
            <button
              key={i}
              className={`${shared.option} ${selectedAnswer === i ? shared.optionSelected : ""}`}
              onClick={() => {
                if(selectedAnswer === i){
                  onAnswer(undefined);
                }else{
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
          ))}
        </div>
      </div>

    </div>
  );
}