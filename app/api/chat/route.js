export async function POST(req) {
  const key = process.env.ANTHROPIC_KEY;
  
  if (!key) {
    return Response.json({ error: "API key тохируулагдаагүй байна" }, { status: 500 });
  }

  const { messages } = await req.json();
  
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: "Та SolarEase платформын нарны цахилгаан үүсгүүрийн AI зөвлөх. Монгол хэлээр хариулна. 1kW=2,700,000₮ | 1980 kWh/kW/жил | 343₮/kWh | Карбон: 20% | Зээл: 3%, 60 сар",
      messages,
    }),
  });

  const d = await res.json();
  
  if (d.error) {
    return Response.json({ error: d.error.message }, { status: 400 });
  }
  
  return Response.json({ text: d.content?.[0]?.text });
}
