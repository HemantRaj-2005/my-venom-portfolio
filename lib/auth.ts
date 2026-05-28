import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Symbiote Control Core",
      credentials: {
        email: { label: "Security Dossier Email", type: "email", placeholder: "admin@venom.dev" },
        password: { label: "Access Token Decryption Code", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credentials email and password are required.");
        }

        const envEmail = process.env.ADMIN_EMAIL || "admin@venom.dev";
        const envPassword = process.env.ADMIN_PASSWORD || "symbiote_roar_2026";

        // 1. Direct validation against secure ENV credentials
        if (
          credentials.email.toLowerCase() === envEmail.toLowerCase() &&
          credentials.password === envPassword
        ) {
          return {
            id: "admin-system",
            name: "Symbiote Admin",
            email: envEmail,
            role: "ADMIN"
          };
        }

        // 2. Secondary fallback lookup in MongoDB (if connected)
        try {
          const user = await db.user.findFirst({
            where: { email: credentials.email.toLowerCase() }
          });

          if (user && user.hashedPassword) {
            const isValid = await bcrypt.compare(credentials.password, user.hashedPassword);
            if (isValid) {
              return {
                id: user.id || "",
                name: user.name || "Administrator",
                email: user.email,
                role: (user as any).role || "USER"
              };
            }
          }
        } catch (e) {
          console.warn("MongoDB auth lookup failed, falling back to local credentials.", e);
        }

        throw new Error("Access Denied: Invalid security decryption tokens.");
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 Hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin",
    error: "/admin",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-symbiote-108",
};
