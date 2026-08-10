"use client";

import PredictionRuleTemplate from "../components/PredictionRuleTemplate";

export default function StructurePage() {
  return (
    <PredictionRuleTemplate
      badgeCategory="PREDICTION TOEFL"
      modeType="PREDICTION"
      description="Uji seluruh kemampuan bahasa Inggrismu dalam satu sesi PREDICTION lengkap mencakup Structure, Written Expression, Reading Strategies, Reading for Details, dan Listening Comprehension sesuai format TOEFL."
      durationMinutes="17 Menit"
      topicCount="3 Topik"
      subMaterialCount="28 Sub-Materi"
      startHref="/simulation/structure"
      buttonText="MULAI PREDICTION →"
      materiTheme="orange"
      materiTitle="STRUCTURE"
      materiDuration="17 Menit"
      materiQuestionCount="~28 Soal"
      materiItems={[
        "🔲 Structure Part 1",
        "🔲 Structure Part 2",
        "🔲 Written Expression Part 1",
        "🔲 Written Expression Part 2",
      ]}
    />
  );
}