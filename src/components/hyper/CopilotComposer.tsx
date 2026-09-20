import { useEffect, useRef } from "react";
import { BrainCircuit, Check, ChevronDown, Loader2, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COPILOT_MODELS } from "@/lib/copilot-store";

export function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      <path d="M6 3 21 12 6 21Z" fill="currentColor" />
    </svg>
  );
}

function ModelSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const selected = COPILOT_MODELS.find((option) => option.id === value) ?? COPILOT_MODELS[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1 rounded-full px-2 text-[11px] text-muted-foreground hover:text-foreground"
        >
          <BrainCircuit className="h-3 w-3" strokeWidth={1.9} />
          <span className="max-w-[96px] truncate">{selected?.label}</span>
          <ChevronDown className="h-3 w-3 opacity-60" strokeWidth={2.2} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-52 rounded-lg p-1">
        {COPILOT_MODELS.map((option) => (
          <DropdownMenuItem
            key={option.id}
            onSelect={() => onChange(option.id)}
            className="rounded-md px-2 py-1.5"
          >
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

export function CopilotComposer({
  value,
  onValueChange,
  model,
  onModelChange,
  onSubmit,
  pending,
  inputRef,
}: {
  value: string;
  onValueChange: (value: string) => void;
  model: string;
  onModelChange: (model: string) => void;
  onSubmit: () => void;
  pending: boolean;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const localRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef ?? localRef;
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 44), 160)}px`;
  }, [value, textareaRef]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 px-3 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 lg:left-[248px] lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="pointer-events-auto rounded-lg border border-border-strong bg-surface shadow-float focus-within:ring-1 focus-within:ring-ring">
          <textarea
            ref={textareaRef}
            value={value}
            rows={1}
            aria-label="Message Copilot"
            placeholder="Message Copilot…"
            onChange={(event) => onValueChange(event.target.value)}
            className="block max-h-[160px] min-h-[44px] w-full resize-none overflow-y-auto bg-transparent px-3 pb-1.5 pt-2.5 text-[13px] leading-5 text-foreground outline-none placeholder:text-muted-foreground"
          />
          <div className="flex flex-wrap items-center gap-0.5 px-1.5 pb-1.5 pt-0.5">
            <input ref={fileRef} type="file" className="hidden" multiple />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Attach files"
              title="Attach files"
              onClick={() => fileRef.current?.click()}
              className="h-7 w-7 rounded-full text-muted-foreground"
            >
              <Paperclip className="h-3.5 w-3.5" strokeWidth={1.9} />
            </Button>
            <ModelSelector value={model} onChange={onModelChange} />
            <Button
              type="button"
              onClick={onSubmit}
              disabled={pending || !value.trim()}
              aria-label={pending ? "Running" : "Run"}
              title={pending ? "Running" : "Run"}
              size="icon"
              className="ml-auto h-7 w-7 rounded-full"
            >
              {pending ? (
                <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2.4} />
              ) : (
                <PlayIcon className="h-2.5 w-2.5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
