// This function runs on Vercel's servers, not in the user's browser.
// It securely accesses the environment variable and sends it to the frontend.

export default function handler(request, response) {
  // Log that the function was invoked to make sure it's being reached.
  console.log("'/api/get-key' function invoked.");

  // Access the environment variable securely on the server.
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.length > 5) { // Added a simple check to see if the key looks valid
    // If the key exists, send it back as a JSON object.
    console.log("GEMINI_API_KEY was found. Sending a success response to the client.");
    response.status(200).json({ apiKey });
  } else {
    // If the key is not found or is empty, send an error and log it.
    console.error("CRITICAL ERROR: GEMINI_API_KEY environment variable was NOT found or is empty on the Vercel server.");
    response.status(500).json({ error: 'API key not configured in Vercel environment variables.' });
  }
}

