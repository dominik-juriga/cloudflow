import { openai } from "@/ai";

async function getQueryResponse(request: Request) {
  const { searchParams } = new URL(request.url);

  const topic = searchParams.get("topic") || "";
  const context = searchParams.get("context");
  const q = searchParams.get("q");

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: formatQueryContext(topic, q, context) },
    ],
    model: "gpt-3.5-turbo",
  });

  return Response.json(chatCompletion.choices);
}

function formatQueryContext(
  topic: string,
  q: string | null,
  context: string | null
) {
  if (!q)
    return `Provide 10 facts about ${topic}. Return JSON array of JSON objects with key 'fact' and string value, and key 'summary" and a 3 word summary of fact value.`;
  return ` Keep the answer as concise as possible. Topic: ${topic}. Context: ${context}. Answer: ${q}.`;
}

export { getQueryResponse as GET };
