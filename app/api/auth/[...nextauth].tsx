import { prisma } from "@/lib/db/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Stripe from "stripe";

// This is the configuration for the NextAuth.js library.
export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  events: {
    // This is a custom event handler that is triggered when a user signs in.
    createUser: async ({ user }) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2024-04-10",
      });

      // If the user has a name and email, create a new customer in Stripe.
      if (user.name && user.email) {
        const customer = await stripe.customers.create({
          email: user.email || undefined,
          name: user.name || undefined,
        });

        // Update the user record in the database with the Stripe customer ID.
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customer.id },
        });
      }
    },
  },
  // This is a custom callback that is triggered when a user signs in.
  callbacks: {
    async session({ session, user, token }) {
      session.user = user;
      return session;
    },
  },
};

export default NextAuth(authOptions);
