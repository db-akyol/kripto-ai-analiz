require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // There isn't a direct listModels method on client in some versions, 
    // but let's try to infer or just try a basic one.
    // Actually SDK has no listModels? 
    // We can try to just run a simple prompt on a few candidates.
    
    const candidates = [
      'gemini-1.5-flash',
      'gemini-1.5-flash-001',
      'gemini-1.5-flash-002',
      'gemini-1.5-pro',
      'gemini-1.5-pro-001',
      'gemini-1.5-pro-002',
      'gemini-1.0-pro',
      'gemini-pro'
    ];

    console.log("Testing models...");
    
    for (const modelName of candidates) {
        process.stdout.write(`Testing ${modelName}... `);
        try {
            const m = genAI.getGenerativeModel({ model: modelName });
            await m.generateContent("Hello");
            console.log("SUCCESS ✅");
        } catch (e) {
            if (e.message.includes("404")) {
                console.log("NOT FOUND ❌");
            } else if (e.message.includes("429")) {
                console.log("QUOTA EXCEEDED ⚠️ (Found but no quota)");
            } else {
                console.log(`ERROR: ${e.message.split('\n')[0]}`);
            }
        }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

listModels();
