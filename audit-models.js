
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    const apiKey = 'AIzaSyCw_ZRHBpfZKT0-4kaILQyTE1_YIc2ggd0';
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log("Listing models for v1...");
        // The listModels method might vary by SDK version, trying common approach
        // If not available, we'll try a different way.

        // Actually, let's just try to call generateContent with a few guesses and see which one doesn't 404.
        const modelsToTry = [
            'gemini-1.5-flash',
            'gemini-1.5-flash-latest',
            'gemini-1.5-flash-001',
            'gemini-1.5-flash-002',
            'gemini-1.0-pro',
            'gemini-pro',
            'gemini-2.0-flash-exp'
        ];

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                await model.generateContent("Hi");
                console.log(`MODEL FOUND AND WORKING: ${modelName}`);
            } catch (e) {
                console.log(`MODEL FAILED (${modelName}): ${e.message}`);
            }
        }
    } catch (error) {
        console.error("GLOBAL FAILURE:", error);
    }
}

listModels();
