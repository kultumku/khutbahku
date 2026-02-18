
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function test() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                responseMimeType: 'application/json',
            },
        }, { apiVersion: 'v1beta' });

        const prompt = "Berikan 1 bait pantun dalam format JSON: {\"pantun\": \"...\"}";
        const result = await model.generateContent(prompt);
        console.log("SUCCESS:", result.response.text());
    } catch (error) {
        console.error("FAILURE:", error);
    }
}

test();
