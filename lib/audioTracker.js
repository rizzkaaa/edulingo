// lib/audioTracker.js

const playedAudios = new Set();

export function isAudioPlayed(audioKey) {
  if (!audioKey) return false;
  if (playedAudios.has(audioKey)) return true;
  if (typeof window !== "undefined") {
    try {
      const stored = JSON.parse(sessionStorage.getItem("edulingo_played_audios") || "[]");
      if (stored.includes(audioKey)) {
        playedAudios.add(audioKey);
        return true;
      }
    } catch {
      // ignore
    }
  }
  return false;
}

export function markAudioAsPlayed(audioKey) {
  if (!audioKey) return;
  playedAudios.add(audioKey);
  if (typeof window !== "undefined") {
    try {
      const stored = JSON.parse(sessionStorage.getItem("edulingo_played_audios") || "[]");
      if (!stored.includes(audioKey)) {
        stored.push(audioKey);
        sessionStorage.setItem("edulingo_played_audios", JSON.stringify(stored));
      }
    } catch {
      // ignore
    }
  }
}

export function resetPlayedAudios() {
  playedAudios.clear();
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem("edulingo_played_audios");
    } catch {
      // ignore
    }
  }
}
