import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen grid place-items-center">
      <div className="max-w-md w-full border rounded-md border-zinc-200 shadow shadow-sm flex flex-col">
        <p className="text-2xl font-medium">Sign in</p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="px-4 py-2 font-medium rounded-lg max-w-sm border self-center bg-gray-400"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
