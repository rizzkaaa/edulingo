/**
 * Utility function to calculate TOEFL PBT converted scores and total score.
 */
export function calculateToeflScores({
  listeningCorrect = 0,
  listeningTotal = 36,
  structureCorrect = 0,
  structureTotal = 28,
  readingCorrect = 0,
  readingTotal = 36,
}) {
  const lTotal = listeningTotal > 0 ? listeningTotal : 1;
  const sTotal = structureTotal > 0 ? structureTotal : 1;
  const rTotal = readingTotal > 0 ? readingTotal : 1;

  const listeningPct = Math.min(1, Math.max(0, listeningCorrect / lTotal));
  const structurePct = Math.min(1, Math.max(0, structureCorrect / sTotal));
  const readingPct = Math.min(1, Math.max(0, readingCorrect / rTotal));

  // Converted scores according to standard TOEFL PBT scale
  const listeningConverted = Math.round(31 + listeningPct * (68 - 31));
  const structureConverted = Math.round(31 + structurePct * (68 - 31));
  const readingConverted = Math.round(31 + readingPct * (67 - 31));

  const sumConverted = listeningConverted + structureConverted + readingConverted;
  const stepMultiply = sumConverted * 10;
  let finalToeflScore = Math.round(stepMultiply / 3);

  if (finalToeflScore < 310) finalToeflScore = 310;
  if (finalToeflScore > 677) finalToeflScore = 677;

  return {
    listening: {
      correct: listeningCorrect,
      total: lTotal,
      percentage: Math.round(listeningPct * 100),
      converted: listeningConverted,
    },
    structure: {
      correct: structureCorrect,
      total: sTotal,
      percentage: Math.round(structurePct * 100),
      converted: structureConverted,
    },
    reading: {
      correct: readingCorrect,
      total: rTotal,
      percentage: Math.round(readingPct * 100),
      converted: readingConverted,
    },
    calculationSteps: {
      sumConverted,
      stepMultiply,
      finalToeflScore,
    },
    finalToeflScore,
  };
}
