export const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
export const DEEPSEEK_MODEL = "deepseek-chat";

export async function chatWithDeepSeek(messages: { role: string; content: string | any[] }[]) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not defined");
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to fetch from DeepSeek API");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
