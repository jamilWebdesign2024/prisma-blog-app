// import { UserRole } from "../constants/enums/user.role.enum";
import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
    try {
        console.log("*** Admin seeding started");
        const adminData = {
            name: "admin seed",
            email: "jamiluddinjishan7@gmail.com",
            role: UserRole.ADMIN,
            password: "admin1234"
        }

        //check user exist on DB or not
        const isExistUser = await prisma.user.findUnique({
            where: {
                email: adminData.email as string
            }
        })

        if (isExistUser) {
            console.log("✅ User already exists. Skipping seed.");
            return;
        }
        console.log("👤 user not found");
        
        // Use hardcoded URL instead of env variable
        const authUrl = "http://localhost:3000/api/auth/sign-up/email";
        console.log(`📍 Calling: ${authUrl}`);

        const signUpAdmin = await fetch(authUrl, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Origin": "http://localhost:4000"
            },
            body: JSON.stringify(adminData)
        });

        console.log(`📊 Response Status: ${signUpAdmin.status}`);
        
        const responseData = await signUpAdmin.json();
        console.log("📋 Response Data:", responseData);

        if (signUpAdmin.ok) {
            console.log("✅ Admin created successfully");
            await prisma.user.update({
                where: {
                    email: adminData.email as string
                },
                data: {
                    emailVerified: true,
                    role: UserRole.ADMIN
                }
            })
            console.log("✅ Admin role updated successfully");
            console.log("\n📧 Login Credentials:");
            console.log("Email: jamiluddinjishan7@gmail.com");
            console.log("Password: admin1234");
        } else {
            console.log("❌ Signup failed with status:", signUpAdmin.status);
            console.log("Error:", responseData);
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdmin()


