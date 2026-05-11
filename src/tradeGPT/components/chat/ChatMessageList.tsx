import { useCallback, useState, type RefObject } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiCopy, FiEdit2, FiCheck } from "react-icons/fi";
import type { TradeModeId, TradeModeMeta } from "../../lib/chatApi";
import type { Components } from "react-markdown";
import { pickStarterSuggestions } from "../../lib/suggestedQuestions";
import { isMongoObjectId } from "../../lib/mongoId";
import { COPY_FEEDBACK_RESET_MS } from "../../config/constants";

const MARKDOWN_PLUGINS = [remarkGfm];

const MARKDOWN_COMPONENTS: Components = {
  table: ({ children, ...props }) => (
    <div className="my-2 max-w-full overflow-x-auto rounded-lg border border-th-border">
      <table {...props} className="w-full min-w-[16rem] border-collapse text-sm">
        {children}
      </table>
    </div>
  ),
};

const PROSE_CLS = [
  "prose prose-sm max-w-none leading-relaxed dark:prose-invert",
  "prose-headings:text-white",
  "prose-p:my-2 prose-p:text-white",
  "prose-a:text-teal-400 prose-a:no-underline hover:prose-a:underline",
  "prose-strong:text-white",
  "prose-code:rounded prose-code:bg-th-code prose-code:px-1.5 prose-code:py-0.5 prose-code:text-teal-200 prose-code:before:content-none prose-code:after:content-none",
  "prose-pre:rounded-lg prose-pre:bg-th-code prose-pre:p-4 prose-pre:text-slate-100",
  "prose-ol:my-2 prose-ul:my-2 prose-li:my-0.5 prose-li:text-white",
  "prose-table:text-sm prose-th:border prose-th:border-th-border prose-th:bg-th-surface prose-th:px-3 prose-th:py-1.5 prose-th:text-white prose-td:border prose-td:border-th-border prose-td:px-3 prose-td:py-1.5 prose-td:text-white",
  "prose-blockquote:border-teal-500 prose-blockquote:text-slate-200",
  "prose-hr:border-th-border",
].join(" ");

export type UiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
  /** Mode selected when this user message was sent (from server or optimistic UI). */
  askedMode?: TradeModeId;
};

type Props = {
  messages: UiMessage[];
  streamingContent: string;
  /** True while the assistant request is in flight (including before first streamed token). */
  sending: boolean;
  /** Placed inside the scroll area so `scrollIntoView` moves the chat transcript scrollbar. */
  scrollAnchorRef?: RefObject<HTMLDivElement | null>;
  mode: TradeModeId;
  /** Labels for mode marks on user bubbles and chips. */
  modeOptions: TradeModeMeta[];
  /** Used to vary empty-state starters per conversation. */
  conversationId: string;
  onPickSuggestion: (text: string) => void;
  onCopy: (text: string) => Promise<void>;
  onEditUserMessage: (messageId: string, content: string) => void;
  showFollowUpSuggestions: boolean;
  /** LLM-generated follow-ups keyed by assistant message id. */
  followUpByMessageId: Record<string, string[]>;
  followUpStatusByMessageId: Record<
    string,
    { status: "ready" | "withdrawn"; notice?: string }
  >;
};

function SuggestionChips({
  items,
  keySeed,
  onPick,
}: {
  items: string[];
  /** Avoid duplicate React keys if the same text appears twice in a pool. */
  keySeed?: string;
  onPick: (t: string) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2 px-0.5">
      {items.map((q, i) => (
        <button
          key={keySeed ? `${keySeed}:${i}:${q}` : `${i}:${q}`}
          type="button"
          onClick={() => onPick(q)}
          className="max-w-full rounded-xl border border-th-border-muted bg-th-input px-3 py-2 text-left text-xs text-th-text transition-colors hover:border-teal-500/40 hover:bg-th-input-hover hover:text-teal-700 dark:hover:text-teal-300 md:text-sm"
        >
          {q}
        </button>
      ))}
    </div>
  );
}

