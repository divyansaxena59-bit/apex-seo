/**
 * Focus Keyphrase Checker Service
 * Analyzes keyphrase presence and density
 */

export interface KeyphraseAnalysis {
  score: number; // 0-16
  inTitle: boolean;
  inDescription: boolean;
  inH1: boolean;
  inFirstHundredWords: boolean;
  density: number; // percentage
  densityStatus: 'too_low' | 'perfect' | 'too_high';
  wordFormsFound: string[];
  warnings: string[];
}

/**
 * Normalize text for comparison (lowercase, trim)
 */
function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

/**
 * Check if keyphrase is present in text
 */
function isPhraseInText(phrase: string, text: string): boolean {
  const normalized = normalizeText(phrase);
  const textNormalized = normalizeText(text);
  return textNormalized.includes(normalized);
}

/**
 * Extract first N words from text
 */
function getFirstNWords(text: string, n: number): string {
  const words = text.split(/\s+/).slice(0, n);
  return words.join(' ');
}

/**
 * Count word occurrences in text
 */
function countOccurrences(phrase: string, text: string): number {
  const normalized = normalizeText(phrase);
  const textNormalized = normalizeText(text);
  const regex = new RegExp(`\\b${normalized}\\b`, 'g');
  const matches = textNormalized.match(regex);
  return matches ? matches.length : 0;
}

/**
 * Calculate keyphrase density as percentage
 */
function calculateDensity(keyphrase: string, text: string): number {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return 0;

  const count = countOccurrences(keyphrase, text);
  const density = (count / words.length) * 100;

  return Math.round(density * 100) / 100; // Round to 2 decimals
}

/**
 * Analyze focus keyphrase in content
 */
export function analyzeKeyphrase(
  keyphrase: string | undefined,
  title: string | undefined,
  description: string | undefined,
  h1: string | undefined,
  bodyText: string | undefined
): KeyphraseAnalysis {
  if (!keyphrase || !keyphrase.trim()) {
    return {
      score: 0,
      inTitle: false,
      inDescription: false,
      inH1: false,
      inFirstHundredWords: false,
      density: 0,
      densityStatus: 'too_low',
      wordFormsFound: [],
      warnings: ['No focus keyphrase set'],
    };
  }

  let score = 0;
  const warnings: string[] = [];
  const wordFormsFound: string[] = [];

  // Check title (3 pts)
  const inTitle = title ? isPhraseInText(keyphrase, title) : false;
  if (inTitle) {
    score += 3;
  } else {
    warnings.push(`Keyphrase not in SEO title`);
  }

  // Check description (3 pts)
  const inDescription = description ? isPhraseInText(keyphrase, description) : false;
  if (inDescription) {
    score += 3;
  } else {
    warnings.push(`Keyphrase not in meta description`);
  }

  // Check H1 (3 pts)
  const inH1 = h1 ? isPhraseInText(keyphrase, h1) : false;
  if (inH1) {
    score += 3;
  } else {
    warnings.push(`Keyphrase not in product title (H1)`);
  }

  // Check first 100 words (2 pts)
  const allText = [title, description, h1, bodyText].filter(Boolean).join(' ');
  const firstHundred = getFirstNWords(allText, 100);
  const inFirstHundredWords = isPhraseInText(keyphrase, firstHundred);
  if (inFirstHundredWords) {
    score += 2;
  }

  // Analyze density (3 pts)
  const density = bodyText ? calculateDensity(keyphrase, bodyText) : 0;
  let densityStatus: 'too_low' | 'perfect' | 'too_high';

  if (density < 0.5) {
    densityStatus = 'too_low';
    warnings.push(`Keyphrase density ${density}% - below ideal 0.5-3%`);
  } else if (density <= 3) {
    densityStatus = 'perfect';
    score += 3; // Full points for perfect density
  } else {
    densityStatus = 'too_high';
    warnings.push(`Keyphrase density ${density}% - keyword stuffing detected (max 3%)`);
  }

  return {
    score: Math.min(score, 16), // Max 16 points
    inTitle,
    inDescription,
    inH1,
    inFirstHundredWords,
    density,
    densityStatus,
    wordFormsFound,
    warnings,
  };
}

/**
 * Get keyphrase score percentage for UI display
 */
export function getKeyphraseScore(
  keyphrase: string | undefined,
  title: string | undefined,
  description: string | undefined,
  h1: string | undefined,
  bodyText: string | undefined
): number {
  const analysis = analyzeKeyphrase(keyphrase, title, description, h1, bodyText);
  return Math.round((analysis.score / 16) * 100);
}

/**
 * Validate keyphrase (not too long, not too short)
 */
export function validateKeyphrase(keyphrase: string): {
  valid: boolean;
  message?: string;
} {
  const words = keyphrase.trim().split(/\s+/).length;

  if (words < 1) {
    return { valid: false, message: 'Keyphrase must contain at least 1 word' };
  }

  if (words > 5) {
    return {
      valid: true,
      message: 'Keyphrase is long (5+ words) - may be harder to rank for',
    };
  }

  return { valid: true };
}
