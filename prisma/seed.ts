import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const users = [
    {
      name: "Admin",
      email: "admin@test.com",
    },
    {
      name: "Member",
      email: "member@test.com",
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },

      update: {},

      create: {
        name: user.name,
        email: user.email,
        passwordHash,
      },
    });
  }

  console.log("✅ Seed completed successfully");
}

main()
  .catch(async (error) => {
    console.error("❌ Seed failed:", error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();

    await pool.end();
  });