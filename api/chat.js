export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    // 1. קבלת ההודעה של המשתמש מהבקשה שנשלחה מהדפדפן
    const { message, systemPrompt } = await request.json();

    if (!message) {
        return new Response(JSON.stringify({ error: 'Message is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // 2. קריאת מפתח ה-API הסודי ממשתני הסביבה של Vercel
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    // 3. הכנת הבקשה ל-API של גוגל
    const payload = {
        contents: [{
            parts: [{ text: message }]
        }],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
    };

    try {
        // 4. שליחת הבקשה ל-API של גוגל
        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!apiResponse.ok) {
            // אם יש שגיאה מה-API של גוגל, נחזיר אותה לדפדפן
            const errorText = await apiResponse.text();
            console.error("Google API Error:", errorText);
            throw new Error(`Google API responded with status: ${apiResponse.status}`);
        }

        const data = await apiResponse.json();

        // 5. שליפת התשובה והחזרתה חזרה לדפדפן
        const botResponse = data.candidates[0]?.content?.parts[0]?.text || "לא הצלחתי לעבד את התשובה.";
        
        return new Response(JSON.stringify({ reply: botResponse }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Internal Server Error:", error);
        return new Response(JSON.stringify({ error: 'Failed to fetch response from Gemini API.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
