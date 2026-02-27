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
    const textPrompt = `당신은 세계적인 수준의 전문 퍼스널 스타일리스트이자 체형 분석 전문가입니다. 
    다음 데이터를 바탕으로 사용자를 위한 상세한 맞춤형 스타일 컨설팅 보고서를 한국어로 작성해주세요.
    
    [사용자 데이터]
    - 키: ${height}cm
    - 몸무게: ${weight}kg
    
    [보고서 작성 지침]
    1. 모든 응답은 친절하고 전문적인 한국어 문체로 작성하세요.
    2. "body": 해당 신체 수치를 바탕으로 예상되는 체형 특징과 장점을 살리는 코디법을 설명하세요.
    3. "color": 퍼스널 컬러에 대한 조언을 포함하세요.
    4. "styles": 사용자의 체형에 꼭 필요한 3~5가지 패션 아이템 목록을 생성하세요.
    5. "avoid": 체형 보완을 위해 피해야 할 스타일이나 아이템을 나열하세요.
    6. "tips": 일상에서 바로 적용 가능한 스타일링 팁을 제공하세요.
    
    반드시 다음 JSON 구조를 엄격히 지켜주세요:
    { 
      "body": "체형 분석 내용", 
      "color": "퍼스널 컬러 조언", 
      "styles": ["아이템1", "아이템2", ...], 
      "avoid": ["피해야할 아이템1", ...], 
      "tips": ["팁1", "팁2", ...] 
    }`;

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
