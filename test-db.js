const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log("Connecting to MongoDB...");
    const users = await prisma.user.findMany();
    console.log("Connection successful!");
    console.log("Users in DB:", users);
  } catch (err) {
    console.error("Database connection failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
