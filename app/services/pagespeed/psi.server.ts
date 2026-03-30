/**
 * Google PageSpeed Insights API v5 wrapper
 * Fetches Core Web Vitals and performance metrics
 */

export interface PSIResult {
  url: string;
  strategy: 'mobile' | 'desktop';
  performanceScore: number;
  lcpMs: number; // Largest Contentful Paint
  inpMs: number; // Interaction to Next Paint
  clsScore: number; // Cumulative Layout Shift
  fcpMs: number; // First Contentful Paint
  ttfbMs: number; // Time to First Byte
  rawResponse: any;
}

const PSI_API_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

/**
 * Fetch PageSpeed Insights for a URL
 */
export async function fetchPageSpeedInsights(
  url: string,
  strategy: 'mobile' | 'desktop' = 'mobile'
): Promise<PSIResult | null> {
  const apiKey = process.env.PSI_API_KEY;

  if (!apiKey) {
    console.warn('PSI_API_KEY not configured');
    return null;
  }

  try {
    const params = new URLSearchParams({
      url,
      strategy,
      key: apiKey,
      category: 'performance',
    });

    const response = await fetch(`${PSI_API_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`PSI API error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    // Extract metrics from Lighthouse results
    const lighthouse = data.lighthouseResult;
    if (!lighthouse) {
      console.error('No lighthouse results in PSI response');
      return null;
    }

    // Parse metrics
    const metrics = lighthouse.audits;
    const performanceScore = Math.round(
      (lighthouse.categories.performance.score || 0) * 100
    );

    return {
      url,
      strategy,
      performanceScore,
      lcpMs: metrics['largest-contentful-paint']?.numericValue || 0,
      inpMs: metrics['interaction-to-next-paint']?.numericValue || 0,
      clsScore: metrics['cumulative-layout-shift']?.numericValue || 0,
      fcpMs: metrics['first-contentful-paint']?.numericValue || 0,
      ttfbMs: metrics['time-to-first-byte']?.numericValue || 0,
      rawResponse: data,
    };
  } catch (error) {
    console.error('Failed to fetch PSI:', error);
    return null;
  }
}

/**
 * Get Core Web Vitals assessment
 */
export function assessCoreWebVitals(result: PSIResult): {
  lcp: 'good' | 'needs-improvement' | 'poor';
  inp: 'good' | 'needs-improvement' | 'poor';
  cls: 'good' | 'needs-improvement' | 'poor';
} {
  return {
    lcp: result.lcpMs < 2500 ? 'good' : result.lcpMs < 4000 ? 'needs-improvement' : 'poor',
    inp: result.inpMs < 200 ? 'good' : result.inpMs < 500 ? 'needs-improvement' : 'poor',
    cls: result.clsScore < 0.1 ? 'good' : result.clsScore < 0.25 ? 'needs-improvement' : 'poor',
  };
}

/**
 * Format performance score with label
 */
export function getPerformanceLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 50) return 'Needs Improvement';
  return 'Poor';
}

/**
 * Get color for performance score
 */
export function getPerformanceColor(score: number): string {
  if (score >= 90) return '#31a24c'; // Green
  if (score >= 50) return '#f29c35'; // Orange
  return '#e1635c'; // Red
}
