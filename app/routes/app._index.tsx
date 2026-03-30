import { json, type LoaderFunctionArgs, redirect } from '@react-router/node';
import shopify from '../shopify.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const shopifyData = await shopify.validate(request);

  if (!shopifyData.session) {
    return shopify.unauthorized();
  }

  // Redirect to dashboard
  return redirect('/app/dashboard');
}

export default function Index() {
  return null;
}
