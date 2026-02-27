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
    const formData = await context.request.formData();
    const height = formData.get("height");
    const weight = formData.get("weight");
    const imageFile = formData.get("image") as File;

    // 1. 텍스트 분석 (Chat Completion)
    const textPrompt = `
당신은 전문 퍼스널 스타일리스트입니다.
사용자의 신체 정보(키: ${height}cm, 몸무게: ${weight}kg)를 분석하여 맞춤형 스타일 컨설팅 보고서를 작성해주세요.
반드시 다음 JSON 구조로 응답하십시오:
{
  "body": "체형 분석 내용",
  "color": "퍼스널 컬러 분석 내용",
  "styles": ["추천템1", "추천템2"],
  "avoid": ["비추천1", "비추천2"],
  "tips": ["팁1", "팁2"]
}
    `;

    const textResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "developer", content: textPrompt }],
        response_format: { type: "json_object" },
      }),
    });

    const textData = await textResponse.json() as any;
    const analysis = JSON.parse(textData.choices[0].message.content);

    // 2. 헤어스타일 이미지 생성 (Image API)
    // 참고: 실제 이미지 편집(Edits)은 이미지 포맷 제약이 까다로워 일반 생성을 우선 시도하거나 프롬프트를 강화합니다.
    // 여기서는 사용자의 요청대로 3x3 그리드 이미지를 생성하는 로직을 추가합니다.
    let hairImageUrl = null;
    try {
      const imagePrompt = "너는 최고의 헤어스타일리스트야. 3*3그리드로, 어떤 헤어스타일지 설명과 함께 첨부된 사진과 어울리는 헤어스타일 9개 생성해줘. 단 얼굴의 특징은 유지하고 헤어스타일만 다양하게 변형해줘.";
      
      // 이미지 편집 API 호출 (dall-e-2 기반)
      const imgFormData = new FormData();
      imgFormData.append("image", imageFile);
      imgFormData.append("prompt", imagePrompt);
      imgFormData.append("n", "1");
      imgFormData.append("size", "1024x1024");
      // 모델은 dall-e-2를 사용 (이미지 편집 지원 모델)
      imgFormData.append("model", "dall-e-2");

      const imageResponse = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: imgFormData,
      });

      if (imageResponse.ok) {
        const imageData = await imageResponse.json() as any;
        hairImageUrl = imageData.data[0].url;
      }
    } catch (e) {
      console.error("Image generation failed:", e);
    }

    return new Response(JSON.stringify({ ...analysis, hairImageUrl }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Failed to analyze style." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
