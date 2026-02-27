interface Env {
  OPENAI_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { OPENAI_API_KEY } = context.env;

  if (!OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "API 키가 설정되지 않았습니다. Cloudflare 설정에서 OPENAI_API_KEY를 추가해주세요." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const formData = await context.request.formData();
    const height = formData.get("height") || "미입력";
    const weight = formData.get("weight") || "미입력";
    const imageFile = formData.get("image") as File | null;

    // 1. 텍스트 스타일 분석 (필수)
    const textPrompt = `당신은 전문 퍼스널 스타일리스트입니다. 키 ${height}cm, 몸무게 ${weight}kg인 사용자를 위한 맞춤형 스타일 컨설팅 보고서를 JSON 형식으로 작성해주세요. { "body": "...", "color": "...", "styles": [], "avoid": [], "tips": [] } 구조를 지켜주세요.`;

    const textResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "system", content: textPrompt }],
        response_format: { type: "json_object" },
      }),
    });

    if (!textResponse.ok) {
      const errText = await textResponse.text();
      throw new Error(`OpenAI Text API 오류: ${errText}`);
    }

    const textData = await textResponse.json() as any;
    const analysis = JSON.parse(textData.choices[0].message.content);

    // 2. 헤어스타일 이미지 생성 (선택)
    let hairImageUrl = null;
    if (imageFile && imageFile.size > 0 && imageFile.type.includes("png")) {
      try {
        const imgFormData = new FormData();
        imgFormData.append("image", imageFile);
        imgFormData.append("prompt", "3x3 그리드로 다양한 헤어스타일 추천, 얼굴 유지");
        imgFormData.append("n", "1");
        imgFormData.append("size", "1024x1024");
        imgFormData.append("model", "dall-e-2");

        const imageResponse = await fetch("https://api.openai.com/v1/images/edits", {
          method: "POST",
          headers: { "Authorization": `Bearer ${OPENAI_API_KEY}` },
          body: imgFormData,
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json() as any;
          hairImageUrl = imageData.data[0].url;
        }
      } catch (e) {
        console.error("이미지 생성 건너뜀:", e);
      }
    }

    return new Response(JSON.stringify({ ...analysis, hairImageUrl }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
