import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, BrainCircuit, Check, ChevronDown, Paperclip, Sparkles, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const models = [
  { id: "hyper", label: "Hyper Copilot", detail: "Balanced" },
  { id: "flash", label: "Hyper Flash", detail: "Fast" },
  { id: "reason", label: "Hyper Reason", detail: "Deep thinking" },
];

const tasks = [
  { id: "general", label: "General", detail: "Ask anything" },
  { id: "create", label: "Create", detail: "Ideas and content" },
  { id: "plan", label: "Plan", detail: "Turn goals into steps" },
  { id: "analyze", label: "Analyze", detail: "Review and improve" },
];

const starters = [
  "Create a launch plan for my next project",
  "Turn an idea into a polished creative brief",
  "Help me plan a short social video",
];

type Message = { id: number; role: "user" | "assistant"; text: string };

function Selector({ label, options, value, onChange, icon: Icon }: {
  label: string;
  options: { id: string; label: string; detail: string }[];
  value: string;
  onChange: (value: string) => void;
  icon: typeof BrainCircuit;
}) {
  const selected = options.find((option) => option.id === value) ?? options[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="h-8 gap-1.5 rounded-full px-2.5 text-[12px] text-muted-foreground hover:text-foreground">
          <Icon className="h-3.5 w-3.5" strokeWidth={1.9} />
          <span className="max-w-[112px] truncate">{selected?.label}</span>
          <ChevronDown className="h-3 w-3 opacity-60" strokeWidth={2.2} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-56 rounded-lg p-1.5">
        <DropdownMenuLabel className="px-2 py-1.5 text-[11px] uppercase text-muted-foreground">{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuItem key={option.id} onSelect={() => onChange(option.id)} className="rounded-md px-2.5 py-2">
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold">{option.label}</span>
              <span className="block text-[11px] text-muted-foreground">{option.detail}</span>
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
  const [task, setTask] = useState(tasks[0]?.id ?? "general");
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
    const selectedModel = models.find((option) => option.id === model)?.label ?? "Hyper Copilot";
    const selectedTask = tasks.find((option) => option.id === task)?.label ?? "General";
    const stamp = Date.now();
    setMessages((current) => [
      ...current,
      { id: stamp, role: "user", text: prompt },
      { id: stamp + 1, role: "assistant", text: `I’m ready to help with this as a ${selectedTask.toLowerCase()} task using ${selectedModel}. I’ll keep the result focused and practical.` },
    ]);
    setValue("");
  };

  return (
    <section className="relative flex min-h-[calc(100vh-65px)] flex-col">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-48 pt-8 sm:px-6 sm:pb-44 lg:pt-12">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center pb-8 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-border bg-surface shadow-sm">
              <Sparkles className="h-5 w-5 text-spectral-3" strokeWidth={1.8} />
            </span>
            <h1 className="mt-5 text-2xl font-extrabold sm:text-3xl">What can I help with?</h1>
            <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground sm:text-sm">Ask, create, analyze, or turn your next idea into a clear plan.</p>
            <div className="mt-7 grid w-full max-w-xl gap-2 sm:grid-cols-3">
              {starters.map((starter) => (
                <Button key={starter} type="button" variant="outline" onClick={() => { setValue(starter); textareaRef.current?.focus(); }} className="h-auto min-h-20 whitespace-normal rounded-lg px-3 py-3 text-left text-[12px] leading-snug shadow-none">
                  {starter}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-7 py-4" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex gap-3", message.role === "user" && "justify-end")}>
                {message.role === "assistant" ? (
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-surface"><Bot className="h-4 w-4 text-spectral-3" strokeWidth={1.9} /></span>
                ) : null}
                <div className={cn("max-w-[85%] whitespace-pre-wrap text-[14px] leading-6", message.role === "user" ? "rounded-lg bg-foreground px-4 py-2.5 text-background" : "pt-1 text-foreground")}>{message.text}</div>
              </div>
            ))}
            <div ref={threadEndRef} />
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:left-[248px] lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-border-strong bg-surface shadow-float focus-within:ring-1 focus-within:ring-ring">
            <textarea ref={textareaRef} value={value} rows={1} aria-label="Message Copilot" placeholder="Message Copilot…" onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }} className="block max-h-[180px] min-h-[52px] w-full resize-none overflow-y-auto bg-transparent px-4 pb-2 pt-3.5 text-[14px] leading-6 text-foreground outline-none placeholder:text-muted-foreground" />
            <div className="flex flex-wrap items-center gap-1 border-t border-border px-2 py-2">
              <input ref={fileRef} type="file" className="hidden" multiple />
              <Button type="button" variant="ghost" size="icon" aria-label="Attach files" title="Attach files" onClick={() => fileRef.current?.click()} className="h-8 w-8 rounded-full text-muted-foreground"><Paperclip className="h-4 w-4" strokeWidth={1.9} /></Button>
              <Selector label="Models" options={models} value={model} onChange={setModel} icon={BrainCircuit} />
              <Selector label="Tasks" options={tasks} value={task} onChange={setTask} icon={WandSparkles} />
              <Button type="button" onClick={send} disabled={!value.trim()} className="ml-auto h-8 rounded-full px-3 text-[12px] font-bold">Run<ArrowUp className="h-3.5 w-3.5" strokeWidth={2.4} /></Button>
            </div>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-muted-foreground">Copilot can make mistakes. Check important information.</p>
        </div>
      </div>
    </section>
  );
}