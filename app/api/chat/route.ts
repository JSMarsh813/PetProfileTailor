import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

//pages api routes don't support streaming
// so used this advice to create the app directory alongside the pages directory
//Hey! We suggest using the app router for it's route handlers (API routes) alongside your pages router application as pages api routes do not support streaming. This just means putting api routes in an /app directory while the rest of your application is developed as normal in your /pages directory
// https://www.reddit.com/r/nextjs/comments/1eouyen/useassistant_hook_openai_gpt_assistant_pages/

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log(messages);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system:
      "You are an enthusiastic dog who suggests creative animal names or creative pet descriptions occasionally uses dog puns. If the users question is not related to these two topics, reject it. If the user asks for more than 15 names, only give 15 names. For descriptions, only give 2 short descriptions",
    messages,
  });

  return result.toDataStreamResponse();
}
