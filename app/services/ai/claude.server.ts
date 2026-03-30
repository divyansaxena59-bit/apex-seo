import Anthropic from '@anthropic-ai/sdk';

/**
 * Claude API wrapper for SEO optimization
 * Requires ANTHROPIC_API_KEY environment variable
 */

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  : null;

/**
 * Generate SEO-optimized meta title
 */
export async function generateMetaTitle(
  productTitle: string,
  productDescription: string,
  targetKeyword?: string,
  shopName?: string
): Promise<string> {
  if (!client) {
    console.warn('Claude API not configured');
    return productTitle;
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: `Generate an SEO-optimized meta title for this product.

Product Title: ${productTitle}
Description: ${productDescription.slice(0, 300)}
Target Keyword: ${targetKeyword || 'not specified'}
Shop Name: ${shopName || 'not specified'}

Requirements:
- 50-60 characters maximum
- Include primary keyword near the start
- Natural, compelling language
- No clickbait or ALL CAPS
- Return ONLY the title, no explanation`,
        },
      ],
    });

    const text =
      message.content[0].type === 'text' ? message.content[0].text : '';
    return text.trim().slice(0, 70);
  } catch (error) {
    console.error('Claude API error:', error);
    return productTitle;
  }
}

/**
 * Generate SEO-optimized meta description
 */
export async function generateMetaDescription(
  productTitle: string,
  productDescription: string,
  targetKeyword?: string
): Promise<string> {
  if (!client) {
    console.warn('Claude API not configured');
    return '';
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: `Generate an SEO-optimized meta description for this product.

Product Title: ${productTitle}
Description: ${productDescription.slice(0, 500)}
Target Keyword: ${targetKeyword || 'not specified'}

Requirements:
- 70-160 characters maximum
- Include target keyword naturally
- Include main product benefits
- Clear call-to-action
- Return ONLY the description, no explanation`,
        },
      ],
    });

    const text =
      message.content[0].type === 'text' ? message.content[0].text : '';
    return text.trim().slice(0, 160);
  } catch (error) {
    console.error('Claude API error:', error);
    return '';
  }
}

/**
 * Generate AI fix suggestions for audit items
 */
export async function generateFixSuggestion(
  checkTitle: string,
  checkDescription: string,
  affectedContent?: string
): Promise<string> {
  if (!client) {
    console.warn('Claude API not configured');
    return 'Please check your content manually.';
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `You are an SEO expert. Provide a clear, actionable fix suggestion.

SEO Issue: ${checkTitle}
Details: ${checkDescription}
${affectedContent ? `Current Content: ${affectedContent.slice(0, 200)}` : ''}

Provide:
1. Why this matters (1 sentence)
2. Step-by-step fix (2-3 bullet points)
3. Expected outcome

Keep it brief and actionable.`,
        },
      ],
    });

    const text =
      message.content[0].type === 'text' ? message.content[0].text : '';
    return text.trim();
  } catch (error) {
    console.error('Claude API error:', error);
    return 'Unable to generate suggestion. Please check manually.';
  }
}

/**
 * Expand keyphrase to include related word forms
 */
export async function expandKeyphraseWordForms(
  keyphrase: string
): Promise<string[]> {
  if (!client) {
    return [keyphrase];
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: `Generate word forms and synonyms for this keyphrase.

Keyphrase: ${keyphrase}

Provide:
- Singular/plural forms
- Different tenses (if verb)
- Common synonyms
- Related variations

Return as comma-separated list. Example: "shoe,shoes,running shoe,athletic shoe"`,
        },
      ],
    });

    const text =
      message.content[0].type === 'text' ? message.content[0].text : '';
    return text.split(',').map((s) => s.trim());
  } catch (error) {
    console.error('Claude API error:', error);
    return [keyphrase];
  }
}
