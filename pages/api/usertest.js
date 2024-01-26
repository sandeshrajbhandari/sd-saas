import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { unstable_getServerSession, getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
// import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  //   console.log(authOptions);

  const session = await unstable_getServerSession(req, res, authOptions);
  console.log(session.user.email);
  // get userid from gmail in prisma

  try {
    // Query the user in the database using the email
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = user.id;

    // Now you have the user ID (userId) corresponding to the email
    console.log("User ID:", userId);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  } finally {
    // Close the Prisma connection

    await prisma.$disconnect();
  }

  //   res.end(session.user.name, req.body);
}
