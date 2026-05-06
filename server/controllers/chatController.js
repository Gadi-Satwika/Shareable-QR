const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.chatWithAssistant = async (req, res) => {
    try {
        const { message, userContext, userName } = req.body;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are the QR-Flow Assistant. You help users manage their dynamic QR codes. 
                    The current user is ${userName}. 
                    Their current QR data: ${JSON.stringify(userContext)}.
                    Be concise, professional, and helpful. If they ask to analyze a link, use your internal knowledge.`
                },
                { role: "user", content: message }
            ],
            model: "llama-3.1-8b-instant",
        });

        res.json({ reply: completion.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: "Chat failed" });
    }
};