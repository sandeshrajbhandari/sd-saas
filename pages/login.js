import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen grid place-items-center">
      <div className="max-w-md w-full border p-4 rounded-md border-zinc-200 shadow shadow-sm flex flex-col">
        <p className="text-2xl font-medium self-center p-4">
          Sign in to continue.
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="text-xl px-4 py-2 font-medium rounded-3xl max-w-sm border self-center border-gray-700 flex"
        >
          <FcGoogle className="text-3xl mx-2" /> Sign in with Google
        </button>
      </div>
    </div>
  );
}
