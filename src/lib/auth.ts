import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS
  },
});



export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [process.env.APP_URL!],
    user:{
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status:{
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    },
    emailAndPassword: { 
    enabled: true, 
    autoSignIn: false,
    requireEmailVerification: true
  },
 emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ( { user, url, token }, request) => {
    try{
           const verificationUrl =`${process.env.APP_URL}/verify-email?token=${token}`
    const info = await transporter.sendMail({
    from: '"Prisma Blog" <prismablog@ph.com>',
    to: user.email,
    subject: "Please Verify your email",
    html:  ` <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f7;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      .header {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        color: #333333;
      }
      .content {
        margin-top: 20px;
        font-size: 16px;
        color: #555555;
        line-height: 1.6;
      }
      .btn {
        display: inline-block;
        margin-top: 30px;
        padding: 12px 25px;
        font-size: 16px;
        color: #ffffff;
        background-color: #4CAF50;
        text-decoration: none;
        border-radius: 5px;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #999999;
        text-align: center;
      }
      @media screen and (max-width: 600px) {
        .container {
          margin: 20px;
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Welcome to Prisma Blog!</div>
      <div class="content">
        <p>Hi ${user.name}</p>
        <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
        <p style="text-align:center;">
          <a href="${verificationUrl}" class="btn">Verify Email</a>
        </p>
        <p>If the button doesn’t work, copy and paste the following link into your browser:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>Cheers,<br/>The Prisma Blog Team</p>
      </div>
        <p class="link">
        ${url}
    </p>

      <div class="footer">
        If you didn't sign up for Prisma Blog, please ignore this email.
      </div>
    </div>
  </body>
  </html>` // HTML version of the message
  });
//   give me a html email template for email verification

    console.log("Message sent:", info.messageId);
    }catch(err){
        console.error(err)
        throw err;
    }
      
    },
  },


  socialProviders: {
        google: { 
            prompt: "select_account consent", 
            accessType: "offline", 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});