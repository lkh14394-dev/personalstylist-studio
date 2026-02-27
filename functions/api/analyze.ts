interface Env {
  OPENAI_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { OPENAI_API_KEY } = context.env;

  if (!OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "OpenAI API Key is not configured." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { height, weight, photoDescription } = await context.request.json() as any;

    const prompt = `
당신은 전문 퍼스널 스타일리스트입니다.
사용자의 신체 정보를 분석하여 맞춤형 스타일 컨설팅 보고서를 JSON 형식으로 작성해주세요.

사용자 정보:
- 키: ${height}cm
- 몸무게: ${weight}kg
${photoDescription ? `- 사진 설명: ${photoDescription}` : ""}

반드시 아래의 JSON 구조로만 응답해주세요:
{
  "body": "체형 분석 내용 (문자열)",
  "color": "퍼스널 컬러 분석 내용 (문자열)",
  "styles": ["추천 아이템 1", "추천 아이템 2", "추천 아이템 3"],
  "avoid": ["피해야 할 스타일 1", "피해야 할 스타일 2"],
  "tips": ["스타일링 팁 1", "스타일링 팁 2"]
}

친절하고 전문적인 톤으로 작성해주세요.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // 혹은 gpt-3.5-turbo
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    const data = await response.json() as any;
    const result = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to analyze style." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
