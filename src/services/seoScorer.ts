/**
 * SEO Scorer Service
 * Calculates comprehensive 100-point SEO score breakdown
 */

import { analyzeReadability } from './readability';
import { analyzeKeyphrase } from './keyphrase';

export interface SeoScoreBreakdown {
  total: number; // 0-100
  color: 'green' | 'orange' | 'red'; // green=80+, orange=60-79, red=<60
  status: 'excellent' | 'good' | 'needs_improvement';
  breakdown: {
    title: number; // 0-20
    description: number; // 0-20
    readability: number; // 0-10
    keyphrase: number; // 0-16
    images: number; // 0-15
    schema: number; // 0-15
    technical: number; // 0-4 (base, rest from other factors)
  };
  details: {
    titleLength: boolean;
    descriptionLength: boolean;
    keywordInTitle: boolean;
    keywordInDescription: boolean;
    hasImages: boolean;
    hasSchema: boolean;
  };
  recommendations: string[];
}

export interface ScorerInput {
  metaTitle: string;
  metaDescription: string;
  bodyText: string;
  focusKeyphrase: string;
  h1: string;
  hasImages: boolean;
  imageAltTextCount: number;
  totalImages: number;
  hasSchema: boolean;
  hasOgTags: boolean;
  hasCanonical: boolean;
}

