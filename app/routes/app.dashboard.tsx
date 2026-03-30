import { json, type LoaderFunctionArgs } from '@react-router/node';
import { useLoaderData } from '@react-router/react';
import {
  Page,
  Card,
  Grid,
  Text,
  Box,
  Divider,
} from '@shopify/polaris';
import shopify from '../shopify.server';
import { prisma } from '../db.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const shopifyData = await shopify.validate(request);

  if (!shopifyData.session) {
    return shopify.unauthorized();
  }

  const shop = await prisma.shop.findUnique({
    where: { id: shopifyData.session.shop },
    include: {
      seoRecords: {
        take: 100,
      },
      auditReports: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  const totalRecords = await prisma.seoRecord.count({
    where: { shopId: shopifyData.session.shop },
  });

  const avgScore =
    totalRecords > 0
      ? Math.round(
          (shop?.seoRecords.reduce((sum, r) => sum + (r.seoScore || 0), 0) ||
            0) / totalRecords
        )
      : 0;

  return json({
    shopName: shop?.shopName || shopifyData.session.shop,
    totalRecords,
    averageScore: avgScore,
    latestAudit: shop?.auditReports[0] || null,
  });
}

export default function Dashboard() {
  const { shopName, totalRecords, averageScore, latestAudit } =
    useLoaderData<typeof loader>();

  return (
    <Page title="SEO Dashboard">
      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 3, xl: 3 }}>
          <Card>
            <Box padding="400">
              <Text variant="headingMd">Store SEO Score</Text>
              <Text variant="heading2xl" as="h2">
                {averageScore}
              </Text>
              <Text variant="bodySmall" tone="subdued">
                Based on {totalRecords} products/pages
              </Text>
            </Box>
          </Card>
        </Grid.Cell>

        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 3, xl: 3 }}>
          <Card>
            <Box padding="400">
              <Text variant="headingMd">Pages Analyzed</Text>
              <Text variant="heading2xl" as="h2">
                {totalRecords}
              </Text>
              <Text variant="bodySmall" tone="subdued">
                Products, collections & pages
              </Text>
            </Box>
          </Card>
        </Grid.Cell>

        <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }}>
          <Card>
            <Box padding="400">
              <Text variant="headingMd">Latest Audit</Text>
              {latestAudit ? (
                <>
                  <Text variant="bodyMd">
                    Overall Score: {latestAudit.overallScore}
                  </Text>
                  <Text variant="bodySm" tone="subdued">
                    {new Date(latestAudit.createdAt).toLocaleDateString()}
                  </Text>
                </>
              ) : (
                <Text variant="bodySm" tone="subdued">
                  No audits run yet
                </Text>
              )}
            </Box>
          </Card>
        </Grid.Cell>
      </Grid>

      <Box marginTop="800">
        <Card>
          <Box padding="400">
            <Text variant="headingMd">Getting Started</Text>
            <Divider />
            <Box marginTop="400">
              <Text variant="bodySm">
                1. Go to Meta Tags to optimize product & page titles
              </Text>
              <Text variant="bodySm">
                2. Set focus keyphrases for better keyword targeting
              </Text>
              <Text variant="bodySm">
                3. Check schema markup to enable rich snippets
              </Text>
              <Text variant="bodySm">
                4. Generate XML sitemaps & submit to Google
              </Text>
            </Box>
          </Box>
        </Card>
      </Box>
    </Page>
  );
}
