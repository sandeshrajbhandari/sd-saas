import { unstable_getServerSession, getServerSession } from "next-auth/next";
import authOptions from "./api/auth/[...nextauth]";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Dashboard() {
  //   console.log(authOptions);
  const { data: session } = useSession();
  console.log(session);
  return (
    <div className="max-w-4xl m-auto w-full px-4">
      <div className="flex flex-col">
        <p className="text-2xl font-medium ">Welcome, {session?.user?.name}</p>
      </div>
      <button onClick={() => signOut}>LOGOUT</button>
    </div>
  );
}

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
