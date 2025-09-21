import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';

// Vercel Edge Functions are fast and scalable.
export const runtime = 'edge';

export default async function handler(req) {
  try {
    // 1. Extract the user's message and the system prompt from the request body.
    const { message, systemPrompt } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Initialize the Google Generative AI client with the API key from Vercel's environment variables.
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

    // 3. Get the generative model, passing the system prompt directly.
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      systemInstruction: systemPrompt,
    });

    // 4. Request a streaming response from the model.
    const stream = await model.generateContentStream(message);

    // 5. Convert the Gemini stream into a friendly format for the client.
    const aiStream = GoogleGenerativeAIStream(stream);

    // 6. Respond with the stream, which will be sent to the browser chunk by chunk.
    return new StreamingTextResponse(aiStream);

  } catch (error) {
    // Basic error handling.
    console.error("Internal Server Error:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch response from Gemini API.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
