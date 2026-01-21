import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [process.env.APP_URL!],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },

  // ✅ FIX IS HERE
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,

    async hashPassword(password: string) {
      return await bcrypt.hash(password, 10);
    },

    async verifyPassword({ password, hash }: { password: string; hash: string }) {
      return await bcrypt.compare(password, hash);
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

      await transporter.sendMail({
        from: '"Prisma Blog" <prismablog@ph.com>',
        to: user.email,
        subject: "Please Verify your email",
        html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
          <h2>Welcome to Prisma Blog 👋</h2>
          <p>Hi ${user.name},</p>
          <p>Please verify your email by clicking the button below:</p>
          <p>
            <a href="${verificationUrl}"
              style="display:inline-block;padding:12px 20px;
              background:#4CAF50;color:#fff;text-decoration:none;border-radius:6px">
              Verify Email
            </a>
          </p>
          <p>If the button doesn’t work, copy this link:</p>
          <p>${verificationUrl}</p>
          <hr/>
          <small>If you didn’t sign up, ignore this email.</small>
        </div>
        `,
      });
    },
  },

  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});