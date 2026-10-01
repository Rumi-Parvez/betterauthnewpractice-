import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { Resend } from 'resend';




const client = new MongoClient(process.env.BETTER_AUTH_MONGO_BD_URL);

const db = client.db("auth_practice");

const resend = new Resend(process.env.RESEND_API_KEY);


export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url}) => {
      void resend.emails.send({
        from: 'Acme <support@openyhool.com>',
        to: user.email,
        subject: 'Verify your email address',
        html: `Click <a href="${url}">here</a> to verify your email.`,
      })
    },
    sendOnSignUp: true,
		autoSignInAfterVerification: true,
		expiresIn: 3600 // 1 hour
  },

  socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID , 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET , 
        }, 

        github: { 
            clientId: process.env.GITHUB_CLIENT_ID , 
            clientSecret: process.env.GITHUB_CLIENT_SECRET , 
        }, 

    },
 
  database: mongodbAdapter(db, {
    client,
  }),

  
});