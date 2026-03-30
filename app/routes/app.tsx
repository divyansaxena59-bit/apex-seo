import { Outlet, useLoaderData, Link } from '@react-router/react';
import { json, type LoaderFunctionArgs } from '@react-router/node';
import {
  Frame,
  Navigation,
  AppProvider,
  Divider,
} from '@shopify/polaris';
import {
  HomeMajor,
  ProductsMajor,
  SettingsMajor,
} from '@shopify/polaris-icons';
import shopify from '../shopify.server';
import { prisma } from '../db.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const shopifyData = await shopify.validate(request);

  if (!shopifyData.session) {
    return shopify.unauthorized();
  }

  const shop = await prisma.shop.findUnique({
    where: { id: shopifyData.session.shop },
  });

  return json({
    shop: shop?.shopName || shopifyData.session.shop,
  });
}

export default function App() {
  const { shop } = useLoaderData<typeof loader>();

  const navigationItems = [
    {
      url: '/app',
      label: 'Dashboard',
      icon: HomeMajor,
    },
    {
      url: '/app/meta-tags',
      label: 'Meta Tags',
      icon: ProductsMajor,
    },
    {
      url: '/app/settings',
      label: 'Settings',
      icon: SettingsMajor,
    },
  ];

  return (
    <Frame
      navigation={
        <Navigation location="/" items={navigationItems} />
      }
      topBar={undefined}
    >
      <Outlet />
    </Frame>
  );
}
