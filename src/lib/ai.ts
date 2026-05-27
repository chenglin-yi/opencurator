import { APIConfig, AIMessage, AIResponse } from "@/types/ai";

export async function callAI(
  config: APIConfig,
  messages: AIMessage[]
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

  const body = formatRequestBody(provider, model, messages);

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
  messages: AIMessage[]
) {
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
        max_tokens: 2000,
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
        max_tokens: 2000,
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
