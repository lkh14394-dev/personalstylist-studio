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

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // 최신 안정화 모델
        messages: [
          {
            role: "developer",
            content: [
              {
                type: "text",
                text: "당신은 전문 퍼스널 스타일리스트입니다.\n사용자의 사진과 신체 정보를 분석하여 맞춤형 스타일 컨설팅 보고서를 작성해주세요.\n보고서에는 다음 내용을 포함해주세요:\n1.체형 분석\n2.퍼스널 컬러 분석\n3.어울리는 스타일 및 패션 아이템 추천\n4.피해야 할 스타일\n5.코디 팁\n친절하고 전문적인 톤으로 작성해주세요.\n\n반드시 다음 JSON 구조로 응답하십시오:\n{\n  \"body\": \"체형 분석 내용\",\n  \"color\": \"퍼스널 컬러 분석 내용\",\n  \"styles\": [\"추천템1\", \"추천템2\"],\n  \"avoid\": [\"비추천1\", \"비추천2\"],\n  \"tips\": [\"팁1\", \"팁2\"]\n}"
              }
            ]
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `키 ${height}, 몸무게 ${weight}${photoDescription ? `, 특징: ${photoDescription}` : ""}`
              }
            ]
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json() as any;
      throw new Error(errorData.error?.message || "OpenAI API request failed");
    }

    const data = await response.json() as any;
    const result = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Failed to analyze style." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
