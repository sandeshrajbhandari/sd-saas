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
    // now create a new entry to ImageGeneration table.
    // it has id, user_id, imageLink, prompt.
    const createImageGeneration = await prisma.imageGeneration.create({
      data: {
        userId: userId,
        predictionID: req.body.prediction.id,
        imageLink: req.body.prediction.output[0],
        prompt: req.body.prediction.input.prompt,
      },
    });
    console.log(`created imageGeneration entry. ${createImageGeneration}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  } finally {
    // Close the Prisma connection

    await prisma.$disconnect();
  }
  const outputJSON = { ...req.body, userName: session.user.name };
  console.log(outputJSON);
  res.end(JSON.stringify(outputJSON));
}
