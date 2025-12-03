const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyCkqsz7A25zIG9C4GT17f-azvlTIIjYHgE"; // First key
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // Just try a simple generation to test access
    const result = await model.generateContent("Hello");
    console.log("gemini-1.5-flash works:", result.response.text());
  } catch (error) {
    console.error("gemini-1.5-flash failed:", error.message);
  }

  try {
    const model2 = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result2 = await model2.generateContent("Hello");
    console.log("gemini-2.5-flash works:", result2.response.text());
  } catch (error) {
    console.error("gemini-2.5-flash failed:", error.message);
  }
}

listModels();
