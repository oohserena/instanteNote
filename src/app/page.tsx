"use client";

import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const { user, error, isLoading } = useUser();

  return (
    <section className="w-full flex flex-col">
      {user ? (
        <div className="flex flex-col items-center justify-center mt-8 gap-4">
          <h1 className="mt-4 text-4xl font-bold text-center text-green-600">
            Hi, {user?.nickname || user?.name || "Hi there"}
          </h1>
          <h2 className="text-xl max-w-lg text-center text-gray-600">
            Welcome to InstantNote, where you can easily create notes with
            just one click!
          </h2>
          <Link
            href="/new"
            className="bg-green-600 text-white mt-4 px-4 py-2 rounded-md hover:bg-green-500 transition-all cursor-pointer"
          >
            Get Started
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-8 gap-4">
          <h1 className="mt-4 text-4xl font-bold text-center text-green-600">
            Hello!
          </h1>
          <h2 className="text-xl max-w-lg text-center text-gray-600">
            Welcome to InstantNote, where you can easily create notes with
            just one click!
          </h2>
          <a
            href="/api/auth/login"
            className="bg-green-600 text-white mt-4 px-4 py-2 rounded-md hover:bg-green-500 transition-all cursor-pointer"
          >
            Login to get started
          </a>
        </div>
      )}
    </section>
  );
}
