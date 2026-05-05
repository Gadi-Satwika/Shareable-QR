const Groq = require("groq-sdk");
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateSmartMetadata = async (targetUrl) => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a professional web classifier. You MUST output ONLY valid JSON. Categories allowed: Social, Dev, Education, Finance, Tech."
                },
                {
                    role: "user",
                    content: `Analyze this URL: ${targetUrl}. Return JSON: {"category": "One word", "description": "Short tip"}`
                }
            ],
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" }
        });

        let content = chatCompletion.choices[0]?.message?.content;
        
        // Clean the string in case the AI added markdown backticks
        content = content.replace(/```json|```/g, "").trim();
        
        const parsed = JSON.parse(content);
        return {
            category: parsed.category || "General",
            description: parsed.description || ""
        };
    } catch (error) {
        console.error("Groq AI Error:", error);
        return { category: "Offline", description: "AI could not reach the server." };
    }
};

module.exports = { generateSmartMetadata };