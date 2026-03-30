import { json, type LoaderFunctionArgs } from '@react-router/node';
import { useLoaderData, Link } from '@react-router/react';
import {
  Page,
  Card,
  DataTable,
  Pagination,
  Text,
  Box,
  Badge,
} from '@shopify/polaris';
import shopify from '../shopify.server';
import { prisma } from '../db.server';
import { getScoreColor, getScoreLabel } from '../utils/seo-score';

export async function loader({ request }: LoaderFunctionArgs) {
  const shopifyData = await shopify.validate(request);

  if (!shopifyData.session) {
    return shopify.unauthorized();
  }

  // Get pagination from URL params
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = 50;

  // Fetch products from database (placeholder - will integrate GraphQL)
  const seoRecords = await prisma.seoRecord.findMany({
    where: {
      shopId: shopifyData.session.shop,
      resourceType: 'PRODUCT',
    },
    orderBy: { seoScore: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.seoRecord.count({
    where: {
      shopId: shopifyData.session.shop,
      resourceType: 'PRODUCT',
    },
  });

  const pages = Math.ceil(total / limit);

  return json({
    records: seoRecords,
    total,
    pages,
    currentPage: page,
    shop: shopifyData.session.shop,
  });
}

export default function ProductsMeta() {
  const { records, total, pages, currentPage, shop } =
    useLoaderData<typeof loader>();

  const rows = records.map((record: any) => [
    record.resourceTitle || 'Untitled',
    record.metaTitle || '—',
    record.focusKeyphrase || '—',
    record.seoScore ? (
      <Badge tone={record.seoScore >= 60 ? 'success' : 'warning'}>
        {record.seoScore}
      </Badge>
    ) : (
      '—'
    ),
    <Link to={`/app/meta-tags/products/${record.resourceId}`}>Edit</Link>,
  ]);

  return (
    <Page title="Product Meta Tags">
      <Card>
        <DataTable
          columnContentTypes={['text', 'text', 'text', 'text', 'text']}
          headings={['Product', 'Meta Title', 'Keyphrase', 'Score', 'Action']}
          rows={rows}
        />

        <Box padding="400">
          <Text variant="bodySm" tone="subdued">
            Showing {records.length} of {total} products
          </Text>
        </Box>

        {pages > 1 && (
          <Box padding="400">
            <Pagination
              hasPrevious={currentPage > 1}
              onPrevious={() => {
                // Handle previous
              }}
              hasNext={currentPage < pages}
              onNext={() => {
                // Handle next
              }}
            />
          </Box>
        )}
      </Card>
    </Page>
  );
}