function MessageToolbar({
  role,
  copied,
  onCopy,
  onEdit,
}: {
  role: "user" | "assistant";
  copied: boolean;
  onCopy: () => void;
  onEdit?: () => void;
}) {
  return (
    <div className="mt-1 flex items-center justify-end gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100">
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex items-center gap-1 rounded p-1.5 text-th-text-muted hover:bg-th-surface hover:text-teal-600 dark:hover:text-teal-300"
        title="Copy"
        aria-label="Copy message"
      >
        {copied ? <FiCheck aria-hidden className="h-4 w-4 text-teal-500" /> : <FiCopy aria-hidden className="h-4 w-4" />}
      </button>
      {copied && <span className="text-[10px] text-teal-600 dark:text-teal-300">Copied</span>}
      {role === "user" && onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="rounded p-1.5 text-th-text-muted hover:bg-th-surface hover:text-teal-600 dark:hover:text-teal-300"
          title="Edit message"
          aria-label="Edit message"
        >
          <FiEdit2 aria-hidden className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function modeMarkMeta(modeId: TradeModeId, options: TradeModeMeta[]) {
  return options.find((x) => x.id === modeId);
}

export function ChatMessageList({
  messages,
  streamingContent,
  sending,
  scrollAnchorRef,
  mode,
  modeOptions,
  conversationId,
  onPickSuggestion,
  onCopy,
  onEditUserMessage,
}: Props) {
  const awaitingFirstToken = sending && !streamingContent;
  const showEmpty = messages.length === 0 && !streamingContent && !awaitingFirstToken;
  const starters = pickStarterSuggestions(mode, conversationId);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = useCallback(
    async (key: string, text: string) => {
      await onCopy(text);
      setCopiedKey(key);
      window.setTimeout(
        () => setCopiedKey((k) => (k === key ? null : k)),
        COPY_FEEDBACK_RESET_MS,
      );
    },
    [onCopy]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      {showEmpty && (
        <div className="flex flex-1 flex-col items-center justify-center px-3 pb-8 pt-8 sm:px-4 sm:pt-12">
          <div className="w-full max-w-2xl text-center">
            <h2 className="text-2xl font-semibold text-th-text sm:text-3xl md:text-4xl">TradeGPT</h2>
            <p className="mt-3 text-sm text-th-text-muted sm:text-base">
              Pick a mode above, then choose a starter or type your own question.
            </p>
            <div className="mt-8">
              <SuggestionChips
                items={starters}
                keySeed={`empty-${conversationId}-${mode}`}
                onPick={onPickSuggestion}
              />
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-3xl flex-1 px-3 py-4 sm:px-4 sm:py-6">
        <ul className="space-y-6">
          {messages.map((m) => (
            <li key={m.id} className="group">
              {m.role === "user" ? (
                <div className="flex justify-end">
                  <div className="max-w-[min(85%,20rem)] sm:max-w-[85%]">
                    {m.askedMode && (
                      <div className="mb-1 flex justify-end">
                        <span
                          className="max-w-full truncate rounded-lg border border-teal-500/35 bg-teal-500/10 px-2 py-0.5 text-[10px] font-medium text-teal-700 dark:text-teal-300 sm:text-[11px]"
                          title={modeMarkMeta(m.askedMode, modeOptions)?.label ?? m.askedMode}
                        >
                          {modeMarkMeta(m.askedMode, modeOptions)?.shortLabel ?? m.askedMode}
                        </span>
                      </div>
                    )}
                    <div className="rounded-2xl border border-teal-500/20 bg-linear-to-br from-teal-500/10 via-th-surface to-emerald-500/5 px-4 py-3 text-th-text shadow-sm">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
                    </div>
                    <div className="flex justify-end">
                      <MessageToolbar
                        role="user"
                        copied={copiedKey === m.id}
                        onCopy={() => handleCopy(m.id, m.content)}
                        onEdit={
                          isMongoObjectId(m.id)
                            ? () => onEditUserMessage(m.id, m.content)
                            : undefined
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 sm:gap-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-teal-500 to-emerald-600 text-[10px] font-bold text-white shadow-sm sm:h-8 sm:w-8 sm:text-xs">
                    AI
                  </div>
                  <div className="min-w-0 flex-1 text-white">
                    <div className={PROSE_CLS}>
                      <ReactMarkdown remarkPlugins={MARKDOWN_PLUGINS} components={MARKDOWN_COMPONENTS}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                    <MessageToolbar
                      role="assistant"
                      copied={copiedKey === m.id}
                      onCopy={() => handleCopy(m.id, m.content)}
                    />
                  </div>
                </div>
              )}
            </li>
          ))}
          {awaitingFirstToken && (
            <li className="group flex gap-2 sm:gap-4" aria-live="polite" role="status">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-teal-500 to-emerald-600 text-[10px] font-bold text-white shadow-sm sm:h-8 sm:w-8 sm:text-xs">
                AI
              </div>
              <div className="flex min-w-0 flex-1 items-center gap-3 py-1 text-th-text">
                <span
                  className="inline-block h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-th-border-muted border-t-teal-500 motion-reduce:animate-none"
                  aria-hidden
                />
                <span className="text-sm text-th-text-muted">Thinking…</span>
              </div>
            </li>
          )}
          {streamingContent && (
            <li className="group flex gap-2 sm:gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-teal-500 to-emerald-600 text-[10px] font-bold text-white shadow-sm sm:h-8 sm:w-8 sm:text-xs">
                AI
              </div>
              <div className="min-w-0 flex-1 text-white">
                <div className={PROSE_CLS}>
                  <ReactMarkdown remarkPlugins={MARKDOWN_PLUGINS} components={MARKDOWN_COMPONENTS}>
                    {streamingContent}
                  </ReactMarkdown>
                </div>
                <span className="inline-block h-4 w-1 animate-pulse bg-teal-500" aria-hidden />
                <div className="mt-1">
                  <button
                    type="button"
                    onClick={() => handleCopy("stream", streamingContent)}
                    className="inline-flex items-center gap-1 rounded p-1.5 text-th-text-muted hover:bg-th-surface hover:text-teal-600 dark:hover:text-teal-300"
                    title="Copy"
                    aria-label="Copy streaming reply"
                  >
                    {copiedKey === "stream" ? (
                      <FiCheck aria-hidden className="h-4 w-4 text-teal-500" />
                    ) : (
                      <FiCopy aria-hidden className="h-4 w-4" />
                    )}
                  </button>
                  {copiedKey === "stream" && (
                    <span className="ml-1 text-[10px] text-teal-600 dark:text-teal-300">Copied</span>
                  )}
                </div>
              </div>
            </li>
          )}
        </ul>
      </div>
      <div ref={scrollAnchorRef} className="h-px shrink-0" aria-hidden />
    </div>
  );
}
