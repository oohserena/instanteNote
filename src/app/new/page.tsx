"use client";

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useState } from "react";
import { tags } from "../data/tags";
import { generatePost } from "@/lib/functions";
import { FaSpinner, FaRegTired } from "react-icons/fa";
import { refectchCreditsAtom } from "@/atoms/flagAtom";
import { useRecoilState } from "recoil";

export default withPageAuthRequired(function Page() {
  const [post, setPost] = useState<Post | null>(null);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [refetchCredits, setRefetchCredits] = useRecoilState(refectchCreditsAtom);

  const [postPrompt, setPostPrompt] = useState<PostPrompt>({
    title: "",
    description: "",
    keywords: "",
    tag: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setHasSubmitted(true);
    setError(false);
    setSuccess(false);
    setIsWaitingForResponse(true);

    const res = await generatePost(postPrompt);
    setRefetchCredits((prev) => !prev);

    await res
      .json()
      .then((data) => {
        console.log(data);
        setIsWaitingForResponse(false);
        setHasSubmitted(false);
        setSuccess(true);
        setPost(data.post);
      })
      .catch((err) => {
        setIsWaitingForResponse(false);
        setHasSubmitted(false);
        setError(true);
      });
  }

  return (
    <section className="w-full flex flex-col items-center">
      <section className="w-[95%] max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 mt-4 items-center"
        >
          <h1 className="text-4xl font-bold text-center text-green-600">
            Generate a new post
          </h1>
          <div className="w-full flex flex-col gap-2">
            <label
              htmlFor="title"
              className="text-gray-600 text-sm font-semibold"
            >
              Title (optional)
            </label>
            <input
              className="w-full border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              type="text"
              name="title"
              id="title"
              placeholder="Enter a title (e.g. 'Heap Definition')"
              value={postPrompt.title}
              onChange={(e) =>
                setPostPrompt({ ...postPrompt, title: e.target.value })
              }
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label
              htmlFor="description"
              className="text-gray-600 text-sm font-semibold"
            >
              Description
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              name="description"
              id="description"
              placeholder="Enter a description (e.g. 'This is a note about the definition of heap, and how to use it and typical leetcode problems of this data structure')"
              value={postPrompt.description}
              onChange={(e) =>
                setPostPrompt({ ...postPrompt, description: e.target.value })
              }
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label
              htmlFor="keywords"
              className="text-gray-600 text-sm font-semibold"
            >
              Keywords
            </label>
            <input
              className="w-full border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              type="text"
              name="keywords"
              id="keywords"
              placeholder="Enter keywords, separated by commas (e.g. 'note, post, writing, algorithm, max heap, min heap')"
              value={postPrompt.keywords}
              onChange={(e) =>
                setPostPrompt({ ...postPrompt, keywords: e.target.value })
              }
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label
              htmlFor="tags"
              className="text-gray-600 text-sm font-semibold"
            >
              Tags
            </label>
            <select
              className="w-full border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              name="tag"
              id="tag"
              value={postPrompt.tag}
              onChange={(e) =>
                setPostPrompt({ ...postPrompt, tag: e.target.value })
              }
            >
              {tags.map((tag, index) => (
                <option key={index} value={tag.value}>
                  {tag.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-500 transition-all cursor-pointer"
          >
            Submit
          </button>
        </form>
        {isWaitingForResponse && hasSubmitted && (
          <div className="w-full flex flex-col gap-r mt-4 items-center">
            <FaSpinner className="animate-spin w-8 h-8 text-green-600" />
          </div>
        )}
        {error && (
          <div className="w-full flex flex-col gap-r mt-4 items-center">
            <FaRegTired className="w-8 h-8 text-rose-600" />
            <p className="text-rose-600 text-center">
              Something went wrong. Please try again.
            </p>
          </div>
        )}
        {success && post && (
          <div className="w-full flex flex-col gap-4 mt-4">
            <h1 className="text-4xl font-bold text-gray-800 text-center">
              {post.title}
            </h1>
            {typeof post.content === "string" ? (
              <p className="text-gray-600">{post.content}</p>
            ) : (
              <div className="flex flex-col gap-2">
                {post.content.map((paragraph, index) => (
                  <p key={index} className="text-gray-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </section>
  );
});
