import { Session as PrismaSession } from '@prisma/client';
import { SessionStorage } from '@shopify/shopify-app-session-storage';
import { prisma } from '../../db.server';

/**
 * Shopify Session Storage implementation using Prisma
 * Stores OAuth sessions in the database
 */

export const sessionStorage: SessionStorage = {
  async storeSession(session: any): Promise<boolean> {
    try {
      await prisma.session.upsert({
        where: { id: session.id },
        update: {
          shop: session.shop,
          state: session.state,
          isOnline: session.isOnline,
          scope: session.scope,
          expires: session.expires,
          accessToken: session.accessToken,
          userId: session.userId,
          firstName: session.firstName,
          lastName: session.lastName,
          email: session.email,
          accountOwner: session.accountOwner,
          locale: session.locale,
          collaborator: session.collaborator,
          emailVerified: session.emailVerified,
        },
        create: {
          id: session.id,
          shop: session.shop,
          state: session.state,
          isOnline: session.isOnline,
          scope: session.scope,
          expires: session.expires,
          accessToken: session.accessToken,
          userId: session.userId,
          firstName: session.firstName,
          lastName: session.lastName,
          email: session.email,
          accountOwner: session.accountOwner,
          locale: session.locale,
          collaborator: session.collaborator,
          emailVerified: session.emailVerified,
        },
      });
      return true;
    } catch (error) {
      console.error('Failed to store session:', error);
      return false;
    }
  },

  async loadSession(id: string): Promise<any | undefined> {
    try {
      const session = await prisma.session.findUnique({
        where: { id },
      });
      return session || undefined;
    } catch (error) {
      console.error('Failed to load session:', error);
      return undefined;
    }
  },

  async deleteSession(id: string): Promise<boolean> {
    try {
      await prisma.session.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error('Failed to delete session:', error);
      return false;
    }
  },

  async deleteSessions(ids: string[]): Promise<boolean> {
    try {
      await prisma.session.deleteMany({
        where: { id: { in: ids } },
      });
      return true;
    } catch (error) {
      console.error('Failed to delete sessions:', error);
      return false;
    }
  },

  async findSessionsByShop(shop: string): Promise<any[]> {
    try {
      return await prisma.session.findMany({
        where: { shop },
      });
    } catch (error) {
      console.error('Failed to find sessions by shop:', error);
      return [];
    }
  },
};
