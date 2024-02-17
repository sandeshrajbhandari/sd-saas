// components/Header.js

import Link from "next/link";

const Header = () => {
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
        <li>
          <Link href="/login">
            <a className="text-white hover:text-gray-300">Login</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
