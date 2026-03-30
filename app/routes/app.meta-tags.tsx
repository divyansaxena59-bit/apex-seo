import { json, type LoaderFunctionArgs } from '@react-router/node';
import { useLoaderData, Link } from '@react-router/react';
import {
  Page,
  Card,
  Grid,
  Button,
  ButtonGroup,
  Box,
} from '@shopify/polaris';
import shopify from '../shopify.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const shopifyData = await shopify.validate(request);

  if (!shopifyData.session) {
    return shopify.unauthorized();
  }

  return json({
    shop: shopifyData.session.shop,
  });
}

export default function MetaTags() {
  const { shop } = useLoaderData<typeof loader>();

  return (
    <Page title="Meta Tags Manager">
      <Card>
        <Box padding="400">
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 3, xl: 3 }}>
              <Link to="/app/meta-tags/products">
                <Button fullWidth variant="primary">
                  Products
                </Button>
              </Link>
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 3, xl: 3 }}>
              <Link to="/app/meta-tags/collections">
                <Button fullWidth>Collections</Button>
              </Link>
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 3, xl: 3 }}>
              <Link to="/app/meta-tags/pages">
                <Button fullWidth>Pages</Button>
              </Link>
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 3, xl: 3 }}>
              <Link to="/app/meta-tags/blogs">
                <Button fullWidth>Blog Posts</Button>
              </Link>
            </Grid.Cell>
          </Grid>
        </Box>
      </Card>
    </Page>
  );
}
