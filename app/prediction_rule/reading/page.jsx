"use client";

import PredictionRuleTemplate from "../components/PredictionRuleTemplate";

export default function ReadingPage() {
  return (
    <PredictionRuleTemplate
      badgeCategory="PREDICTION TOEFL"
      modeType="PREDICTION"
      description="Uji seluruh kemampuan bahasa Inggrismu dalam satu sesi PREDICTION lengkap mencakup Structure, Written Expression, Reading Strategies, Reading for Details, dan Listening Comprehension sesuai format TOEFL."
      durationMinutes="40 Menit"
      topicCount="3 Topik"
      subMaterialCount="36 Sub-Materi"
      startHref="/simulation/reading"
      buttonText="MULAI PREDICTION →"
      materiTheme="red"
      materiTitle="READING"
      materiDuration="40 Menit"
      materiQuestionCount="~36 Soal"
      materiItems={[
        "🔲 Reading Strategis",
        "🔲 Reading For Details",
      ]}
    />
  );
}