import { useEffect } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
} from '@react-router/react';
import { json, type LoaderFunctionArgs } from '@react-router/node';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import shopify from './shopify.server';
import { prisma } from './db.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const shopifyData = await shopify.validate(request);

  // Store shop info if authenticated
  if (shopifyData.session) {
    const shop = await prisma.shop.upsert({
      where: { id: shopifyData.session.shop },
      update: {
        updatedAt: new Date(),
      },
      create: {
        id: shopifyData.session.shop,
        shopName: shopifyData.session.shop,
      },
    });
  }

  return json({
    apiKey: shopify.apiKey,
    shop: shopifyData.session?.shop,
  });
}

export default function App() {
  const { apiKey, shop } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AppProvider apiKey={apiKey} shop={shop}>
          <Outlet />
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
