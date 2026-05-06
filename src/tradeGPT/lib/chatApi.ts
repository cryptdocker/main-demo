import { getApiErrorMessage } from "./apiError";
import { mockBackendRequest, recordTradeGptDemoExchange } from "../../mocks/mockBackend";

async function mockJson<T = any>(url: string, init?: RequestInit): Promise<T> {
  const method = String(init?.method ?? "GET").toUpperCase();
  const headersInit = init?.headers ?? {};
  const headers: Record<string, string> = {};

  if (headersInit instanceof Headers) {
    headersInit.forEach((value, key) => {
      headers[key] = value;
    });
  } else if (Array.isArray(headersInit)) {
    for (const [k, v] of headersInit) headers[k] = v;
  } else {
    Object.assign(headers, headersInit as Record<string, string>);
  }

  const reply = await mockBackendRequest({
    url,
    method: method as any,
    headers,
    body: init?.body,
  });

  if (!reply.ok) {
    throw new Error(getApiErrorMessage(reply.body, `Request failed (${reply.status}).`));
  }
  return reply.body as T;
}

export type TradeModeId =
  | "market_analysis"
  | "trade_signals"
  | "strategy"
  | "risk_management"
  | "trader_psychology"
  | "news_sentiment"
  | "education"
  | "safe_binance_trading_bot"
  | "cryptdocker";

export type TradeModeMeta = {
  id: TradeModeId;
  label: string;
  shortLabel: string;
  description: string;
};

export async function fetchModes(): Promise<TradeModeMeta[]> {
  const data = await mockJson<{ modes: TradeModeMeta[] }>(`/trade-gpt/chat/modes`);
  return data.modes as TradeModeMeta[];
}

function authHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function listConversations(token: string) {
  const data = await mockJson<{ conversations: any[] }>(`/trade-gpt/chat/conversations`, {
    headers: authHeaders(token),
  });
  return data.conversations as {
    id: string;
    title: string;
    mode: TradeModeId;
    updatedAt: string;
    messageCount: number;
  }[];
}

export async function createConversation(token: string, mode: TradeModeId) {
  return await mockJson(`/trade-gpt/chat/conversations`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ mode }),
  });
}

export async function getConversation(token: string, id: string) {
  const data = await mockJson(`/trade-gpt/chat/conversations/${id}`, {
    headers: authHeaders(token),
  });
  return data as {
    id: string;
    title: string;
    mode: TradeModeId;
    messages: {
      id: string;
      role: string;
      content: string;
      createdAt: string;
      /** Present on user messages when saved (mode at time of send). */
      tradeMode?: TradeModeId;
      suggestedQuestions?: string[];
    }[];
  };
}

/** Plain-text export of every conversation (user + assistant messages). */
export async function buildChatHistoryExportText(token: string): Promise<string> {
  const list = await listConversations(token);
  const modeMetas = await fetchModes();
  const modeLabel = (id: TradeModeId): string =>
    modeMetas.find((x) => x.id === id)?.label ?? id;

  const lines: string[] = [
    "TradeGPT — chat history export",
    `Exported (UTC): ${new Date().toISOString()}`,
    `Conversations: ${list.length}`,
    "",
  ];
  const sorted = [...list].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  for (const c of sorted) {
    const conv = await getConversation(token, c.id);
    lines.push("=".repeat(72));
    lines.push(`Title: ${conv.title || "Untitled"}`);
    lines.push(`Conversation mode (current): ${modeLabel(conv.mode)}`);
    lines.push(`Conversation ID: ${conv.id}`);
    lines.push("-".repeat(72));
    for (const m of conv.messages) {
      if (m.role !== "user" && m.role !== "assistant") continue;
      const label = m.role === "user" ? "User" : "Assistant";
      const ts = m.createdAt ? new Date(m.createdAt).toISOString() : "";
      const modeMark =
        m.role === "user" && m.tradeMode
          ? ` | asked in mode: ${modeLabel(m.tradeMode)}`
          : "";
      lines.push(`[${label}${modeMark}] ${ts}`);
      lines.push(m.content.replace(/\r\n/g, "\n").trimEnd());
      lines.push("");
    }
    lines.push("");
  }
  return lines.join("\n");
}

export async function patchConversationMode(
  token: string,
  id: string,
  mode: TradeModeId
) {
  return await mockJson(`/trade-gpt/chat/conversations/${id}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ mode }),
  });
}

export async function deleteConversation(token: string, id: string) {
  await mockJson(`/trade-gpt/chat/conversations/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteAllConversations(token: string): Promise<{
  deletedConversations: number;
  deletedMessages: number;
}> {
  const data = await mockJson<{ deletedConversations: number; deletedMessages: number }>(
    `/trade-gpt/chat/conversations`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return {
    deletedConversations: Number(data.deletedConversations ?? 0),
    deletedMessages: Number(data.deletedMessages ?? 0),
  };
}

export async function rollbackFromMessage(
  token: string,
  conversationId: string,
  fromMessageId: string
) {
  return await mockJson(`/trade-gpt/chat/conversations/${conversationId}/rollback`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ fromMessageId }),
  });
}

export type StreamEvent =
  | { type: "delta"; content: string }
  | {
      type: "done";
      title?: string;
      model?: string;
      usedWebSearch?: boolean;
      assistantMessageId?: string;
      suggestedQuestions?: string[];
      followUpStatus?: "ready" | "withdrawn";
      followUpNotice?: string;
      router?: {
        needs_web_search?: boolean;
        complexity?: string;
        reason?: string;
      };
    }
  | { type: "error"; message: string };

export async function streamAssistantReply(
  token: string,
  conversationId: string,
  content: string,
  onEvent: (ev: StreamEvent) => void
): Promise<void> {
  // Demo: no backend streaming. Emit a deterministic mock "stream".
  if (!token) throw new Error("Session expired.");
  if (!conversationId) throw new Error("Conversation not found.");

  const assistantText =
    "You're using the TradeGPT demo.\n\n" +
    "This demo doesn't generate real AI responses yet.\n\n" +
    "To use the full TradeGPT experience, open the live site:\n" +
    "https://cryptdocker.com/trade-gpt";

  const { assistantMessageId } = recordTradeGptDemoExchange({
    conversationId,
    userText: content.trim(),
    assistantText,
  });

  // Emit a tiny "stream" so the UI visibly updates.
  const chunks = assistantText.split(/(\s+)/).filter(Boolean);

  for (const c of chunks) onEvent({ type: "delta", content: c });
  onEvent({
    type: "done",
    title: "Demo reply",
    model: "mock",
    usedWebSearch: false,
    assistantMessageId,
    suggestedQuestions: [],
    followUpStatus: "ready",
  });
}
