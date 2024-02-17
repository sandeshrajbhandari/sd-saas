import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Canvas from "components/canvas";
import PromptForm from "components/prompt-form";
import Dropzone from "components/dropzone";
import Download from "components/download";
import Gallery from "components/gallery";
// icons from lucide-react
import { XCircle as StartOverIcon } from "lucide-react";
import { Code as CodeIcon } from "lucide-react";
import { Rocket as RocketIcon } from "lucide-react";

import { addGeneration } from "lib/addGeneration";

import { useSession, signIn, signOut } from "next-auth/react";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [userUploadedImage, setUserUploadedImage] = useState(null);

  // session check process.
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const router = useRouter();
  useEffect(() => {
    // Redirect to login if there's no session
    if (isLoading) return; // Do nothing while loading
    if (status == "unauthenticated") {
      router.push("/login"); // Update '/login' with the actual login page URL
    }
  }, [session, router]);

  const testClick = async (e) => {
    e.preventDefault();
    const prediction = "test";
    await addGeneration(prediction);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const prevPrediction = predictions[predictions.length - 1];
    const prevPredictionOutput = prevPrediction?.output
      ? prevPrediction.output[prevPrediction.output.length - 1]
      : null;

    const body = {
      prompt: e.target.prompt.value,
      negative_prompt: e.target.negative_prompt.value,
    };
    // first the request is sent and a response with an id is sent back.
    // later we check for the prediction.status, and use the id to get the image if the prediction suceeds or fails.
    // PINGING THE predictons2 endpoint.
    const response = await fetch("/api/predictions2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const prediction = await response.json();
    // check 201 response error.
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    console.log("setting predictions");
    // adding the new prediction to the predictions state array.
    setPredictions(predictions.concat([prediction]));
    console.log(predictions);
    // in this stage we check if the prediction has completed.
    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      console.log("waiting 1 sec.");
      await sleep(1000);
      // fetching the /api/predictions/[id] endpoint.
      // it gives the prediction data including its status (failed, succeeded, in-progress)
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      // check for error status code i.e. 200.
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      setPredictions(predictions.concat([prediction]));

      if (prediction.status === "succeeded") {
        console.log(
          "Adding prediction to the generationImages database.${JSON.stringify(prediction)}"
        );
        // addGeneration calls the endpoint usertest rn to add the prediction to user database.
        await addGeneration(prediction);
        setUserUploadedImage(null);
      }
    }
  };

  const startOver = async (e) => {
    e.preventDefault();
    setPredictions([]);
    setError(null);
    setMaskImage(null);
    setUserUploadedImage(null);
  };

  if (isLoading) return "checking session. loading.";
  return (
    <div>
      <Head>
        <title>Inpainting with Stable Diffusion &amp; Replicate</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <main className="container mx-auto p-5">
        {error && <div>{error}</div>}

        {/* commenting out uploader and canvas part */}
        <div className="border-hairline max-w-[512px] mx-auto relative">
          {/* <div>what is this? {predictions[0]}</div> */}
          <Dropzone
            onImageDropped={setUserUploadedImage}
            predictions={predictions}
            userUploadedImage={userUploadedImage}
          />
          <div
            className="bg-gray-50 relative max-h-[512px] w-full flex items-stretch"
            // style={{ height: 0, paddingBottom: "100%" }}
          >
            {/* <Canvas
              predictions={predictions}
              userUploadedImage={userUploadedImage}
              onDraw={setMaskImage}
            /> */}
            <Gallery
              predictions={predictions}
              // userUploadedImage={userUploadedImage}
              // onDraw={setMaskImage}
            />
          </div>
        </div>

        <div className="max-w-[512px] mx-auto">
          <PromptForm onSubmit={handleSubmit} />

          <div className="text-center">
            {((predictions.length > 0 &&
              predictions[predictions.length - 1].output) ||
              maskImage ||
              userUploadedImage) && (
              <button className="lil-button" onClick={startOver}>
                <StartOverIcon className="icon" />
                Start over
              </button>
            )}

            <Download predictions={predictions} />
            <Link href="https://replicate.com/stability-ai/stable-diffusion">
              <a target="_blank" className="lil-button">
                <RocketIcon className="icon" />
                Run Stable Diffusion with an API
              </a>
            </Link>
            <Link href="https://github.com/zeke/inpainter">
              <a
                className="lil-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CodeIcon className="icon" />
                See how it’s built on GitHub
              </a>
            </Link>
          </div>
        </div>
      </main>
      <button onClick={testClick}>Test USER DATABASE</button>
    </div>
  );
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsDataURL(file);
  });
}
