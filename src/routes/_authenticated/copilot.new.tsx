import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/hyper/AppIcon";
import { CopilotShell } from "@/components/hyper/CopilotShell";
import { CopilotComposer } from "@/components/hyper/CopilotComposer";
import { COPILOT_MODELS, createChat, sendMessage } from "@/lib/copilot-store";

export const Route = createFileRoute("/_authenticated/copilot/new")({
  head: () =>
    pageHead({
      path: "/copilot/new",
      title: "New Chat \u2014 Hyper Copilot",
      description: "Start a new Hyper Copilot conversation and turn your idea into action.",
      noindex: true,
      keywords: ["Hyper Copilot new chat"],
    }),
  component: CopilotNew,
});

const starters = [
  "Create a launch plan for my next project",
  "Turn an idea into a polished creative brief",
  "Help me plan a short social video",
];

function CopilotNew() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [model, setModel] = useState(COPILOT_MODELS[0]?.id ?? "speed");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const run = () => {
    const prompt = value.trim();
    if (!prompt) return;
    const chatId = createChat(model);
    sendMessage(chatId, prompt, model);
    setValue("");
    void navigate({ to: "/copilot/$chatId", params: { chatId } });
  };

  return (
    <CopilotShell active="new">
      <section className="relative flex min-h-[calc(100vh-110px)] flex-col">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-36 pt-6 sm:px-6 lg:pt-8">
          <div className="flex flex-1 flex-col items-center justify-center pb-5 text-center">
            <AppIcon className="h-14 w-14 rounded-xl sm:h-16 sm:w-16" />
            <h1 className="mt-7 max-w-lg text-3xl font-medium leading-tight sm:text-4xl">
              What can I help with?
            </h1>
            <div className="mt-12 flex w-full max-w-md flex-col gap-1 text-left sm:mt-14">
              {starters.map((starter) => (
                <Button
                  key={starter}
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setValue(starter);
                    inputRef.current?.focus();
                  }}
                  className="h-auto min-h-11 w-full justify-start gap-4 rounded-sm px-3 py-2 text-left text-sm font-normal text-foreground sm:text-base"
                >
                  <ArrowRight className="h-5 w-5 shrink-0" strokeWidth={1.8} />
                  <span className="leading-snug">{starter}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <CopilotComposer
          value={value}
          onValueChange={setValue}
          model={model}
          onModelChange={setModel}
          onSubmit={run}
          pending={false}
          inputRef={inputRef}
        />
      </section>
    </CopilotShell>
  );
}
