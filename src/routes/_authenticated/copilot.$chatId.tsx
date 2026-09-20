import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { AppIcon } from "@/components/hyper/AppIcon";
import { CopilotShell } from "@/components/hyper/CopilotShell";
import { CopilotComposer } from "@/components/hyper/CopilotComposer";
import { useCopilotStore } from "@/components/hyper/useCopilotStore";
import { COPILOT_MODELS, sendMessage } from "@/lib/copilot-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/copilot/$chatId")({
  head: () =>
    pageHead({
      path: "/copilot",
      title: "Copilot \u2014 Hyper Copilot",
      description: "Continue your Hyper Copilot conversation.",
      noindex: true,
      keywords: ["Hyper Copilot chat"],
    }),
  component: CopilotConversationPage,
});

function CopilotConversationPage() {
  const { chatId } = Route.useParams();
  const { chats, pendingChatId } = useCopilotStore();
  const chat = chats.find((item) => item.id === chatId);
  const [value, setValue] = useState("");
  const [model, setModel] = useState(chat?.model ?? COPILOT_MODELS[0]?.id ?? "speed");
  const endRef = useRef<HTMLDivElement>(null);
  const pending = pendingChatId === chatId;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chat?.messages.length, pending]);

  const run = () => {
    const prompt = value.trim();
    if (!prompt || pending) return;
    sendMessage(chatId, prompt, model);
    setValue("");
  };

  return (
    <CopilotShell active="chat" chatId={chatId}>
      <section className="relative flex min-h-[calc(100vh-110px)] flex-col">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-36 pt-4 sm:px-6">
          {!chat ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <AppIcon className="h-12 w-12 rounded-xl" />
              <p className="text-sm text-muted-foreground">This chat is no longer available.</p>
              <Link
                to="/copilot/history"
                className="rounded-full bg-foreground px-3 py-1.5 text-[12px] font-semibold text-background"
              >
                Open history
              </Link>
            </div>
          ) : (
            <div className="space-y-5 py-3" aria-live="polite">
              {chat.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-3", message.role === "user" && "justify-end")}
                >
                  {message.role === "assistant" ? (
                    <AppIcon className="mt-0.5 h-7 w-7 rounded-md" />
                  ) : null}
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap text-[13px] leading-5",
                      message.role === "user"
                        ? "rounded-md bg-foreground px-3 py-2 text-background"
                        : "pt-1 text-foreground",
                    )}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {pending ? (
                <div className="flex gap-3">
                  <AppIcon className="mt-0.5 h-7 w-7 rounded-md" />
                  <div className="flex items-center gap-1 pt-2.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-200ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-100ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                  </div>
                </div>
              ) : null}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {chat ? (
          <CopilotComposer
            value={value}
            onValueChange={setValue}
            model={model}
            onModelChange={setModel}
            onSubmit={run}
            pending={pending}
          />
        ) : null}
      </section>
    </CopilotShell>
  );
}
