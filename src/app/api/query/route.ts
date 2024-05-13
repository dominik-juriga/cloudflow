import { openai } from "@/ai";

// Demo - explain
async function getQueryResponse(request: Request) {
  const { searchParams } = new URL(request.url);

  const topic = searchParams.get("topic") || "";
  const context = searchParams.get("context");
  const q = searchParams.get("q");

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: formatQueryContext(topic, q, context) },
    ],
    response_format: q ? { type: "text" } : { type: "json_object" },
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
    return `Provide 10 facts about ${topic}. Provide valid JSON output. Provide object with key 'facts' where the value is an array of objects: key 'fact' where the value represents the fact itself, key 'summary" where the value represents 3 word summary of fact value.`;
  return ` Keep the answer as concise as possible. Topic: ${topic}. Context: ${context}. Answer: ${q}.`;
}

// Demo - explain
export { getQueryResponse as GET };