export function calculateSeoScore(input: ScorerInput): SeoScoreBreakdown {
  const recommendations: string[] = [];
  const breakdown = {
    title: 0,
    description: 0,
    readability: 0,
    keyphrase: 0,
    images: 0,
    schema: 0,
    technical: 0,
  };

  // ===== TITLE (20 points) =====
  let titleScore = 0;
  const titleLength = input.metaTitle?.length || 0;
  const details = {
    titleLength: titleLength >= 30 && titleLength <= 60,
    descriptionLength: false,
    keywordInTitle: false,
    keywordInDescription: false,
    hasImages: input.hasImages,
    hasSchema: input.hasSchema,
  };

  if (input.metaTitle) {
    titleScore += 5; // Title exists
    if (titleLength >= 30 && titleLength <= 60) {
      titleScore += 8; // Good length
    } else if (titleLength > 0) {
      titleScore += 3; // Title exists but poor length
    }

    if (
      input.focusKeyphrase &&
      input.metaTitle
        .toLowerCase()
        .includes(input.focusKeyphrase.toLowerCase())
    ) {
      titleScore += 7; // Keyphrase in title
      details.keywordInTitle = true;
    }
  }
  breakdown.title = Math.min(20, titleScore);

  // ===== DESCRIPTION (20 points) =====
  let descriptionScore = 0;
  const descLength = input.metaDescription?.length || 0;
  details.descriptionLength = descLength >= 120 && descLength <= 160;

  if (input.metaDescription) {
    descriptionScore += 5; // Description exists
    if (descLength >= 120 && descLength <= 160) {
      descriptionScore += 8; // Good length
    } else if (descLength > 0) {
      descriptionScore += 3; // Exists but poor length
    }

    if (
      input.focusKeyphrase &&
      input.metaDescription
        .toLowerCase()
        .includes(input.focusKeyphrase.toLowerCase())
    ) {
      descriptionScore += 7; // Keyphrase in description
      details.keywordInDescription = true;
    }
  }
  breakdown.description = Math.min(20, descriptionScore);

  // ===== READABILITY (10 points) =====
  const readabilityMetrics = analyzeReadability(input.bodyText);
  let readabilityScore = 0;

  if (readabilityMetrics.fleschScore >= 60) {
    readabilityScore = 10; // Good readability
  } else if (readabilityMetrics.fleschScore >= 50) {
    readabilityScore = 7;
  } else if (readabilityMetrics.fleschScore >= 30) {
    readabilityScore = 4;
  } else {
    readabilityScore = 1;
  }

  // Penalize high passive voice
  if (readabilityMetrics.passiveVoicePct > 20) {
    readabilityScore = Math.max(0, readabilityScore - 2);
  }

  breakdown.readability = Math.min(10, readabilityScore);

  // ===== KEYPHRASE (16 points) =====
  const keyphraseAnalysis = analyzeKeyphrase(
    input.focusKeyphrase,
    input.metaTitle,
    input.metaDescription,
    input.h1,
    input.bodyText
  );
  breakdown.keyphrase = Math.min(16, keyphraseAnalysis.score);

  // ===== IMAGES (15 points) =====
  let imageScore = 0;
  if (input.hasImages) {
    imageScore = 5; // Has images
    const altTextPercentage =
      input.totalImages > 0
        ? (input.imageAltTextCount / input.totalImages) * 100
        : 0;

    if (altTextPercentage >= 80) {
      imageScore += 10; // Good alt text coverage
    } else if (altTextPercentage >= 50) {
      imageScore += 5;
    } else if (altTextPercentage > 0) {
      imageScore += 2;
    }
  }
  breakdown.images = Math.min(15, imageScore);

  // ===== SCHEMA MARKUP (15 points) =====
  let schemaScore = 0;
  if (input.hasSchema) {
    schemaScore += 15; // Has schema markup
  }
  breakdown.schema = Math.min(15, schemaScore);

  // ===== TECHNICAL SEO (4 points base) =====
  let technicalScore = 4; // Base score
  if (input.hasOgTags) technicalScore += 0; // OG tags are important but counted elsewhere
  if (input.hasCanonical) technicalScore += 0; // Canonical is important but counted elsewhere

  breakdown.technical = technicalScore;

  // ===== GENERATE RECOMMENDATIONS =====
  if (!details.titleLength) {
    recommendations.push('Meta title should be 30-60 characters');
  }
  if (!details.descriptionLength) {
    recommendations.push('Meta description should be 120-160 characters');
  }
  if (!details.keywordInTitle && input.focusKeyphrase) {
    recommendations.push('Add focus keyphrase to meta title');
  }
  if (!details.keywordInDescription && input.focusKeyphrase) {
    recommendations.push('Add focus keyphrase to meta description');
  }
  if (keyphraseAnalysis.densityStatus === 'too_low' && input.focusKeyphrase) {
    recommendations.push('Increase keyphrase density (currently too low)');
  }
  if (keyphraseAnalysis.densityStatus === 'too_high' && input.focusKeyphrase) {
    recommendations.push('Reduce keyphrase density (keyword stuffing detected)');
  }
  if (readabilityMetrics.fleschScore < 60) {
    recommendations.push('Improve readability (use simpler sentences)');
  }
  if (readabilityMetrics.passiveVoicePct > 20) {
    recommendations.push(
      `Reduce passive voice (currently ${readabilityMetrics.passiveVoicePct}%)`
    );
  }
  if (!input.hasImages) {
    recommendations.push('Add images to improve engagement');
  } else if (input.imageAltTextCount === 0) {
    recommendations.push('Add alt text to all images');
  }
  if (!input.hasSchema) {
    recommendations.push('Add schema markup for better SERP display');
  }
  if (!input.hasOgTags) {
    recommendations.push('Add Open Graph tags for social sharing');
  }
  if (!input.hasCanonical) {
    recommendations.push('Add canonical tag to prevent duplicate content');
  }

  // ===== CALCULATE TOTAL SCORE =====
  const total =
    breakdown.title +
    breakdown.description +
    breakdown.readability +
    breakdown.keyphrase +
    breakdown.images +
    breakdown.schema +
    breakdown.technical;

  let color: 'green' | 'orange' | 'red' = 'red';
  let status: 'excellent' | 'good' | 'needs_improvement' = 'needs_improvement';

  if (total >= 80) {
    color = 'green';
    status = 'excellent';
  } else if (total >= 60) {
    color = 'orange';
    status = 'good';
  }

  return {
    total: Math.min(100, total),
    color,
    status,
    breakdown,
    details,
    recommendations,
  };
}
