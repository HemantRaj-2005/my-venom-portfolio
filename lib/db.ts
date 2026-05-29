import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

let prismaClient: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prismaClient = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prismaClient = global.prisma;
}

export const db = prismaClient;

// Helper to determine if we have an active, reachable database connection
export async function isDbConnected(): Promise<boolean> {
  try {
    // Perform a fast query to check if MongoDB is alive
    await prismaClient.user.findFirst();
    return true;
  } catch (e) {
    console.error("Database connection check failed:", e);
    return false;
  }
}
