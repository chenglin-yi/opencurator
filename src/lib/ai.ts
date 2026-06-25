import { APIConfig, AIMessage, AIResponse } from "@/types/ai";

export async function callAI(
  config: APIConfig,
  messages: AIMessage[],
  options?: { maxTokens?: number }
): Promise<AIResponse> {
  const { provider, apiKey, endpoint, model } = config;

  if (!apiKey) {
    throw new Error("请先配置API Key");
  }

  const url = normalizeEndpoint(endpoint || "", provider);

  // 验证URL格式
  try {
    new URL(url);
  } catch {
    throw new Error(`无效的API端点URL: "${url}"。请输入完整的URL地址`);
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (provider === "claude") {
    headers["x-api-key"] = apiKey;
    headers["anthropic-version"] = "2023-06-01";
  } else {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const body = formatRequestBody(provider, model, messages, options?.maxTokens);

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API调用失败: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return formatResponse(provider, data);
}

export async function testConnection(config: APIConfig): Promise<{ success: boolean; message: string }> {
  const { provider, apiKey, endpoint, model } = config;

  if (!apiKey) {
    return { success: false, message: "请先填写API Key" };
  }

  // 验证并规范化URL格式
  const url = normalizeEndpoint(endpoint || "", provider);
  
  try {
    new URL(url);
  } catch {
    return { 
      success: false, 
      message: `无效的API端点URL: "${url}"。请输入完整的URL，例如: https://api.openai.com/v1/chat/completions` 
    };
  }

  try {
    const testMessages: AIMessage[] = [
      { role: "user", content: "Hi" }
    ];

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (provider === "claude") {
      headers["x-api-key"] = apiKey;
      headers["anthropic-version"] = "2023-06-01";
    } else {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const body = formatRequestBody(provider, model, testMessages);

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `连接失败: HTTP ${response.status}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message;
        }
      } catch {
        // ignore parse error
      }
      
      return { success: false, message: errorMessage };
    }

    await response.json();
    return { success: true, message: "连接成功！API配置正确。" };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return { success: false, message: "网络错误，请检查API端点是否正确" };
    }
    return { success: false, message: `连接失败: ${error instanceof Error ? error.message : "未知错误"}` };
  }
}

function getDefaultEndpoint(provider: string): string {
  switch (provider) {
    case "openai":
      return "https://api.openai.com/v1/chat/completions";
    case "claude":
      return "https://api.anthropic.com/v1/messages";
    default:
      throw new Error("请配置自定义API端点");
  }
}

function normalizeEndpoint(url: string, provider: string): string {
  if (!url) {
    return getDefaultEndpoint(provider);
  }

  // 移除末尾的斜杠
  url = url.replace(/\/+$/, "");

  // 如果URL以 /v1 结尾，自动补全 /chat/completions
  if (url.endsWith("/v1")) {
    return url + "/chat/completions";
  }

  // 如果URL以 /v1/ 结尾，自动补全 chat/completions
  if (url.endsWith("/v1/")) {
    return url + "chat/completions";
  }

  // 如果是自定义provider且URL不包含chat/completions，提示用户
  if (provider === "custom" && !url.includes("chat/completions") && !url.includes("messages")) {
    // 如果URL看起来像是OpenAI兼容格式，自动补全
    if (url.includes("/v1")) {
      return url + "/chat/completions";
    }
  }

  return url;
}

function formatRequestBody(
  provider: string,
  model: string,
  messages: AIMessage[],
  maxTokens?: number
) {
  const tokenLimit = maxTokens || 4000;
  switch (provider) {
    case "openai":
    case "custom":
      return {
        model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: 0.7,
        max_tokens: tokenLimit,
      };
    case "claude":
      return {
        model,
        messages: messages
          .filter((m) => m.role !== "system")
          .map((m) => ({
            role: m.role,
            content: m.content,
          })),
        system: messages.find((m) => m.role === "system")?.content || "",
        max_tokens: tokenLimit,
      };
    default:
      throw new Error(`不支持的提供商: ${provider}`);
  }
}

function formatResponse(provider: string, data: any): AIResponse {
  let content: string;
  
  switch (provider) {
    case "openai":
    case "custom":
      content = data.choices[0].message.content;
      break;
    case "claude":
      content = data.content[0].text;
      break;
    default:
      throw new Error(`不支持的提供商: ${provider}`);
  }

  return {
    content,
    usage: data.usage
      ? {
          promptTokens: data.usage.prompt_tokens || data.usage.input_tokens || 0,
          completionTokens: data.usage.completion_tokens || data.usage.output_tokens || 0,
          totalTokens: data.usage.total_tokens || 
            ((data.usage.input_tokens || 0) + (data.usage.output_tokens || 0)),
        }
      : undefined,
  };
}

export function extractJSON(content: string): string {
  // 尝试提取 ```json ... ``` 代码块中的内容
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  
  // 尝试提取 { ... } 或 [ ... ] 格式的JSON
  const jsonObjectMatch = content.match(/(\{[\s\S]*\})/);
  if (jsonObjectMatch) {
    return jsonObjectMatch[1].trim();
  }
  
  const jsonArrayMatch = content.match(/(\[[\s\S]*\])/);
  if (jsonArrayMatch) {
    return jsonArrayMatch[1].trim();
  }
  
  // 返回原始内容
  return content;
}

/**
 * 修复AI生成的JSON中常见的格式问题
 * 使用字符级状态机，正确处理嵌套结构中的未转义引号
 */
function sanitizeJSON(raw: string): string {
  let s = raw;

  // 移除行尾注释 // ...（但不破坏字符串内的 //）
  // 先用状态机移除注释
  s = removeJsonComments(s);

  // 修复：对象/数组末尾的多余逗号  ,} 或 ,]
  s = s.replace(/,\s*([\]}])/g, "$1");

  // 修复：字符串值中的未转义换行符
  s = escapeNewlinesInStrings(s);

  // 修复：字符串值中的未转义双引号（核心修复）
  s = fixUnescapedQuotesInStrings(s);

  return s;
}

/**
 * 使用状态机移除JSON中的行尾注释
 */
function removeJsonComments(json: string): string {
  const result: string[] = [];
  let inString = false;
  let escaped = false;
  let i = 0;

  while (i < json.length) {
    const ch = json[i];

    if (escaped) {
      result.push(ch);
      escaped = false;
      i++;
      continue;
    }

    if (ch === "\\") {
      result.push(ch);
      escaped = true;
      i++;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      result.push(ch);
      i++;
      continue;
    }

    if (!inString && ch === "/" && json[i + 1] === "/") {
      // 跳过行尾注释
      while (i < json.length && json[i] !== "\n") i++;
      continue;
    }

    result.push(ch);
    i++;
  }

  return result.join("");
}

/**
 * 使用状态机转义字符串值中的裸换行
 */
function escapeNewlinesInStrings(json: string): string {
  const result: string[] = [];
  let inString = false;
  let escaped = false;

  for (let i = 0; i < json.length; i++) {
    const ch = json[i];

    if (escaped) {
      result.push(ch);
      escaped = false;
      continue;
    }

    if (ch === "\\" && inString) {
      result.push(ch);
      escaped = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      result.push(ch);
      continue;
    }

    if (inString && (ch === "\n" || ch === "\r")) {
      result.push(ch === "\n" ? "\\n" : "\\r");
      continue;
    }

    result.push(ch);
  }

  return result.join("");
}

/**
 * 使用状态机修复字符串值中的未转义双引号
 * 核心思路：遍历字符，跟踪是否在字符串内。
 * 当在字符串内遇到一个裸 " 时，判断它是结构性引号（结束/开始字符串）还是内容引号。
 * 判断依据：看这个 " 之后到下一个 " 之间的内容是否像合法的JSON结构。
 */
function fixUnescapedQuotesInStrings(json: string): string {
  const chars = [...json];
  const result: string[] = [];
  let inString = false;
  let escaped = false;
  let i = 0;

  while (i < chars.length) {
    const ch = chars[i];

    // 处理转义字符
    if (escaped) {
      result.push(ch);
      escaped = false;
      i++;
      continue;
    }

    // 在字符串内遇到反斜杠
    if (ch === "\\" && inString) {
      result.push(ch);
      escaped = true;
      i++;
      continue;
    }

    // 遇到引号
    if (ch === '"') {
      if (!inString) {
        // 进入字符串
        inString = true;
        result.push(ch);
        i++;
        continue;
      }

      // 在字符串内遇到 " - 判断是结束引号还是内容引号
      // 向后看：这个 " 之后是什么字符？
      const afterQuote = lookAheadNonWhitespace(chars, i + 1);

      if (
        afterQuote === "," ||
        afterQuote === "}" ||
        afterQuote === "]" ||
        afterQuote === ":" ||
        afterQuote === "" // JSON末尾
      ) {
        // 这是结构性结束引号
        inString = false;
        result.push(ch);
        i++;
        continue;
      }

      // 不是结构性引号，说明是字符串内容中的裸引号，需要转义
      result.push('\\"');
      i++;
      continue;
    }

    result.push(ch);
    i++;
  }

  return result.join("");
}

/**
 * 从指定位置向后查找第一个非空白字符
 */
function lookAheadNonWhitespace(chars: string[], start: number): string {
  for (let j = start; j < chars.length; j++) {
    if (chars[j] !== " " && chars[j] !== "\t" && chars[j] !== "\n" && chars[j] !== "\r") {
      return chars[j];
    }
  }
  return "";
}

/**
 * 解析AI返回的JSON，带自动修复重试
 */
export function parseAIJSON<T = any>(content: string): T {
  const raw = extractJSON(content);

  // 第一次尝试：直接解析
  try {
    return JSON.parse(raw);
  } catch {
    // ignore
  }

  // 第二次尝试：修复常见问题后解析
  try {
    const sanitized = sanitizeJSON(raw);
    return JSON.parse(sanitized);
  } catch {
    // ignore
  }

  // 第三次尝试：修复截断的JSON（补全缺失的括号）
  try {
    const sanitized = sanitizeJSON(raw);
    const completed = completeTruncatedJSON(sanitized);
    return JSON.parse(completed);
  } catch (e) {
    throw new Error(
      `JSON解析失败: ${e instanceof Error ? e.message : "未知错误"}。AI返回的内容格式不规范，请重试。`
    );
  }
}

/**
 * 尝试修复被截断的JSON
 * 跟踪未闭合的 { [ 和 "，补全缺失的闭合符号
 */
function completeTruncatedJSON(json: string): string {
  // 移除末尾可能的不完整token
  let s = json.trimEnd();

  // 如果末尾有不完整的字符串（引号没闭合），先尝试补上
  // 检查最后一个有效字符
  const stack: string[] = [];
  let inString = false;
  let escaped = false;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (ch === "\\" && inString) {
      escaped = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (ch === "{") stack.push("}");
      else if (ch === "[") stack.push("]");
      else if (ch === "}" || ch === "]") stack.pop();
    }
  }

  // 如果在字符串中间被截断，先闭合字符串
  if (inString) {
    s += '"';
  }

  // 移除末尾可能的不完整token（如截断的key/value）
  // 例如 {"key": "val" 中 "val" 后面可能缺逗号或闭合
  // 尝试移除末尾不完整的部分
  const trailingComma = s.match(/,\s*$/);
  if (trailingComma) {
    s = s.slice(0, trailingComma.index);
  }

  // 补全未闭合的括号
  while (stack.length > 0) {
    const closer = stack.pop()!;
    // 如果最后一个非空白字符不是逗号，直接加闭合
    const lastNonWs = s.trimEnd().slice(-1);
    if (lastNonWs === ",") {
      // 移除尾逗号再闭合
      s = s.trimEnd().slice(0, -1);
    }
    s += closer;
  }

  return s;
}
