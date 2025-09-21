// This function runs on Vercel's servers, not in the user's browser.
// It securely accesses the environment variable and sends it to the frontend.

export default function handler(request, response) {
  // Access the environment variable securely on the server.
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    // If the key exists, send it back as a JSON object.
    response.status(200).json({ apiKey });
  } else {
    // If the key is not found on the server, send an error.
    response.status(500).json({ error: 'API key not configured in Vercel environment variables.' });
  }
}
