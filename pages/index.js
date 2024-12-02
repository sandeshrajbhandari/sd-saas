import Head from "next/head";
import Link from "next/link";
import Header from "../components/header";

export default function About() {
  return (
    <div>
      <Header />
      <Head>
        <title>Inpainting with Stable Diffusion &amp; Replicate</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      {/* <h1 className="text-center text-7xl pb-3">🎨</h1> */}
      {/* EXPLAIANATING COPY */}
      <p className="p-5 w-3/6 text-3xl text-center mx-auto">
        Welcome to <strong>CosplayAI</strong>, a web app that uses Stable
        Diffusion to generate images of cosplays.
      </p>

      <div className="flex justify-center">
        <Link href="/paint-2">
          <a className="p-3 mx-auto text-center bg-black text-white rounded-md mt-10">
            Start generating Cosplays{" "}
            <code>
              <em>paint-2</em>
            </code>
          </a>
        </Link>
      </div>
    </div>
  );
}
