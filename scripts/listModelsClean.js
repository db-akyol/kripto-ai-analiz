const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function checkModels() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
      console.log("No API Key found");
      return;
  }
  
  try {
      // Fetch models list directly using fetch to see raw helpful error if any
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      const data = await response.json();
      
      if (data.error) {
          console.error("API Error:", data.error);
          return;
      }
      
      console.log("Available Models:");
      const models = data.models || [];
      const supported = models.filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'));
      
      supported.forEach(m => {
          console.log(`- ${m.name} (${m.displayName})`);
      });
      
      console.log(`\nTotal models with generateContent: ${supported.length}`);
      
      if (supported.length > 0) {
        // Try the first one
        const modelName = supported[0].name.replace('models/', '');
        console.log(`\nTesting ${modelName}...`);
        
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: modelName });
        try {
            await model.generateContent("Hi");
            console.log("SUCCESS! This model works.");
        } catch(e) {
            console.log("Failed with this model:", e.message.split('\n')[0]);
        }
      }
      
  } catch (error) {
      console.error("Script Error:", error);
  }
}

checkModels();
