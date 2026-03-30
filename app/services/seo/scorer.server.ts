/**
 * SEO Score Calculator
 * Calculates overall SEO score (0-100) based on multiple factors
 */

import { analyzeReadability, getReadabilityGrade } from './readability.server';
import { analyzeKeyphrase } from './keyphrase.server';

export interface SeoScoreBreakdown {
  title: number;
  description: number;
  images: number;
  schema: number;
  technical: number;
  readability: number;
  keyphrase: number;
  total: number;
}

export interface ScoringInput {
  // Meta tags
  metaTitle?: string;
  metaDescription?: string;

  // Content
  h1?: string;
  bodyText?: string;
  productTitle?: string;

  // Images
  hasAltText?: boolean;
  imagesWithAlt?: number;
  totalImages?: number;

  // Schema & Technical
  hasProductSchema?: boolean;
  hasOrganizationSchema?: boolean;
  hasBreadcrumbs?: boolean;
  canonicalUrl?: string;
  hasNoIndex?: boolean;
  hasOgTags?: boolean;

  // Keyphrase
  focusKeyphrase?: string;
}

/**
 * Score title (max 20 pts)
 */
function scoreTitle(title: string | undefined, keyphrase: string | undefined): number {
  let points = 0;

  // Exists: 10 pts
  if (title && title.trim().length > 0) {
    points += 10;

    // Optimal length (30-70 chars): 8 pts
    if (title.length >= 30 && title.length <= 70) {
      points += 8;
    } else if (title.length >= 20 && title.length <= 80) {
      points += 4; // Partial credit
    }

    // Contains keyphrase: 2 pts
    if (
      keyphrase &&
      title.toLowerCase().includes(keyphrase.toLowerCase())
    ) {
      points += 2;
    }
  }

  return Math.min(points, 20);
}

/**
 * Score description (max 20 pts)
 */
function scoreDescription(
  description: string | undefined,
  keyphrase: string | undefined
): number {
  let points = 0;

  // Exists: 10 pts
  if (description && description.trim().length > 0) {
    points += 10;

    // Optimal length (70-160 chars): 8 pts
    if (description.length >= 70 && description.length <= 160) {
      points += 8;
    } else if (description.length >= 50 && description.length <= 200) {
      points += 4; // Partial credit
    }

    // Contains keyphrase: 2 pts
    if (
      keyphrase &&
      description.toLowerCase().includes(keyphrase.toLowerCase())
    ) {
      points += 2;
    }
  }

  return Math.min(points, 20);
}

/**
 * Score images (max 15 pts)
 */
function scoreImages(
  hasAltText?: boolean,
  imagesWithAlt?: number,
  totalImages?: number
): number {
  if (!totalImages || totalImages === 0) {
    return 0; // No images, no points
  }

  let points = 0;

  // All images have alt text: 10 pts
  if (hasAltText || (imagesWithAlt === totalImages && totalImages > 0)) {
    points += 10;

    // Descriptive alt text (assume if all present): 5 pts
    points += 5;
  } else if (imagesWithAlt && imagesWithAlt > 0) {
    // Partial credit: some images have alt
    const pct = imagesWithAlt / totalImages;
    points += Math.round(15 * pct);
  }

  return Math.min(points, 15);
}

/**
 * Score schema markup (max 15 pts)
 */
function scoreSchema(
  hasProductSchema?: boolean,
  hasOrganizationSchema?: boolean,
  hasBreadcrumbs?: boolean
): number {
  let points = 0;

  if (hasProductSchema) points += 8;
  if (hasOrganizationSchema) points += 4;
  if (hasBreadcrumbs) points += 3;

  return Math.min(points, 15);
}

/**
 * Score technical SEO (max 15 pts)
 */
function scoreTechnical(
  canonicalUrl?: string,
  hasNoIndex?: boolean,
  hasOgTags?: boolean
): number {
  let points = 0;

  if (canonicalUrl) points += 8;
  if (!hasNoIndex) points += 4;
  if (hasOgTags) points += 3;

  return Math.min(points, 15);
}

/**
 * Score readability (max 10 pts)
 */
function scoreReadability(bodyText?: string): number {
  if (!bodyText || bodyText.trim().length === 0) {
    return 0;
  }

  const metrics = analyzeReadability(bodyText);

  // Flesch >= 60: 5 pts
  let points = 0;
  if (metrics.fleschScore >= 60) {
    points += 5;
  } else if (metrics.fleschScore >= 50) {
    points += 3;
  }

  // Passive voice <= 10%: 3 pts
  if (metrics.passiveVoicePct <= 10) {
    points += 3;
  }

  // Sentence length <= 20 words: 2 pts
  if (metrics.avgSentenceLength <= 20) {
    points += 2;
  }

  return Math.min(points, 10);
}

/**
 * Score keyphrase (max 5 pts)
 */
function scoreKeyphrase(
  keyphrase: string | undefined,
  title: string | undefined,
  description: string | undefined,
  h1: string | undefined,
  bodyText: string | undefined
): number {
  if (!keyphrase) {
    return 0;
  }

  const analysis = analyzeKeyphrase(keyphrase, title, description, h1, bodyText);

  // Simple scoring: award points based on analysis score
  // Analysis score is out of 16, we want 0-5 here
  return Math.round((analysis.score / 16) * 5);
}

/**
 * Calculate overall SEO score
 */
export function calculateSeoScore(input: ScoringInput): SeoScoreBreakdown {
  const titleScore = scoreTitle(input.metaTitle, input.focusKeyphrase);
  const descriptionScore = scoreDescription(input.metaDescription, input.focusKeyphrase);
  const imagesScore = scoreImages(
    input.hasAltText,
    input.imagesWithAlt,
    input.totalImages
  );
  const schemaScore = scoreSchema(
    input.hasProductSchema,
    input.hasOrganizationSchema,
    input.hasBreadcrumbs
  );
  const technicalScore = scoreTechnical(
    input.canonicalUrl,
    input.hasNoIndex,
    input.hasOgTags
  );
  const readabilityScore = scoreReadability(input.bodyText);
  const keyphraseScore = scoreKeyphrase(
    input.focusKeyphrase,
    input.metaTitle,
    input.metaDescription,
    input.h1,
    input.bodyText
  );

  const total =
    titleScore +
    descriptionScore +
    imagesScore +
    schemaScore +
    technicalScore +
    readabilityScore +
    keyphraseScore;

  return {
    title: titleScore,
    description: descriptionScore,
    images: imagesScore,
    schema: schemaScore,
    technical: technicalScore,
    readability: readabilityScore,
    keyphrase: keyphraseScore,
    total: Math.min(total, 100),
  };
}

/**
 * Get simplified score label (0-100)
 */
export function getScoraLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  if (score >= 30) return 'Poor';
  return 'Very Poor';
}

/**
 * Get color for score display
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'critical';
}
