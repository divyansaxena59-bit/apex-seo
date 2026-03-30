/**
 * Readability Analysis Service
 * Pure server-side text analysis for Flesch Reading Ease and related metrics
 */

interface ReadabilityMetrics {
  fleschScore: number;
  grade: 'Very Easy' | 'Easy' | 'Standard' | 'Fairly Difficult' | 'Difficult' | 'Very Difficult';
  avgSentenceLength: number;
  passiveVoicePct: number;
  hasTransitionWords: boolean;
  warnings: string[];
}

/**
 * Count syllables in a word using simple heuristics
 * Note: This is an approximation, not 100% accurate
 */
function countSyllables(word: string): number {
  word = word.toLowerCase().trim();
  if (word.length <= 3) return 1;

  // Simple heuristic: count vowel groups
  let count = 0;
  let previousWasVowel = false;
  const vowels = 'aeiouyi';

  for (const char of word) {
    const isVowel = vowels.includes(char);
    if (isVowel && !previousWasVowel) {
      count++;
    }
    previousWasVowel = isVowel;
  }

  // Adjust for silent e
  if (word.endsWith('e')) {
    count--;
  }

  // Adjust for ed, le endings
  if (word.endsWith('ed')) {
    count--;
  }

  return Math.max(1, count);
}

/**
 * Calculate Flesch Reading Ease score
 * Formula: 206.835 - (1.015 × avg_sentence_length) - (84.6 × avg_syllables_per_word)
 */
function calculateFleschScore(
  sentenceCount: number,
  wordCount: number,
  syllableCount: number
): number {
  if (sentenceCount === 0 || wordCount === 0) return 0;

  const avgSentenceLength = wordCount / sentenceCount;
  const avgSyllablesPerWord = syllableCount / wordCount;

  const score =
    206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;

  return Math.max(0, Math.min(100, score));
}

/**
 * Parse text into sentences using basic regex
 */
function parseSentences(text: string): string[] {
  // Split on sentence-ending punctuation
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  return sentences;
}

/**
 * Detect passive voice using regex pattern matching
 * Pattern: was/were/is/are + past participle
 */
function detectPassiveVoice(sentence: string): boolean {
  const passivePattern = /\b(was|were|is|are)\s+\w+ed\b/gi;
  return passivePattern.test(sentence);
}

/**
 * Check for common transition words
 */
function hasTransitionWords(text: string): boolean {
  const transitions = [
    'however',
    'therefore',
    'because',
    'furthermore',
    'moreover',
    'consequently',
    'meanwhile',
    'meanwhile',
    'additionally',
    'also',
    'in addition',
    'as a result',
  ];

  const lowerText = text.toLowerCase();
  return transitions.some(word => lowerText.includes(word));
}

/**
 * Analyze text readability
 */
export function analyzeReadability(text: string): ReadabilityMetrics {
  if (!text || text.trim().length === 0) {
    return {
      fleschScore: 0,
      grade: 'Very Easy',
      avgSentenceLength: 0,
      passiveVoicePct: 0,
      hasTransitionWords: false,
      warnings: ['No text provided'],
    };
  }

  const sentences = parseSentences(text);
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 0);

  // Count syllables
  let syllableCount = 0;
  for (const word of words) {
    // Remove punctuation
    const cleanWord = word.replace(/[^a-z]/g, '');
    if (cleanWord.length > 0) {
      syllableCount += countSyllables(cleanWord);
    }
  }

  // Calculate metrics
  const fleschScore = calculateFleschScore(
    sentences.length,
    words.length,
    syllableCount
  );

  const avgSentenceLength = words.length / Math.max(1, sentences.length);

  // Calculate passive voice percentage
  let passiveCount = 0;
  for (const sentence of sentences) {
    if (detectPassiveVoice(sentence)) {
      passiveCount++;
    }
  }
  const passiveVoicePct = (passiveCount / Math.max(1, sentences.length)) * 100;

  // Determine grade
  let grade: ReadabilityMetrics['grade'];
  if (fleschScore >= 90) grade = 'Very Easy';
  else if (fleschScore >= 80) grade = 'Easy';
  else if (fleschScore >= 70) grade = 'Standard';
  else if (fleschScore >= 60) grade = 'Fairly Difficult';
  else if (fleschScore >= 50) grade = 'Difficult';
  else grade = 'Very Difficult';

  // Generate warnings
  const warnings: string[] = [];
  if (fleschScore < 30) {
    warnings.push('CRITICAL: Content is very difficult to read');
  }
  if (avgSentenceLength > 20) {
    warnings.push(`Avg sentence length ${avgSentenceLength.toFixed(1)} words (ideal: <20)`);
  }
  if (passiveVoicePct > 10) {
    warnings.push(`Passive voice in ${passiveVoicePct.toFixed(1)}% of sentences (ideal: <10%)`);
  }
  if (!hasTransitionWords(text)) {
    warnings.push('No transition words detected - content may lack flow');
  }

  return {
    fleschScore: Math.round(fleschScore * 10) / 10,
    grade,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    passiveVoicePct: Math.round(passiveVoicePct * 10) / 10,
    hasTransitionWords: hasTransitionWords(text),
    warnings,
  };
}

/**
 * Get readability score for a specific piece of content
 * Used for meta descriptions, product titles, etc.
 */
export function getReadabilityScore(text: string): number {
  const metrics = analyzeReadability(text);
  return metrics.fleschScore;
}

/**
 * Get readability grade label
 */
export function getReadabilityGrade(text: string): string {
  const metrics = analyzeReadability(text);
  return metrics.grade;
}
