const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEYS = [
  "AIzaSyCkqsz7A25zIG9C4GT17f-azvlTIIjYHgE",
  "AIzaSyBsVTEpdAhl4qajp0noRZ5mCVzBsN42b5Q",
  "AIzaSyDSlQeO_11VxZ6SJdZVntmOnkyd4imgnyg",
];

async function testKeys() {
  for (const [index, key] of API_KEYS.entries()) {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    try {
      const result = await model.generateContent("Test");
      console.log(`Key ${index} (${key.slice(0, 10)}...): Success`);
    } catch (error) {
      console.error(`Key ${index} (${key.slice(0, 10)}...): Failed - ${error.message}`);
    }
  }
}

testKeys();
