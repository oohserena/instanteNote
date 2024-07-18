"use client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import React from "react";
import { useRecoilState } from "recoil";
import { profileAtom } from "@/atoms/profileAtom";
import { addCredits } from "@/lib/functions";
import { refectchCreditsAtom } from "@/atoms/flagAtom";

export default withPageAuthRequired(function Page() {
  const [profile, setProfile] = useRecoilState(profileAtom);
  const [refetchCredits, setRefetchCredits] = useRecoilState(refectchCreditsAtom);
  function handleAddCredits() {
    async function handler() {
      await addCredits();
      setRefetchCredits((prev) => !prev);
    }
    handler();
  }
  return (
    <section className="w-full flex flex-col items-center">
      <section className="w-[95%] max-w-4xl flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-center mt-4 text-green-600">
          Profile
        </h1>
        <h2 className="text-2xl font-bold text-center text-gray-800">
          You have {profile.credits} credits
        </h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-md font-bold text-xl"
          onClick={handleAddCredits}
        >
          Buy more credits
        </button>
      </section>
    </section>
  );
});
