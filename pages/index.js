import Head from "next/head";
import Link from "next/link";

export default function About() {
  return (
    <div className="max-w-[512px] mx-auto p-10 bg-white rounded-lg">
      <Head>
        <title>Inpainting with Stable Diffusion &amp; Replicate</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      {/* <h1 className="text-center text-7xl pb-3">🎨</h1> */}
      {/* EXPLAIANATING COPY */}
      <p className="pb-5 text-lg">
        Welcome to Stable Diffusion LORA Playground.
      </p>
      <Link href="/paint-2">
        <a className="py-3 block text-center bg-black text-white rounded-md mt-10">
          Start painting{" "}
          <code>
            <em>paint-2</em>
          </code>
        </a>
      </Link>
    </div>
  );
}
