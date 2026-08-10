/**
 * Official TOEFL ITP / PBT Score Conversion Tables.
 * 
 * - Section 1 (Listening Comprehension, 50 questions): 0 -> 24, 50 -> 68
 * - Section 2 (Structure & Written Expression, 40 questions): 0 -> 20, 40 -> 68
 * - Section 3 (Reading Comprehension, 50 questions): 0 -> 21, 50 -> 67
 */

export const LISTENING_CONVERSION_TABLE = [
  24, 25, 26, 27, 28, 29, 30, 31, 32, 32, // 0 - 9
  33, 35, 37, 37, 38, 41, 41, 42, 43, 44, // 10 - 19
  45, 45, 46, 47, 47, 48, 48, 49, 49, 50, // 20 - 29
  51, 51, 52, 52, 53, 54, 54, 55, 56, 57, // 30 - 39
  57, 58, 59, 60, 61, 62, 63, 65, 66, 67, // 40 - 49
  68                                      // 50
];

export const STRUCTURE_CONVERSION_TABLE = [
  20, 20, 21, 22, 23, 25, 26, 27, 29, 31, // 0 - 9
  33, 35, 36, 37, 38, 40, 40, 41, 42, 43, // 10 - 19
  44, 45, 46, 47, 48, 49, 50, 51, 52, 53, // 20 - 29
  54, 55, 56, 57, 58, 60, 61, 63, 65, 67, // 30 - 39
  68                                      // 40
];

export const READING_CONVERSION_TABLE = [
  21, 22, 23, 23, 24, 25, 26, 27, 28, 28, // 0 - 9
  29, 30, 31, 32, 34, 35, 36, 37, 38, 39, // 10 - 19
  40, 41, 42, 43, 43, 44, 45, 46, 46, 47, // 20 - 29
  48, 48, 49, 50, 51, 52, 52, 53, 54, 54, // 30 - 39
  55, 56, 57, 58, 59, 60, 61, 63, 65, 66, // 40 - 49
  67                                      // 50
];

/**
 * Utility function to calculate TOEFL PBT/ITP converted scores and total score
 * using the official conversion tables directly by number of correct answers.
 */
export function calculateToeflScores({
  listeningCorrect = 0,
  listeningTotal = 50,
  structureCorrect = 0,
  structureTotal = 40,
  readingCorrect = 0,
  readingTotal = 50,
}) {
  const lTotal = listeningTotal > 0 ? listeningTotal : 1;
  const sTotal = structureTotal > 0 ? structureTotal : 1;
  const rTotal = readingTotal > 0 ? readingTotal : 1;

  const listeningPct = Math.min(1, Math.max(0, listeningCorrect / lTotal));
  const structurePct = Math.min(1, Math.max(0, structureCorrect / sTotal));
  const readingPct = Math.min(1, Math.max(0, readingCorrect / rTotal));

  // Ambil langsung nilai konversi berdasarkan jumlah jawaban benar
  const rawListening = Math.min(50, Math.max(0, Math.round(listeningCorrect)));
  const rawStructure = Math.min(40, Math.max(0, Math.round(structureCorrect)));
  const rawReading = Math.min(50, Math.max(0, Math.round(readingCorrect)));

  const listeningConverted = LISTENING_CONVERSION_TABLE[rawListening] ?? 24;
  const structureConverted = STRUCTURE_CONVERSION_TABLE[rawStructure] ?? 20;
  const readingConverted = READING_CONVERSION_TABLE[rawReading] ?? 21;

  const sumConverted = listeningConverted + structureConverted + readingConverted;
  const stepMultiply = sumConverted * 10;
  let finalToeflScore = Math.round(stepMultiply / 3);

  if (finalToeflScore > 677) finalToeflScore = 677;

  return {
    listening: {
      correct: listeningCorrect,
      total: lTotal,
      rawEquiv: rawListening,
      percentage: Math.round(listeningPct * 100),
      converted: listeningConverted,
    },
    structure: {
      correct: structureCorrect,
      total: sTotal,
      rawEquiv: rawStructure,
      percentage: Math.round(structurePct * 100),
      converted: structureConverted,
    },
    reading: {
      correct: readingCorrect,
      total: rTotal,
      rawEquiv: rawReading,
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
