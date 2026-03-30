/**
 * Shopify GraphQL API wrapper for products
 * Handles fetching and updating product data
 */

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  seo?: {
    title?: string;
    description?: string;
  };
  images: {
    edges: Array<{
      node: {
        id: string;
        url: string;
        altText?: string;
      };
    }>;
  };
}

/**
 * Fetch products from Shopify
 * NOTE: Requires shopify.validateRequest() to extract session
 */
export async function fetchProducts(
  admin: any,
  first: number = 50,
  after?: string
): Promise<{
  products: ShopifyProduct[];
  hasNextPage: boolean;
  endCursor?: string;
}> {
  const query = `
    query getProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            description
            seo {
              title
              description
            }
            images(first: 1) {
              edges {
                node {
                  id
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await admin.graphql(query, {
      variables: {
        first,
        after,
      },
    });

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL error:', data.errors);
      return {
        products: [],
        hasNextPage: false,
      };
    }

    const products = data.data.products.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      description: edge.node.description,
      seo: edge.node.seo,
      images: edge.node.images,
    }));

    return {
      products,
      hasNextPage: data.data.products.pageInfo.hasNextPage,
      endCursor: data.data.products.pageInfo.endCursor,
    };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return {
      products: [],
      hasNextPage: false,
    };
  }
}

/**
 * Update product SEO fields
 */
export async function updateProductSeo(
  admin: any,
  productId: string,
  seoTitle: string,
  seoDescription: string
): Promise<boolean> {
  const mutation = `
    mutation updateProductSeo($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          seo {
            title
            description
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const response = await admin.graphql(mutation, {
      variables: {
        input: {
          id: productId,
          seo: {
            title: seoTitle,
            description: seoDescription,
          },
        },
      },
    });

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL error:', data.errors);
      return false;
    }

    if (data.data.productUpdate.userErrors.length > 0) {
      console.error('User errors:', data.data.productUpdate.userErrors);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to update product SEO:', error);
    return false;
  }
}

/**
 * Get product count for pagination
 */
export async function getProductCount(admin: any): Promise<number> {
  const query = `
    query {
      productsCount {
        count
      }
    }
  `;

  try {
    const response = await admin.graphql(query);
    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL error:', data.errors);
      return 0;
    }

    return data.data.productsCount.count;
  } catch (error) {
    console.error('Failed to get product count:', error);
    return 0;
  }
}
