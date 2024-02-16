const API_HOST = process.env.REPLICATE_API_HOST || "https://api.replicate.com";
const addBackgroundToPNG = require("lib/add-background-to-png");

import prisma from "pages/api/db";

import { unstable_getServerSession, getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
// import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  //   console.log(authOptions);
  const session = await unstable_getServerSession(req, res, authOptions);
  req.body = Object.entries(req.body).reduce(
    (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
    {}
  );

  if (req.body.mask) {
    req.body.mask = addBackgroundToPNG(req.body.mask);
  }

  console.log(session.user.email);
  // get userid from gmail in prisma

  const body = JSON.stringify({
    // Pinned to a specific version of Stable Diffusion, fetched from:
    // https://replicate.com/stability-ai/stable-diffusion
    // stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4
    version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
    // be04660a5b93ef2aff61e3668dedb4cbeb14941e62a3fd5998364a32d613e35e //this is the inpainter replicate model.
    input: req.body,
  });

  const response = await fetch(`${API_HOST}/v1/predictions`, {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body,
  });

  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 201;
  console.log(prediction);

  try {
    // Query the user in the database using the email
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      //   return res.status(404).json({ error: "User not found" });
      console.log("user not found");
    }

    const userId = user.id;

    // Now you have the user ID (userId) corresponding to the email
    console.log("User ID:", userId);
  } catch (error) {
    console.error(error);
    // res.status(500).json({ success: false, error: "Internal Server Error" });
  } finally {
    // Close the Prisma connection

    await prisma.$disconnect();
  }

  res.end(JSON.stringify(prediction));

  //   res.end(session.user.name, req.body);
}
