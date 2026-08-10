"use client";

import PredictionRuleTemplate from "../components/PredictionRuleTemplate";

export default function ListeningPage() {
  return (
    <PredictionRuleTemplate
      badgeCategory="PREDICTION TOEFL"
      modeType="PREDICTION"
      description="Uji seluruh kemampuan bahasa Inggrismu dalam satu sesi PREDICTION lengkap mencakup Structure, Written Expression, Reading Strategies, Reading for Details, dan Listening Comprehension sesuai format TOEFL."
      durationMinutes="25 Menit"
      topicCount="3 Sesi"
      subMaterialCount="36 Sub-Materi"
      startHref="/simulation/listening"
      buttonText="MULAI PREDICTION →"
      materiTheme="green"
      materiTitle="LISTENING"
      materiDuration="25 Menit"
      materiQuestionCount="~36 Soal"
      materiItems={[
        "🔲 Listening to Short Conversation",
        "🔲 Listening to Longer Conversation",
        "🔲 Listening to Talks and Note Taking",
      ]}
    />
  );
}