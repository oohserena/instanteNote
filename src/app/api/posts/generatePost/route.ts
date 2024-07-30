import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import OpenAI from "openai";

// Extending the withApiAuthRequired function from Auth0 to use in our API route
const withApiAuthRequiredExtended = withApiAuthRequired as any;

// POST request handler for generating notes using OpenAI
export const POST = withApiAuthRequiredExtended(
  async (request: NextRequest, response: NextResponse) => {
    // Connect to the MongoDB database
    const { db } = await connectToDatabase();
    console.log("db connected");
    try {
      // Get the current session using Auth0
      const session = await getSession(request, response);
      const user = session?.user;
      // If no user is found in the session, return an error response
      if (!user) {
        return NextResponse.error();
      }

      // Retrieve the user's profile from the database using their user ID (uid)
      const profile = await db
        .collection("profiles")
        .find({
          uid: user.sub,
        })
        .toArray();

      // Check if the user has enough credits to generate a note
      if (profile[0].credits < 1) {
        return NextResponse.json(
          {
            success: false,
            message: "Not enough credits",
          },
          { status: 200 }
        );
      }

      // Parse the request body to get the input data for generating the note
      const body = await request.json();
      const { description, keywords, tag, title } = body as PostPrompt;

      // Initialize the OpenAI client with the API key
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Generate a title for the note using the OpenAI API
      const generateTitle = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a good blog post writer.",
          },
          {
            role: "user",
            content: `Write me a title for a note about ${description}.
                    The keywords for the note are as follows: ${keywords}. The tag of the 
                    note should be ${tag}. The title should be SEO friendly and no longer than
                    10 words. Write only one title. The title should be short and concise. ${
                      title.length > 0
                        ? `Take that title into consideration: ${title}.`
                        : ""
                    }}. Do not wrap the title in quotes.`,
          },
        ],
        temperature: 0.2, // A value between 0 and 1 that controls the randomness of the output
      });

      // Extract the generated title from the response
      const titleResponse = generateTitle.choices[0]?.message?.content;

      // Generate the note content using the OpenAI API
      const generatePost = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a good blog post writer.",
          },
          {
            role: "user",
            content: `Write me a long and logical note about ${description}.
                The title of the note is as follows: ${titleResponse}. These are the keywords
                for the note: ${keywords}. The note should be long and SEO friendly. The
                tag of the note should be ${tag}. Write it as well as you ca. Do not include the 
                title in the post. Divide the note into paragraphs and you can use bullet points
                . Write at least 3 paragraphs. Distinguish the paragraphs with a line break.
                Do not use too formal words, write it like students long notes and make the note memorable.`,
          },
        ],
        temperature: 0.2,
      });

       // Extract the generated note content from the response
      const postResponse = generatePost.choices[0]?.message?.content;

      // Split the content into paragraphs
      const paragraphs = postResponse?.split("\n");

      // Create a post object to be saved in the database
      const post: Post = {
        title: titleResponse || "No title generated",
        content: paragraphs || ["No content generated"],
        uid: user.sub,
      };

      // Insert the generated post into the "posts" collection in the database
      await db.collection("posts").insertOne(post);

      // Deduct one credit from the user's profile
      await db.collection("profiles").updateOne(
        {uid: user.sub,},
        {
          $inc: {
            credits: -1,
          },
        }
      );

      // Return a success response with the generated post
      return NextResponse.json({ success: true, post: post }, { status: 200 });
    } catch (error) {
      console.log(error);
      return NextResponse.error();
    }
  }
);
