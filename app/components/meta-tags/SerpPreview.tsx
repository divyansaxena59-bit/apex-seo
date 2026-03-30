import React from 'react';
import { Box, Card, Text } from '@shopify/polaris';

interface SerpPreviewProps {
  title?: string;
  description?: string;
  url?: string;
}

/**
 * SERP Preview Component
 * Shows how meta tags will appear in Google Search Results
 */
export default function SerpPreview({
  title = 'Page Title',
  description = 'This is your meta description that appears below the title...',
  url = 'example.com › category › page',
}: SerpPreviewProps) {
  return (
    <Card>
      <Box padding="400">
        <Text variant="bodySm" tone="subdued">
          Google Search Preview
        </Text>

        <Box marginTop="400" paddingInline="400" paddingBlockStart="400">
          {/* URL */}
          <Text
            variant="bodySm"
            tone="subdued"
            as="p"
            style={{ fontSize: '12px', color: '#006621', marginBottom: '4px' }}
          >
            {url}
          </Text>

          {/* Title */}
          <Text
            variant="headingSm"
            as="h3"
            style={{
              fontSize: '18px',
              color: '#1a0dff',
              marginBottom: '4px',
              textDecoration: 'underline',
              wordWrap: 'break-word',
              maxWidth: '600px',
            }}
          >
            {title || 'Your page title'}
          </Text>

          {/* Description */}
          <Text
            variant="bodySm"
            as="p"
            style={{
              fontSize: '14px',
              color: '#545454',
              lineHeight: '1.6',
              marginBottom: '0',
              wordWrap: 'break-word',
              maxWidth: '600px',
            }}
          >
            {description || 'Your meta description'}
          </Text>
        </Box>

        {/* Character Counts */}
        <Box marginTop="400" paddingTop="400">
          <Text variant="bodySm" tone="subdued">
            <span style={{ marginRight: '16px' }}>
              Title: {title?.length || 0}/60 chars
            </span>
            <span>
              Description: {description?.length || 0}/160 chars
            </span>
          </Text>
        </Box>

        {/* Recommendations */}
        <Box marginTop="400">
          {(!title || title.length < 30) && (
            <Text variant="bodySm" tone="warning">
              ⚠️ Title is too short (aim for 50-60 characters)
            </Text>
          )}
          {title && title.length > 70 && (
            <Text variant="bodySm" tone="warning">
              ⚠️ Title is too long (will be cut off in Google)
            </Text>
          )}

          {(!description || description.length < 70) && (
            <Text variant="bodySm" tone="warning">
              ⚠️ Description is too short (aim for 70-160 characters)
            </Text>
          )}
          {description && description.length > 160 && (
            <Text variant="bodySm" tone="warning">
              ⚠️ Description is too long (will be cut off in Google)
            </Text>
          )}
        </Box>
      </Box>
    </Card>
  );
}
