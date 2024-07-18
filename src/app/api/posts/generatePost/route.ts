import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import OpenAI from "openai";

const withApiAuthRequiredExtended = withApiAuthRequired as any;

export const POST = withApiAuthRequiredExtended(
  async (request: NextRequest, response: NextResponse) => {
    const { db } = await connectToDatabase();
    console.log("db connected");
    try {
      const session = await getSession(request, response);
      const user = session?.user;
      if (!user) {
        return NextResponse.error();
      }

      const profile = await db
        .collection("profiles")
        .find({
          uid: user.sub,
        })
        .toArray();
      if (profile[0].credits < 1) {
        return NextResponse.json(
          {
            success: false,
            message: "Not enough credits",
          },
          { status: 200 }
        );
      }

      const body = await request.json();
      const { description, keywords, tag, title } = body as PostPrompt;
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

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
                    15 words. Write only one title. ${
                      title.length > 0
                        ? `Take that title into consideration: ${title}.`
                        : ""
                    }}. Do not wrap the title in quotes.`,
          },
        ],
        temperature: 0.2,
      });

      const titleResponse = generateTitle.choices[0]?.message?.content;

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

      const postResponse = generatePost.choices[0]?.message?.content;

      const paragraphs = postResponse?.split("\n");

      const post: Post = {
        title: titleResponse || "No title generated",
        content: paragraphs || ["No content generated"],
        uid: user.sub,
      };

      await db.collection("posts").insertOne(post);

      await db.collection("profiles").updateOne(
        {uid: user.sub,},
        {
          $inc: {
            credits: -1,
          },
        }
      );

      return NextResponse.json({ success: true, post: post }, { status: 200 });
    } catch (error) {
      console.log(error);
      return NextResponse.error();
    }
  }
);
