import { type ActionFunctionArgs, json } from '@react-router/node';
import { prisma } from '../db.server';
import shopify from '../shopify.server';

/**
 * Handle app uninstall webhook
 * Clean up shop data when merchant uninstalls the app
 */
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const shopifyData = await shopify.validateWebhook(request);

  if (!shopifyData.isValid) {
    console.error('Invalid webhook signature');
    return json({ error: 'Invalid signature' }, { status: 401 });
  }

  const shop = shopifyData.topic?.split('/')[0]; // Extract shop from topic

  if (!shop) {
    return json({ error: 'No shop found' }, { status: 400 });
  }

  try {
    // Delete shop and all related data (cascade)
    await prisma.shop.delete({
      where: { id: shop },
    });

    console.log(`Shop ${shop} uninstalled. All data cleaned up.`);

    return json({ success: true });
  } catch (error) {
    console.error('Error handling app uninstall:', error);
    return json({ error: 'Failed to handle uninstall' }, { status: 500 });
  }
}
