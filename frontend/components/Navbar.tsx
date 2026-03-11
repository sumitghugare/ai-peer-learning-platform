"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    pathname === path
      ? "text-white font-semibold"
      : "text-gray-400 hover:text-white transition";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white">
          AI Peer Learning
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/" className={linkClass("/")}>Home</Link>
          <Link href="/login" className={linkClass("/login")}>Login</Link>
          <Link
            href="/signup"
            className="bg-white text-black px-4 py-1.5 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
