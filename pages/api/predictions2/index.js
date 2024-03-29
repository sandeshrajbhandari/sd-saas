const API_HOST = process.env.REPLICATE_API_HOST || "https://api.replicate.com";
const addBackgroundToPNG = require("lib/add-background-to-png");

// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();
import prisma from "pages/api/db";

import { unstable_getServerSession, getServerSession } from "next-auth/next";
import authOptions from "pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  // remnove null and undefined values
  req.body = Object.entries(req.body).reduce(
    (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
    {}
  );

  if (req.body.mask) {
    req.body.mask = addBackgroundToPNG(req.body.mask);
  }

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
  res.end(JSON.stringify(prediction));
}
