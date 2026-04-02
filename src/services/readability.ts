/**
 * Readability Analyzer Service
 * Calculates Flesch Reading Ease, passive voice, sentence length
 */

export interface ReadabilityMetrics {
  fleschScore: number;
  grade: string;
  passiveVoicePct: number;
  avgSentenceLength: number;
  totalWords: number;
  totalSentences: number;
}

/**
 * Calculate Flesch Reading Ease Score
 * Score: 0-100 (higher = easier to read)
 * 90-100: Very Easy (5th grade)
 * 80-89: Easy (6th grade)
 * 70-79: Fairly Easy (7th grade)
 * 60-69: Standard (8th-9th grade)
 * 50-59: Fairly Difficult (10th-12th grade)
 * 30-49: Difficult (College level)
 * 0-29: Very Difficult (College graduate)
 */
function calculateFleschScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = countSyllables(text);

  if (sentences.length === 0 || words.length === 0) return 0;

  const fleschScore =
    206.835 -
    1.015 * (words.length / sentences.length) -
    84.6 * (syllables / words.length);

  return Math.max(0, Math.min(100, Math.round(fleschScore)));
}

/**
 * Count syllables in text (rough estimation)
 */
function countSyllables(text: string): number {
  const words = text.toLowerCase().match(/\b[\w']+\b/g) || [];
  let syllableCount = 0;

  words.forEach(word => {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) {
      syllableCount += 1;
      return;
    }

    // Rough syllable counting
    const vowels = word.match(/[aeiouy]/g) || [];
    let previousWasVowel = false;
    let count = 0;

    for (let char of word) {
      const isVowel = /[aeiouy]/.test(char);
      if (isVowel && !previousWasVowel) {
        count++;
      }
      previousWasVowel = isVowel;
    }

    // Adjust for silent e
    if (word.endsWith('e')) {
      count--;
    }
    if (word.endsWith('le')) {
      count++;
    }

    syllableCount += Math.max(1, count);
  });

  return syllableCount;
}

/**
 * Get grade level based on Flesch score
 */
function getGradeLevel(fleschScore: number): string {
  if (fleschScore >= 90) return '5th Grade (Very Easy)';
  if (fleschScore >= 80) return '6th Grade (Easy)';
  if (fleschScore >= 70) return '7th Grade (Fairly Easy)';
  if (fleschScore >= 60) return '8th-9th Grade (Standard)';
  if (fleschScore >= 50) return '10th-12th Grade (Fairly Difficult)';
  if (fleschScore >= 30) return 'College (Difficult)';
  return 'College Graduate (Very Difficult)';
}

/**
 * Detect passive voice percentage
 */
function detectPassiveVoice(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length === 0) return 0;

  const passivePatterns = [
    /\b(is|are|am|was|were|be|been|being)\s+\w+ed\b/gi,
    /\b(is|are|am|was|were|be|been|being)\s+\w+en\b/gi,
    /\bby\s+\w+/gi, // "by" indicates passive
  ];

  let passiveCount = 0;

  sentences.forEach(sentence => {
    passivePatterns.forEach(pattern => {
      if (pattern.test(sentence)) {
        passiveCount++;
      }
    });
  });

  return Math.round((passiveCount / sentences.length) * 100);
}

/**
 * Main function to analyze readability
 */
export function analyzeReadability(text: string): ReadabilityMetrics {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);

  const fleschScore = calculateFleschScore(text);
  const passiveVoicePct = detectPassiveVoice(text);
  const avgSentenceLength =
    sentences.length > 0 ? Math.round(words.length / sentences.length) : 0;

  return {
    fleschScore,
    grade: getGradeLevel(fleschScore),
    passiveVoicePct,
    avgSentenceLength,
    totalWords: words.length,
    totalSentences: sentences.length,
  };
}
