import { shopifyApp } from '@shopify/shopify-app-react-router/server';
import { restResources } from '@shopify/shopify-api/rest/admin/2025-01';
import { SESSION_LENGTH } from '@shopify/shopify-app-session-storage/dist/session-utils';

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecret: process.env.SHOPIFY_API_SECRET,
  apiVersion: '2025-01',
  scopes: (process.env.SCOPES || '').split(','),
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  webhookConfig: {
    apiVersion: '2025-01',
  },
  restResources,
  isEmbeddedApp: true,
  sessionStorage: undefined, // We'll implement custom session storage
  distribution: {
    saleChannel: 'web',
    isLaunchable: true,
    isCreatedByMerchant: false,
  },
});

export default shopify;
