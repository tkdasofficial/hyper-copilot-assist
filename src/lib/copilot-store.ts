export type CopilotRole = "user" | "assistant";

export type CopilotMessage = {
  id: string;
  role: CopilotRole;
  text: string;
  at: number;
};

export type CopilotConversation = {
  id: string;
  title: string;
  model: string;
  createdAt: number;
  updatedAt: number;
  messages: CopilotMessage[];
};

export const COPILOT_MODELS = [
  { id: "speed", label: "Copilot Speed", detail: "Quick responses" },
  { id: "flash", label: "Copilot Flash", detail: "Balanced" },
  { id: "heavy", label: "Copilot Heavy", detail: "Deep thinking" },
];

const STORAGE_KEY = "hyper:copilot:chats";

type State = {
  chats: CopilotConversation[];
  pendingChatId: string | null;
};

let state: State = { chats: [], pendingChatId: null };
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CopilotConversation[];
      if (Array.isArray(parsed)) state = { ...state, chats: parsed };
    }
  } catch {
    /* ignore unreadable storage */
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.chats));
  } catch {
    /* ignore quota errors */
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function setState(next: Partial<State>, save = true) {
  state = { ...state, ...next };
  if (save) persist();
  emit();
}

export function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): State {
  hydrate();
  return state;
}

export function getServerSnapshot(): State {
  return { chats: [], pendingChatId: null };
}

function makeId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function titleFrom(prompt: string) {
  const clean = prompt.replace(/\s+/g, " ").trim();
  return clean.length > 48 ? `${clean.slice(0, 48)}…` : clean || "New chat";
}

function reply(prompt: string, model: string) {
  const label = COPILOT_MODELS.find((m) => m.id === model)?.label ?? "Copilot Speed";
  return `Here is how I would approach "${titleFrom(prompt)}" with ${label}:\n\n1. Clarify the goal and the audience.\n2. Draft the shortest version that already works.\n3. Refine one detail at a time and keep what performs.`;
}

export function createChat(model: string): string {
  hydrate();
  const now = Date.now();
  const chat: CopilotConversation = {
    id: makeId(),
    title: "New chat",
    model,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
  setState({ chats: [chat, ...state.chats] });
  return chat.id;
}

export function deleteChat(id: string) {
  hydrate();
  setState({ chats: state.chats.filter((chat) => chat.id !== id) });
}

export function clearChats() {
  hydrate();
  setState({ chats: [] });
}

export function sendMessage(chatId: string, prompt: string, model: string) {
  hydrate();
  const text = prompt.trim();
  if (!text) return;
  const now = Date.now();
  const userMessage: CopilotMessage = { id: makeId(), role: "user", text, at: now };

  const chats = state.chats.map((chat) =>
    chat.id === chatId
      ? {
          ...chat,
          model,
          title: chat.messages.length === 0 ? titleFrom(text) : chat.title,
          updatedAt: now,
          messages: [...chat.messages, userMessage],
        }
      : chat,
  );
  setState({ chats, pendingChatId: chatId });

  window.setTimeout(() => {
    const answer: CopilotMessage = {
      id: makeId(),
      role: "assistant",
      text: reply(text, model),
      at: Date.now(),
    };
    setState({
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? { ...chat, updatedAt: Date.now(), messages: [...chat.messages, answer] }
          : chat,
      ),
      pendingChatId: state.pendingChatId === chatId ? null : state.pendingChatId,
    });
  }, 1400);
}
