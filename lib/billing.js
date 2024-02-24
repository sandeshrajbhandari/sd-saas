// reference https://github.com/romanwbruce/api-saas-project/blob/main/src/lib/stripe.ts
import { unstable_getServerSession, getServerSession } from "next-auth/next";
// import authOptions from "../pages/api/auth/[...nextauth]";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import prisma from "../pages/api/db";

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2023-08-16",
});

export async function hasSubscription(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) {
    const user = await prisma.user.findFirst({
      where: { email: session.user?.email },
    });

    const subscriptions = await stripe.subscriptions.list({
      customer: String(user?.stripe_customer_id),
    });

    return subscriptions.data.length > 0;
  }

  return false;
}

export async function createCheckoutLink(customer) {
  const checkout = await stripe.checkout.sessions.create({
    success_url: "http://localhost:3000/stripe/stripeDashboard&success=true",
    cancel_url: "http://localhost:3000/stripe/stripeDashboard&success=true",
    customer: customer,
    line_items: [
      {
        price: "price_1JuVIiDrScrwd5y9uWvWqFlx",
        quantity: 1,
      },
    ],
    mode: "subscription",
  });

  return checkout.url;
}

export async function createCustomerIfNull(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) {
    const user = await prisma.user.findFirst({
      where: { email: session.user?.email },
    });

    if (!user?.stripe_customer_id) {
      const customer = await stripe.customers.create({
        email: String(user?.email),
      });

      await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          stripe_customer_id: customer.id,
        },
      });
    }
    const user2 = await prisma.user.findFirst({
      where: { email: session.user?.email },
    });
    return user2?.stripe_customer_id;
  }
}

// Generate Customer portal
export async function generateCustomerPortalLink(customerId) {
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.NEXTAUTH_URL + "/stripe/stripeDashboard",
    });

    console.log();

    return portalSession.url;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}
