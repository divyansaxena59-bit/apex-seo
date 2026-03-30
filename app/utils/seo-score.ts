/**
 * SEO Score utilities for frontend display
 */

export function getScoreColor(score: number): string {
  if (score >= 80) return '#31a24c'; // Green
  if (score >= 60) return '#f29c35'; // Orange
  if (score >= 40) return '#e1635c'; // Red
  return '#6d7175'; // Gray
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  if (score >= 20) return 'Poor';
  return 'Very Poor';
}

export function getScorePercentage(score: number): number {
  return Math.min(Math.max(score, 0), 100);
}

export function getGradeFromScore(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}
