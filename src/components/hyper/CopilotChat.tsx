import { useEffect, useRef, useState } from "react";
import { BrainCircuit, Check, ChevronDown, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import lightIcon from "@/assets/light_app_icon.svg";
import darkIcon from "@/assets/dark_app_icon.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const models = [
  { id: "speed", label: "Copilot Speed", detail: "Quick responses" },
  { id: "flash", label: "Copilot Flash", detail: "Balanced" },
  { id: "heavy", label: "Copilot Heavy", detail: "Deep thinking" },
];

const starters = [
  "Create a launch plan for my next project",
  "Turn an idea into a polished creative brief",
  "Help me plan a short social video",
];

type Message = { id: number; role: "user" | "assistant"; text: string };

function AppIcon({ className }: { className?: string }) {
  return (
    <span className={cn("relative block shrink-0 overflow-hidden", className)}>
      <img src={lightIcon} alt="" className="h-full w-full object-contain dark:hidden" />
      <img src={darkIcon} alt="" className="hidden h-full w-full object-contain dark:block" />
    </span>
  );
}

function Selector({ options, value, onChange, icon: Icon }: {
  options: { id: string; label: string; detail: string }[];
  value: string;
  onChange: (value: string) => void;
  icon: typeof BrainCircuit;
}) {
  const selected = options.find((option) => option.id === value) ?? options[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="h-7 gap-1 rounded-full px-2 text-[11px] text-muted-foreground hover:text-foreground">
          <Icon className="h-3 w-3" strokeWidth={1.9} />
          <span className="max-w-[96px] truncate">{selected?.label}</span>
          <ChevronDown className="h-3 w-3 opacity-60" strokeWidth={2.2} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-52 rounded-lg p-1">
        {options.map((option) => (
          <DropdownMenuItem key={option.id} onSelect={() => onChange(option.id)} className="rounded-md px-2 py-1.5">
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-semibold">{option.label}</span>
              <span className="block text-[10px] text-muted-foreground">{option.detail}</span>
            </span>
            {option.id === value ? <Check className="h-4 w-4" strokeWidth={2.4} /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CopilotChat() {
  const [value, setValue] = useState("");
  const [model, setModel] = useState(models[0]?.id ?? "hyper");
  const [messages, setMessages] = useState<Message[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 52), 180)}px`;
  }, [value]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const send = () => {
    const prompt = value.trim();
    if (!prompt) return;
    const selectedModel = models.find((option) => option.id === model)?.label ?? "Copilot Speed";
    const stamp = Date.now();
    setMessages((current) => [
      ...current,
      { id: stamp, role: "user", text: prompt },
      { id: stamp + 1, role: "assistant", text: `I’m ready to help using ${selectedModel}. I’ll keep the result focused and practical.` },
    ]);
    setValue("");
  };

  return (
    <section className="relative flex min-h-[calc(100vh-65px)] flex-col">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-36 pt-6 sm:px-6 sm:pb-36 lg:pt-8">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center pb-6 text-center">
            <AppIcon className="h-9 w-9 rounded-lg" />
            <h1 className="mt-4 text-xl font-extrabold sm:text-2xl">What can I help with?</h1>
            <p className="mt-1.5 max-w-sm text-[12px] leading-relaxed text-muted-foreground">Ask, create, analyze, or turn your next idea into a clear plan.</p>
            <div className="mt-5 flex w-full max-w-md flex-col items-center gap-1">
              {starters.map((starter) => (
                <Button key={starter} type="button" variant="ghost" onClick={() => { setValue(starter); textareaRef.current?.focus(); }} className="h-7 w-full justify-start rounded-sm px-2 text-left text-[11px] font-normal text-muted-foreground hover:text-foreground">
                  {starter}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5 py-3" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex gap-3", message.role === "user" && "justify-end")}>
                {message.role === "assistant" ? (
                  <AppIcon className="mt-0.5 h-7 w-7 rounded-md" />
                ) : null}
                <div className={cn("max-w-[85%] whitespace-pre-wrap text-[13px] leading-5", message.role === "user" ? "rounded-md bg-foreground px-3 py-2 text-background" : "pt-1 text-foreground")}>{message.text}</div>
              </div>
            ))}
            <div ref={threadEndRef} />
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 px-3 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:left-[248px] lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-lg border border-border-strong bg-surface shadow-float focus-within:ring-1 focus-within:ring-ring">
            <textarea ref={textareaRef} value={value} rows={1} aria-label="Message Copilot" placeholder="Message Copilot…" onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }} className="block max-h-[160px] min-h-[44px] w-full resize-none overflow-y-auto bg-transparent px-3 pb-1.5 pt-2.5 text-[13px] leading-5 text-foreground outline-none placeholder:text-muted-foreground" />
            <div className="flex flex-wrap items-center gap-0.5 border-t border-border px-1.5 py-1.5">
              <input ref={fileRef} type="file" className="hidden" multiple />
              <Button type="button" variant="ghost" size="icon" aria-label="Attach files" title="Attach files" onClick={() => fileRef.current?.click()} className="h-7 w-7 rounded-full text-muted-foreground"><Paperclip className="h-3.5 w-3.5" strokeWidth={1.9} /></Button>
              <Selector options={models} value={model} onChange={setModel} icon={BrainCircuit} />
              <Button type="button" onClick={send} disabled={!value.trim()} aria-label="Run" title="Run" size="icon" className="ml-auto h-7 w-7 rounded-none"><Play className="h-3 w-3 fill-current" strokeWidth={2.2} strokeLinejoin="miter" strokeLinecap="butt" /></Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}