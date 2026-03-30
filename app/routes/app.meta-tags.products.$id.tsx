import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from '@react-router/node';
import { useLoaderData, Form, useActionData } from '@react-router/react';
import {
  Page,
  Card,
  FormLayout,
  TextField,
  Button,
  Box,
  Divider,
  Text,
  Grid,
  Banner,
} from '@shopify/polaris';
import shopify from '../shopify.server';
import { prisma } from '../db.server';
import { calculateSeoScore } from '../services/seo/scorer.server';
import { analyzeReadability } from '../services/seo/readability.server';
import { analyzeKeyphrase } from '../services/seo/keyphrase.server';
import { getScoreColor, getScoreLabel } from '../utils/seo-score';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const shopifyData = await shopify.validate(request);

  if (!shopifyData.session) {
    return shopify.unauthorized();
  }

  const resourceId = params.id;
  if (!resourceId) {
    throw new Response('Product not found', { status: 404 });
  }

  // Fetch SEO record (or create empty one)
  let record = await prisma.seoRecord.findUnique({
    where: {
      shopId_resourceType_resourceId: {
        shopId: shopifyData.session.shop,
        resourceType: 'PRODUCT',
        resourceId,
      },
    },
  });

  if (!record) {
    record = await prisma.seoRecord.create({
      data: {
        shopId: shopifyData.session.shop,
        resourceType: 'PRODUCT',
        resourceId,
        resourceTitle: 'Product',
      },
    });
  }

  return json({
    record,
    shop: shopifyData.session.shop,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const shopifyData = await shopify.validate(request);

  if (!shopifyData.session) {
    return shopify.unauthorized();
  }

  if (request.method === 'POST') {
    const formData = await request.formData();
    const resourceId = params.id;

    const metaTitle = formData.get('metaTitle') as string;
    const metaDescription = formData.get('metaDescription') as string;
    const focusKeyphrase = formData.get('focusKeyphrase') as string;
    const ogTitle = formData.get('ogTitle') as string;
    const ogDescription = formData.get('ogDescription') as string;

    // Calculate scores
    const readabilityMetrics = analyzeReadability(metaDescription);
    const keyphraseAnalysis = analyzeKeyphrase(
      focusKeyphrase,
      metaTitle,
      metaDescription,
      '',
      ''
    );

    const seoScore = calculateSeoScore({
      metaTitle,
      metaDescription,
      focusKeyphrase,
      bodyText: '',
      hasProductSchema: true,
      hasOgTags: !!ogTitle,
    });

    // Update record
    const updated = await prisma.seoRecord.upsert({
      where: {
        shopId_resourceType_resourceId: {
          shopId: shopifyData.session.shop,
          resourceType: 'PRODUCT',
          resourceId: resourceId!,
        },
      },
      update: {
        metaTitle,
        metaDescription,
        focusKeyphrase,
        ogTitle,
        ogDescription,
        readabilityScore: readabilityMetrics.fleschScore,
        readabilityGrade: readabilityMetrics.grade,
        passiveVoicePct: readabilityMetrics.passiveVoicePct,
        keyphraseScore: keyphraseAnalysis.score,
        seoScore: seoScore.total,
        updatedAt: new Date(),
      },
      create: {
        shopId: shopifyData.session.shop,
        resourceType: 'PRODUCT',
        resourceId: resourceId!,
        metaTitle,
        metaDescription,
        focusKeyphrase,
        ogTitle,
        ogDescription,
        readabilityScore: readabilityMetrics.fleschScore,
        readabilityGrade: readabilityMetrics.grade,
        passiveVoicePct: readabilityMetrics.passiveVoicePct,
        keyphraseScore: keyphraseAnalysis.score,
        seoScore: seoScore.total,
      },
    });

    return json({
      success: true,
      record: updated,
      readability: readabilityMetrics,
      keyphrase: keyphraseAnalysis,
      score: seoScore,
    });
  }

  return json({});
}

export default function ProductEditor() {
  const { record } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const readability = actionData?.readability;
  const keyphrase = actionData?.keyphrase;
  const scoreBreakdown = actionData?.score;

  return (
    <Page title={`Edit Meta Tags - ${record.resourceTitle}`}>
      {actionData?.success && (
        <Banner tone="success">Product meta tags saved successfully!</Banner>
      )}

      <Form method="post">
        <FormLayout>
          {/* Meta Tags Section */}
          <Card>
            <Box padding="400">
              <Text variant="headingMd">Meta Tags</Text>
              <Divider />

              <Box marginTop="400">
                <TextField
                  label="Meta Title"
                  name="metaTitle"
                  defaultValue={record.metaTitle || ''}
                  placeholder="SEO title (50-60 chars)"
                  maxLength={70}
                  helpText={`${record.metaTitle?.length || 0}/70 characters`}
                />
              </Box>

              <Box marginTop="400">
                <TextField
                  label="Meta Description"
                  name="metaDescription"
                  defaultValue={record.metaDescription || ''}
                  placeholder="SEO description (70-160 chars)"
                  multiline={3}
                  maxLength={160}
                  helpText={`${record.metaDescription?.length || 0}/160 characters`}
                />
              </Box>

              <Box marginTop="400">
                <TextField
                  label="Focus Keyphrase"
                  name="focusKeyphrase"
                  defaultValue={record.focusKeyphrase || ''}
                  placeholder="Main keyword (e.g., 'running shoes')"
                  helpText="The main keyword you want to rank for"
                />
              </Box>
            </Box>
          </Card>

          {/* Open Graph Section */}
          <Card>
            <Box padding="400">
              <Text variant="headingMd">Open Graph (Social Preview)</Text>
              <Divider />

              <Box marginTop="400">
                <TextField
                  label="OG Title"
                  name="ogTitle"
                  defaultValue={record.ogTitle || ''}
                  placeholder="Social media title"
                />
              </Box>

              <Box marginTop="400">
                <TextField
                  label="OG Description"
                  name="ogDescription"
                  defaultValue={record.ogDescription || ''}
                  placeholder="Social media description"
                  multiline={2}
                />
              </Box>
            </Box>
          </Card>

          {/* Readability Section */}
          {readability && (
            <Card>
              <Box padding="400">
                <Text variant="headingMd">📖 Readability</Text>
                <Divider />

                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 3, xl: 3 }}>
                    <Box>
                      <Text variant="bodySm" tone="subdued">
                        Flesch Score
                      </Text>
                      <Text variant="heading2xl">{readability.fleschScore}</Text>
                      <Text variant="bodySm">{readability.grade}</Text>
                    </Box>
                  </Grid.Cell>

                  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 3, xl: 3 }}>
                    <Box>
                      <Text variant="bodySm" tone="subdued">
                        Avg Sentence Length
                      </Text>
                      <Text variant="heading2xl">
                        {readability.avgSentenceLength.toFixed(1)}
                      </Text>
                      <Text variant="bodySm">words</Text>
                    </Box>
                  </Grid.Cell>

                  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 3, xl: 3 }}>
                    <Box>
                      <Text variant="bodySm" tone="subdued">
                        Passive Voice
                      </Text>
                      <Text variant="heading2xl">
                        {readability.passiveVoicePct.toFixed(1)}%
                      </Text>
                      <Text variant="bodySm">of sentences</Text>
                    </Box>
                  </Grid.Cell>
                </Grid>

                {readability.warnings.length > 0 && (
                  <Box marginTop="400">
                    <Text variant="bodySm" tone="warning">
                      ⚠️ {readability.warnings.join(', ')}
                    </Text>
                  </Box>
                )}
              </Box>
            </Card>
          )}

          {/* Keyphrase Section */}
          {keyphrase && (
            <Card>
              <Box padding="400">
                <Text variant="headingMd">🔍 Keyphrase Analysis</Text>
                <Divider />

                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 3, xl: 3 }}>
                    <Box>
                      <Text variant="bodySm" tone="subdued">
                        Score
                      </Text>
                      <Text variant="heading2xl">
                        {keyphrase.score}/16
                      </Text>
                    </Box>
                  </Grid.Cell>

                  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 3, xl: 3 }}>
                    <Box>
                      <Text variant="bodySm" tone="subdued">
                        Density
                      </Text>
                      <Text variant="heading2xl">
                        {keyphrase.density.toFixed(2)}%
                      </Text>
                      <Text variant="bodySm">({keyphrase.densityStatus})</Text>
                    </Box>
                  </Grid.Cell>
                </Grid>

                {keyphrase.warnings.length > 0 && (
                  <Box marginTop="400">
                    <Text variant="bodySm" tone="warning">
                      {keyphrase.warnings.map((w: string, i: number) => (
                        <div key={i}>⚠️ {w}</div>
                      ))}
                    </Text>
                  </Box>
                )}
              </Box>
            </Card>
          )}

          {/* Overall Score */}
          {scoreBreakdown && (
            <Card>
              <Box padding="400">
                <Text variant="headingMd">📊 Overall SEO Score</Text>
                <Divider />

                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Box>
                      <Text variant="bodySm" tone="subdued">
                        Total Score
                      </Text>
                      <Text variant="heading2xl">
                        {scoreBreakdown.total}
                      </Text>
                      <Text variant="bodySm">
                        {getScoreLabel(scoreBreakdown.total)}
                      </Text>
                    </Box>
                  </Grid.Cell>

                  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Box>
                      <Text variant="bodySm">Title: {scoreBreakdown.title}</Text>
                      <Text variant="bodySm">
                        Description: {scoreBreakdown.description}
                      </Text>
                      <Text variant="bodySm">
                        Readability: {scoreBreakdown.readability}
                      </Text>
                      <Text variant="bodySm">
                        Keyphrase: {scoreBreakdown.keyphrase}
                      </Text>
                    </Box>
                  </Grid.Cell>
                </Grid>
              </Box>
            </Card>
          )}

          {/* Save Button */}
          <Box>
            <Button submit variant="primary">
              Save Meta Tags
            </Button>
          </Box>
        </FormLayout>
      </Form>
    </Page>
  );
}
