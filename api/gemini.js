// קובץ: /api/gemini.js

export default async function handler(request, response) {
  // קוראים את השאילתה של המשתמש מגוף הבקשה
  const { userQuery, systemPrompt } = request.body;

  // קוראים את מפתח ה-API מהמשתנים הסביבתיים של Vercel (מאובטח)
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: "API key not configured" });
  }

  if (!userQuery) {
    return response.status(400).json({ error: "userQuery is required" });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
  };

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API Error:", errorText);
      throw new Error(`Gemini API responded with status ${geminiResponse.status}`);
    }

    const data = await geminiResponse.json();
    // שולחים את התשובה חזרה לדפדפן
    response.status(200).json(data);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    response.status(500).json({ error: "Failed to get response from Gemini" });
  }
}
