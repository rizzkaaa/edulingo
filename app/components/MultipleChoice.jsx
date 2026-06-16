"use client";
import styles from "./MultipleChoice.module.css";
import React from "react";
import { useEffect, useRef, useState } from "react";
import SmallShadowBorder from "./SmallShadowBorder";
import { MdGraphicEq } from "react-icons/md";
import { LuPlay, LuPause, LuRotateCcw } from "react-icons/lu";
import Alert from "./Alert";

function MultipleChoice({ children, material }) {
  return (
    <div className={styles.container}>
      <h3>{material.title}</h3>
      {children}
      {material.questions.map((question, i) => {
        const huruf = ["A", "B", "C", "D"];
        return (
          <React.Fragment key={i}>
            <p key={i} className={styles.label}>
              Question No. {i + 1}
            </p>
            <div>
              {question.options.map((q, j) => (
                <div
                  key={j}
                  className={
                    j == question.correct_index
                      ? styles.correct
                      : styles.incorrect
                  }
                >
                  <h5>{huruf[j]}</h5>
                  <p>{q}</p>
                </div>
              ))}
            </div>
          </React.Fragment>
        );
      })}
      {material.clue ? (
        <p
          className={styles.clue}
          dangerouslySetInnerHTML={{ __html: material.clue }}
        />
      ) : null}
    </div>
  );
}

function AudioPlayer({ src }) {
  const audioRef = useRef(null);

  const [showAlert, setShowAlert] = useState(false);
  const [available, setAvailable] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!available) return;
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setPlaying(!playing);
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;
    const updateTime = () => {
      setCurrent(audio.currentTime);
    };

    const loaded = () => {
      setDuration(audio.duration);
    };

    if (!isNaN(audio.duration)) {
      setDuration(audio.duration);
    }
    console.log(duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", loaded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", loaded);
    };
  }, []);

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className={styles.audio}>
      {showAlert ? (
        <Alert
          text={
            "Perhatikan! Dalam tes TOEFL sebenarnya, audio tidak dapat diputar ulang. Latih kemampuan listening Anda dengan mendengarkan audio hanya satu kali."
          }
          handleClick={() => {
            setAvailable(true);
            setCurrent(0);
            audioRef.current.currentTime = 0;
            setShowAlert(false);
          }}
        />
      ) : null}
      <div className={styles.header}>
        <div>
          <p>LISTENING PRACTICE</p>
          <h4>Listen carefully before answering</h4>
        </div>
        <MdGraphicEq size={20} />
      </div>
      <div>
        <audio
          ref={audioRef}
          src={`/audio/${src}`}
          onEnded={() => {
            setPlaying(false);
            setAvailable(false);
          }}
        />

        <div className={styles.audioPlay}>
          <button
            className="bullet"
            style={{ backgroundColor: "#D3542B", color: "white" }}
            onClick={togglePlay}
          >
            {playing ? <LuPause size={20} /> : <LuPlay size={20} />}
          </button>

          <div>
            <div className={styles.time}>
              <span>{formatTime(current)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className={styles.rel}>
              <div
                className={styles.train}
                style={{
                  width: `${progress}%`,
                }}
              />

              <div className={styles.head} />
            </div>
          </div>
        </div>
        <button
          className={styles.replayBtn}
          onClick={() => {
            if (available) return;
            setShowAlert(true);
          }}
          disabled={available}
        >
          <LuRotateCcw strokeWidth={3} />
          REPLAY
        </button>
      </div>
    </div>
  );
}

function formatTime(seconds) {
  if (!seconds) return "0:00";

  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);

  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function WithAudio({ material }) {
  return (
    <MultipleChoice material={material}>
      <br />
      <AudioPlayer src={material.audio} />
      <br />
    </MultipleChoice>
  );
}

export function WithText({ material }) {
  console.log(material);
  
  return (
    <MultipleChoice material={material}>
      <br />
      <h1 className={styles.text_block}>{material.text_block}</h1>
    </MultipleChoice>
  );
}
