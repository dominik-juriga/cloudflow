import { openai } from "@/ai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const generateSearchQueryContext = (content: string | null) => {
  if (!content) {
    return null;
  }

  try {
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
};

async function getQueryResponse(request: Request) {
  const { searchParams } = new URL(request.url);

  const topic = searchParams.get("topic") || "";
  const context = searchParams.get("context");
  const q = searchParams.get("q");

  const chatCompletion = await openai.chat.completions.create({
    messages: formatQueryContext(topic, q, generateSearchQueryContext(context)),
    response_format: q ? { type: "text" } : { type: "json_object" },
    model: "gpt-3.5-turbo",
  });

  return Response.json(chatCompletion.choices);
}

function formatQueryContext(
  topic: string,
  q: string | null,
  context: Array<string>
): Array<ChatCompletionMessageParam> {
  if (!q) {
    return [
      {
        role: "system",
        content: `You are a helpful assistant. You provide valid JSON output. You provide object with key 'facts' where the value is an array of objects: key 'fact' where the value represents the fact itself, key 'summary" where the value represents 3 word summary of fact value.`,
      },
      { role: "user", content: `Provide 10 facts about ${topic}` },
    ];
  }

  return [
    { role: "system", content: "You are a helpful assistant. Be concise." },
    { role: "assistant", content: [topic, ...context].join(". ") },
    { role: "user", content: q },
  ];
}

export { getQueryResponse as GET };
