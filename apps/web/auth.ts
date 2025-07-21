import NextAuth, { type NextAuthResult } from 'next-auth';
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@repo/db"
import type { Adapter } from "next-auth/adapters"; 

const nextAuthResult = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // GitHub({
    //   clientId: process.env.GITHUB_CLIENT_ID,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session?.user && user) {
        session.user.id = user.id;
        // Add isAdmin to session
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { isAdmin: true }
        });
        session.user.isAdmin = dbUser?.isAdmin || false;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  basePath: "/api/auth",
})

export const handlers: NextAuthResult['handlers'] = nextAuthResult.handlers;
export const signIn: NextAuthResult['signIn']  = nextAuthResult.signIn;
export const signOut: NextAuthResult['signOut'] = nextAuthResult.signOut;
export const auth: NextAuthResult['auth'] = nextAuthResult.auth;

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    isAdmin: boolean;
  }
}