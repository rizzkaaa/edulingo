"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./long_audio_question.module.css";
import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";

export default function LongAudioQuestion({
  audioSrc,
  questions = [],
  answers = {},
  onNextQuestion,
  isLastQuestion,
  parentIndex,
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
    <div className={styles.wrapper}>
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      <div className={styles.audioCard}>
        <div className={styles.audioHeader}>
          <div className={styles.iconBox}>
            <FaVolumeUp />
          </div>
          <div>
            <h2>Listen to the Audio</h2>
            <p>
              {isAudioPlayedOnce
                ? "Audio telah selesai diputar dan tidak dapat diputar ulang."
                : "Dengarkan percakapan ini dengan seksama. Audio hanya dapat diputar satu kali."}
            </p>
          </div>
        </div>

        <div className={styles.audioPlayer}>
          <button
            className={`${styles.playBtn} ${isAudioPlayedOnce ? styles.playBtnDisabled : ""}`}
            onClick={handlePlayPause}
            disabled={isAudioPlayedOnce}
          >
            {playing ? <FaPause /> : <FaPlay />}
          </button>

          <div className={styles.progressArea}>
            <div className={styles.track}>
              <div className={styles.fill} style={{ width: `${progress}%` }} />
              <div className={styles.thumb} style={{ left: `${progress}%` }} />
            </div>
            <div className={styles.times}>
              <span>{currentTime}</span>
              <span>{duration}</span>
            </div>
          </div>
        </div>

        {/* Tombol lanjut ke soal beneran — cuma muncul setelah audio selesai */}
        {isAudioFinished && (
          <div className={styles.nextActionContainer}>
            <button className={styles.buttonNext} onClick={onNextQuestion}>
              {isLastQuestion ? "FINISH" : "GO TO QUESTIONS →"}
            </button>
          </div>
        )}
      </div>

      {/* Pratinjau pertanyaan — hanya tampilan, tidak bisa diklik */}
      <div className={styles.questionList}>
        {questions.map((q, qIndex) => {
          const currentAnswerKey = `${parentIndex}_${qIndex}`;

          return (
            <div key={qIndex} className={styles.questionBlock}>
              <p className={styles.previewTitle}>
                Options Preview for Question {qIndex + 1}:
              </p>

              {q.options.map((opt, optIndex) => {
                const cleanText = opt.replace(/^[A-D]\.\s*/, "");

                return (
                  <div
                    key={optIndex}
                    className={`${styles.option} ${
                      answers[currentAnswerKey] === optIndex ? styles.optionSelected : ""
                    }`}
                  >
                    <div className={styles.choiceLetter}>
                      {String.fromCharCode(65 + optIndex)}
                    </div>
                    <span>{cleanText}</span>
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