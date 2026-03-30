import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from '@react-router/node';
import { useLoaderData, Form } from '@react-router/react';
import {
  Page,
  Card,
  TextField,
  Button,
  FormLayout,
  Box,
} from '@shopify/polaris';
import shopify from '../shopify.server';
import { prisma } from '../db.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const shopifyData = await shopify.validate(request);

  if (!shopifyData.session) {
    return shopify.unauthorized();
  }

  const settings = await prisma.shopSettings.findUnique({
    where: { shopId: shopifyData.session.shop },
  });

  return json({
    settings: settings || {
      organizationName: '',
      organizationUrl: '',
      claudeApiKey: '',
    },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const shopifyData = await shopify.validate(request);

  if (!shopifyData.session) {
    return shopify.unauthorized();
  }

  if (request.method === 'POST') {
    const formData = await request.formData();

    const organizationName = formData.get('organizationName') as string;
    const organizationUrl = formData.get('organizationUrl') as string;
    const claudeApiKey = formData.get('claudeApiKey') as string;

    await prisma.shopSettings.upsert({
      where: { shopId: shopifyData.session.shop },
      update: {
        organizationName,
        organizationUrl,
        claudeApiKey,
      },
      create: {
        shopId: shopifyData.session.shop,
        organizationName,
        organizationUrl,
        claudeApiKey,
      },
    });

    return json({ success: true });
  }

  return json({});
}

export default function Settings() {
  const { settings } = useLoaderData<typeof loader>();

  return (
    <Page title="Settings">
      <Card>
        <Form method="post">
          <FormLayout>
            <TextField
              label="Organization Name"
              name="organizationName"
              defaultValue={settings?.organizationName || ''}
              placeholder="Your brand name"
            />

            <TextField
              label="Organization URL"
              name="organizationUrl"
              defaultValue={settings?.organizationUrl || ''}
              placeholder="https://example.com"
            />

            <TextField
              label="Anthropic API Key (for AI features)"
              name="claudeApiKey"
              type="password"
              defaultValue={settings?.claudeApiKey ? '••••••••' : ''}
              placeholder="sk-ant-..."
            />

            <Box marginTop="400">
              <Button submit>Save Settings</Button>
            </Box>
          </FormLayout>
        </Form>
      </Card>
    </Page>
  );
}
