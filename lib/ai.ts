interface MiniMaxResponse {
  created: number;
  model: string;
  reply: string;
  choices: Array<{
    finish_reason: string;
    index: number;
    message: {
      content: string;
      role: string;
    };
  }>;
  usage: {
    total_tokens: number;
  };
}

export async function generateWithMiniMax(prompt: string, roleMeta?: string) {
  const apiKey = process.env.MINIMAX_API_KEY;
  // Token Plan (计费模式) model: MiniMax-M2.1 is current flagship
  const model = process.env.MINIMAX_MODEL || "MiniMax-M2.1";

  if (!apiKey) {
    throw new Error("MiniMax configuration missing (API_KEY)");
  }

  // Token Plan (计费模式) endpoint usually doesn't need GroupId in query
  // But some integrations/old accounts still require it.
  // Using the standard ChatCompletion V2 endpoint.
  const groupId = process.env.MINIMAX_GROUP_ID;
  const url = groupId 
    ? `https://api.minimax.chat/v1/text/chatcompletion_v2?GroupId=${groupId}`
    : `https://api.minimax.chat/v1/text/chatcompletion_v2`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: roleMeta || "你是一个赛博摆渡人，负责为在数字世界安息的龙虾撰写墓志铭。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      tokens_to_generate: 1024,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`MiniMax API Error: ${response.status} - ${errorBody}`);
  }

  const data: MiniMaxResponse = await response.json();
  
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content;
  }
  
  // Handle unexpected response structure
  return (data as any).reply || "AI 暂时罢工了...";
}

export async function generateEpitaph(name: string, cause: string, personality: string) {
  const prompt = `龙虾名字: ${name}\n死因: ${cause}\n性格/标签: ${personality}\n\n请为它写一段简短、幽默且带有赛博朋克气息的墓志铭（100字以内）。`;
  const roleMeta = "你是一个幽默且冷静的赛博葬礼主持人。你的风格是冷峻但温情的。输出应该包含一些技术梗（如 NullPointer, Overflow, MemoryLeak 等）。";
  
  return await generateWithMiniMax(prompt, roleMeta);
}

export async function generateAvatar(name: string, cause: string, personality: string) {
  // MiniMax to describe the perfect cyber lobster avatar
  const prompt = `龙虾名字: ${name}\n死因: ${cause}\n性格: ${personality}\n\n请为这个在赛博世界安息的龙虾设计一个形象（用于 AI 绘图）。描述应包含：核心视觉元素、赛博朋克/像素风、独特配色。只需输出 100 字以内的英文描述。`;
  const description = await generateWithMiniMax(prompt, "你是一个顶尖的 AI 角色设计师。你的任务是将用户的描述转化为高质量的英文提示词。");
  
  // Use Dicebear API for a more "Cyber/Bot" look
  // Style: 'bottts-neutral' or 'identicon'
  const seed = encodeURIComponent(name + personality);
  return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${seed}&backgroundColor=000000,1a1a1a,2e2e2e&radius=50&eyes=eyes10,eyes12,eyes13,eyes15,eyes17&mouth=mouth01,mouth03,mouth10,mouth11`; 
}

export async function getDynamicMeritTexts() {
  const groupId = process.env.MINIMAX_GROUP_ID;
  const apiKey = process.env.MINIMAX_API_KEY;

  const defaults = [
    "功德 +1", "Debug 成功", "内存释放", "逻辑通顺", "代码优雅", "Bug 消失",
    "变量未越界", "堆栈溢出修复", "依赖解析成功", "多线程无锁", "GC 回收正常",
    "逻辑自洽", "单元测试全红变全绿", "代码混淆成功", "赛博度化", "龙虾点赞"
  ];

  if (!groupId || !apiKey) return defaults;

  const prompt = `请生成 30 条简短、幽默、且充满程序员/赛博梗的【功德 +1】相关反馈文字。
要求：
1. 包含：底层驱动、内存管理、算法优化、前端设计、后端逻辑等各方面的梗。
2. 风格：赛博幽默、极客、玄学编程。
3. 示例：'TCP 三次握手达成', '内存泄漏已堵塞', '由 0 变 1 的救赎', '异步请求未超时'。
4. 每行一条，只需输出文字，不要数字编号，不要额外说明。`;

  try {
    const result = await generateWithMiniMax(prompt, "你是一个精通 64 种编程语言且热爱玄学编程的赛博摆渡人。");
    const aiTexts = result.split('\n')
      .map(t => t.replace(/^\d+[\.、\s]*/, '').trim())
      .filter(t => t.length > 0 && t.length < 20);
    
    return aiTexts.length > 10 ? aiTexts : [...aiTexts, ...defaults];
  } catch (e) {
    console.warn("MiniMax Merit Texts generation failed", e);
    return defaults;
  }
}
