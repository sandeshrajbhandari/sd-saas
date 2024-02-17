import { unstable_getServerSession, getServerSession } from "next-auth/next";
import authOptions from "./api/auth/[...nextauth]";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import prisma from "pages/api/db";
import Header from "../components/header";

export default function Dashboard({ imageGenerations }) {
  //   console.log(authOptions);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="max-w-4xl m-auto w-full px-4">
        <div className="flex flex-col">
          <p className="text-2xl font-medium ">
            Welcome, {session?.user?.name}
            {/* {JSON.stringify(session)} */}
          </p>
        </div>
        <button onClick={() => signOut()}>Logout</button>
      </div>

      {/* display image generations of the use. */}
      <h1>Image generations</h1>
      <div className="flex flex-wrap justify-center">
        {imageGenerations.map((imageGen, i) => (
          <div
            key={i}
            className="max-w-md w-1/4 mx-4 my-8 p-6 bg-white rounded-lg shadow-md"
          >
            <h1 className="text-xl font-semibold mb-4">{i}</h1>
            <img
              src={imageGen.imageLink}
              alt={`Image ${i}`}
              className="w-full mb-4 rounded-md"
            />
            <p className="text-gray-600">{imageGen.prompt}</p>
          </div>
        ))}
      </div>
    </>
  );
}
export const getServerSideProps = async () => {
  try {
    const imageGenerations = await prisma.imageGeneration.findMany();

    return {
      props: {
        imageGenerations: JSON.parse(JSON.stringify(imageGenerations)),
        // to avoid non serializable Date objects.
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        imageGenerations: [],
      },
    };
  } finally {
    await prisma.$disconnect();
  }
};

// export async function getServerSideProps() {
//   // Fetch the user session using getServerSession
//   console.log(authOptions);
//   const session = await unstable_getServerSession(authOptions);

//   // Pass the user session as a prop to the component
//   return {
//     props: {
//       session,
//     },
//   };
// }

// write a simple loop
