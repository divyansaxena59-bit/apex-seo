/**
 * Keyphrase Checker Service
 * Analyzes keyphrase placement and density
 */

export interface KeyphraseAnalysis {
  score: number; // 0-16 points
  density: number; // percentage
  densityStatus: 'perfect' | 'too_low' | 'too_high';
  titlePresence: boolean;
  descriptionPresence: boolean;
  h1Presence: boolean;
  firstHundredWordsPresence: boolean;
  placementScore: number; // 0-10
  densityScore: number; // 0-6
}

/**
 * Count keyphrase occurrences in text
 */
function countKeyphraseInText(keyphrase: string, text: string): number {
  if (!keyphrase || !text) return 0;

  const lowerText = text.toLowerCase();
  const lowerKeyphrase = keyphrase.toLowerCase();
  const regex = new RegExp(`\\b${lowerKeyphrase}\\b`, 'gi');

  const matches = lowerText.match(regex);
  return matches ? matches.length : 0;
}

/**
 * Get word count
 */
function getWordCount(text: string): number {
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Analyze keyphrase placement and density
 */
export function analyzeKeyphrase(
  keyphrase: string,
  title: string = '',
  description: string = '',
  h1: string = '',
  bodyText: string = ''
): KeyphraseAnalysis {
  if (!keyphrase || keyphrase.trim().length === 0) {
    return {
      score: 0,
      density: 0,
      densityStatus: 'too_low',
      titlePresence: false,
      descriptionPresence: false,
      h1Presence: false,
      firstHundredWordsPresence: false,
      placementScore: 0,
      densityScore: 0,
    };
  }

  const lowerKeyphrase = keyphrase.toLowerCase();

  // Check placement (10 points max)
  const titlePresence =
    title && title.toLowerCase().includes(lowerKeyphrase);
  const descriptionPresence =
    description && description.toLowerCase().includes(lowerKeyphrase);
  const h1Presence = h1 && h1.toLowerCase().includes(lowerKeyphrase);

  const firstHundredWords = bodyText.split(/\s+/).slice(0, 100).join(' ');
  const firstHundredWordsPresence =
    firstHundredWords &&
    firstHundredWords.toLowerCase().includes(lowerKeyphrase);

  let placementScore = 0;
  if (titlePresence) placementScore += 3;
  if (descriptionPresence) placementScore += 2;
  if (h1Presence) placementScore += 3;
  if (firstHundredWordsPresence) placementScore += 2;

  // Calculate density (6 points max)
  const totalText = `${title} ${description} ${h1} ${bodyText}`;
  const keyphraseCount = countKeyphraseInText(keyphrase, totalText);
  const totalWords = getWordCount(totalText);
  const density =
    totalWords > 0 ? (keyphraseCount / totalWords) * 100 : 0;

  let densityScore = 0;
  let densityStatus: 'perfect' | 'too_low' | 'too_high' = 'too_low';

  // Optimal density: 0.5% - 3%
  if (density === 0) {
    densityScore = 0;
    densityStatus = 'too_low';
  } else if (density >= 0.5 && density <= 3) {
    densityScore = 6;
    densityStatus = 'perfect';
  } else if (density < 0.5) {
    densityScore = Math.round(density * 10); // Scale up
    densityStatus = 'too_low';
  } else {
    // > 3% keyword stuffing
    densityScore = Math.max(0, 6 - Math.round((density - 3) / 2));
    densityStatus = 'too_high';
  }

  const totalScore = Math.min(16, placementScore + densityScore);

  return {
    score: totalScore,
    density: Math.round(density * 100) / 100,
    densityStatus,
    titlePresence,
    descriptionPresence,
    h1Presence,
    firstHundredWordsPresence,
    placementScore,
    densityScore,
  };
}
