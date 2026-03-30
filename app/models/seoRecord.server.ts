import { prisma } from '../db.server';

export type ResourceType = 'PRODUCT' | 'COLLECTION' | 'PAGE' | 'BLOG' | 'ARTICLE';

export async function getSeoRecords(
  shopId: string,
  resourceType: string,
  page: number = 1,
  limit: number = 50
) {
  const skip = (page - 1) * limit;

  const records = await prisma.seoRecord.findMany({
    where: {
      shopId,
      resourceType,
    },
    orderBy: {
      seoScore: 'desc',
    },
    skip,
    take: limit,
  });

  const total = await prisma.seoRecord.count({
    where: {
      shopId,
      resourceType,
    },
  });

  return {
    records,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function getSeoRecord(
  shopId: string,
  resourceType: string,
  resourceId: string
) {
  return prisma.seoRecord.findUnique({
    where: {
      shopId_resourceType_resourceId: {
        shopId,
        resourceType,
        resourceId,
      },
    },
  });
}

export async function upsertSeoRecord(
  shopId: string,
  data: {
    resourceType: string;
    resourceId: string;
    resourceHandle?: string;
    resourceTitle?: string;
    metaTitle?: string;
    metaDescription?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
    focusKeyphrase?: string;
    seoScore?: number;
  }
) {
  return prisma.seoRecord.upsert({
    where: {
      shopId_resourceType_resourceId: {
        shopId,
        resourceType: data.resourceType,
        resourceId: data.resourceId,
      },
    },
    update: {
      ...data,
      updatedAt: new Date(),
    },
    create: {
      shopId,
      ...data,
    },
  });
}

export async function deleteSeoRecord(
  shopId: string,
  resourceType: string,
  resourceId: string
) {
  return prisma.seoRecord.delete({
    where: {
      shopId_resourceType_resourceId: {
        shopId,
        resourceType,
        resourceId,
      },
    },
  });
}
