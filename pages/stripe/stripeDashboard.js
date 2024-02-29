import { unstable_getServerSession, getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

import Stripe from "stripe";

import {
  createCustomerIfNull,
  generateCustomerPortalLink,
  hasSubscription,
  createCheckoutLink,
} from "../../lib/billing";

import { StripePricingTable } from "../../components/stripePricingTable";
import { create } from "lodash";
import prisma from "../api/db";
import Header from "../../components/header";
export const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2023-08-16",
});

export default function StripeDashboard({ manage_link, hasSub, checkoutLink }) {
  const { data: session, status } = useSession();

  return (
    <>
      <Header />
      <div className="max-w-4xl m-auto w-full px-4">
        <div className="flex flex-col">
          <h1>STRIPE DASHBOARD</h1>
          <p className="text-2xl font-medium ">
            {/* Welcome, {session?.user?.name}{" "} */}
            <img
              className="rounded-full border-2 inline-block"
              src={session?.user?.image}
            />
            {/* {JSON.stringify(session)} */}
          </p>
        </div>
        <div className="py-4">
          <Link href={manage_link}>
            <a className=" bg-black ml-auto text-white rounded-md px-2 py-1">
              Manage billing
            </a>
          </Link>
        </div>
        {hasSub ? (
          <div>
            <div className="rounded-md px-4 py-2 bg-emerald-400 font-medium text-sm text-white">
              You have a subscription!
            </div>
          </div>
        ) : (
          <div>
            <div className="grid place-items-center rounded-lg px-6 py-10 bg-slate-100">
              <Link
                href={String(checkoutLink)}
                className="font-medium text-base bg-blue-500 hover:underline"
              >
                You have no subscription, checkout now!
              </Link>
              <StripePricingTable />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  // Fetch the user session using getServerSession
  // await console.log(authOptions);
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });
  const customer = await createCustomerIfNull(context);
  const hasSub = await hasSubscription(context);
  const checkoutLink = await createCheckoutLink(customer);

  console.log("" + user?.stripe_customer_id);
  const manage_link = await generateCustomerPortalLink(
    "" + user?.stripe_customer_id
  );
  // Pass the user session as a prop to the component
  return {
    props: {
      manage_link,
      hasSub,
      checkoutLink,
    },
  };
}
