// components/Header.js

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

const Header = () => {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/dashboard">
            <a className="text-white hover:text-gray-300">Dashboard</a>
          </Link>
        </li>
        <li>
          <Link href="/paint-2">
            <a className="text-white hover:text-gray-300">Paint 2</a>
          </Link>
        </li>
        {isLoading ? (
          ""
        ) : status === "unauthenticated" ? (
          <Link href="/login">
            <a className="text-white hover:text-gray-300">Login</a>
          </Link>
        ) : (
          <li>
            <button
              className="text-white hover:text-gray-300"
              onClick={() => signOut()}
            >
              Logout
            </button>
          </li>
        )}
        <li></li>
      </ul>
    </nav>
  );
};

export default Header;
