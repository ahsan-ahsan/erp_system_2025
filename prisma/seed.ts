import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@erp.com" },
    update: {},
    create: {
      firstName: "Super",   // 👈 ye required tha
      lastName: "Admin",    // agar lastName bhi required ho to add kardo
      name: "Super Admin",  // agar aapke model me name hai
      email: "admin@erp.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin created:", admin);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
