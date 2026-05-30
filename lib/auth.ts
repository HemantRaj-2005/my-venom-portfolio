import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

type SessionRoleFields = {
  id?: unknown;
  role?: unknown;
};

const authSecret =
  process.env.NEXTAUTH_SECRET ||
  process.env.AUTH_SECRET ||
  "fallback-secret-symbiote-108";

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

        const suppliedEmail = credentials.email.trim().toLowerCase();
        const suppliedPassword = credentials.password.trim();
        const envEmail = (process.env.ADMIN_EMAIL).trim();
        const envPassword = (process.env.ADMIN_PASSWORD).trim();

        // 1. Direct validation against secure ENV credentials
        if (
          suppliedEmail === envEmail.toLowerCase() &&
          suppliedPassword === envPassword
        ) {
          return {
            id: "admin-system",
            name: "Hemant Raj - The Admin",
            email: envEmail,
            role: "ADMIN" 
          };
        }

        // 2. Secondary fallback lookup in MongoDB (if connected)
        try {
          const { db } = await import("./db");
          const user = await db.user.findFirst({
            where: { email: suppliedEmail }
          });

          if (user && user.hashedPassword) {
            const isValid = await bcrypt.compare(suppliedPassword, user.hashedPassword);
            if (isValid) {
              return {
                id: user.id || "",
                name: user.name || "Administrator",
                email: user.email,
                role: user.role || "USER"
              };
            }
          }
        } catch (e) {
          console.warn("MongoDB auth lookup failed after ENV credential check.", e);
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
        const role = "role" in user && typeof user.role === "string" ? user.role : "USER";
        token.id = user.id;
        token.role = role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        const sessionUser = session.user as typeof session.user & SessionRoleFields;
        sessionUser.id = token.id;
        sessionUser.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin",
    error: "/admin",
  },
  secret: authSecret,
};
