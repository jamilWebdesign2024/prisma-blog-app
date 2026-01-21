import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";
import bcrypt from "bcrypt";

async function seedAdmin() {
  try {
    const email = "jamiluddinjishan1@gmail.com";

    // 1️⃣ Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("Admin already exists. Skipping seed.");
      return;
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash("admin1234", 10);

    // 3️⃣ Create admin user
    const admin = await prisma.user.create({
      data: {
        name: "Amin shaheb",
        email: email,
        password: hashedPassword,
        role: UserRole.ADMIN, // This is an enum that will be converted to string
        emailVerified: true,
        status: "ACTIVE",
      },
    });

    console.log("✅ Admin seeded successfully:");
    console.log({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

  } catch (error) {
    console.error("❌ Failed to seed admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed
seedAdmin();
