"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { TiTree } from "react-icons/ti";
import { BiCoin } from "react-icons/bi";
import { IoIosLogOut } from "react-icons/io";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRecoilState, useRecoilValue } from "recoil";
import { profileAtom } from "@/atoms/profileAtom";
import { getProfile } from "@/lib/functions";
import { refectchCreditsAtom } from "@/atoms/flagAtom";

export default function Navbar() {
  const { user } = useUser();
  const [profile, setProfile] = useRecoilState(profileAtom);
  const refetchCredits = useRecoilValue(refectchCreditsAtom);

  useEffect(() => {
    async function fetchProfile() {
      const profile = await getProfile();
      setProfile(profile);
    }
    if (user) fetchProfile();
  },[setProfile, user, refetchCredits]);



  return (
    <nav className="w-full bg-white shadow-md px-6 py-2 z-20 grid grid-cols-3">
      {user ? (
        <div className="flex justify-start">
          <div className="flex flex-col md:flex-row justify-start items-center md:gap-4">
            <div className="flex items-center gap-1">
              <BiCoin />
              <span className="hidden md:block">Credits:</span> {profile.credits}
            </div>
            <Link
              href="/profile"
              className="text-xs md:text-sm font-bold text-gray-600 hover:text-green-600"
            >
              Buy More
            </Link>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      <Link
        href="/"
        className="flex flex-row justify-center font-medium text-lg items-center gap-1"
      >
        <TiTree />
        InstantNote
      </Link>
      {user ? (
        <div className="flex flex-row justify-end items-center gap-2">
          <Image
            className="rounded-full"
            src={user?.picture || ""}
            alt={user?.name || ""}
            width={24}
            height={24}
          />
          <span className="font-semibold text-gray-600 md:hidden">Hi!</span>
          <span className="hidden md:block font-semibold text-gray-600">Hi, {user?.name}!</span>
          <a
            href="/api/auth/logout"
            className="font-semibold text-gray-600 text-xl cursor-pointer hover:text-green-600"
          >
            <IoIosLogOut />
          </a>
        </div>
      ) : (
        <div></div>
      )}
    </nav>
  );
}
