import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, History, MessageSquare, Plus } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useCopilotStore } from "./useCopilotStore";
import { cn } from "@/lib/utils";

type Tab = "new" | "chat" | "history";

const tabClass =
  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors";

export function CopilotShell({
  active,
  chatId,
  children,
}: {
  active: Tab;
  chatId?: string;
  children: ReactNode;
}) {
  const { chats } = useCopilotStore();
  const [expanded, setExpanded] = useState(false);
  const currentId = chatId ?? chats[0]?.id;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background">
      <Sidebar />
      <div className="lg:pl-[248px]">
        <TopBar />

        <div className="px-3 pt-3 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <button
              type="button"
              onClick={() => setExpanded((open) => !open)}
              aria-expanded={expanded}
              className="flex w-full items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[12px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <MessageSquare className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="text-foreground">Copilot</span>
              <span className="truncate text-muted-foreground">
                {expanded ? "Tap to collapse" : "Tap to expand"}
              </span>
              <ChevronDown
                className={cn(
                  "ml-auto h-3.5 w-3.5 transition-transform",
                  expanded && "rotate-180",
                )}
                strokeWidth={2.2}
              />
            </button>

            {expanded ? (
              <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-surface p-1.5">
                <Link
                  to="/copilot/new"
                  onClick={() => setExpanded(false)}
                  className={cn(
                    tabClass,
                    active === "new"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                  )}
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
                  New
                </Link>
                {currentId ? (
                  <Link
                    to="/copilot/$chatId"
                    params={{ chatId: currentId }}
                    onClick={() => setExpanded(false)}
                    className={cn(
                      tabClass,
                      active === "chat"
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                    )}
                  >
                    <MessageSquare className="h-3.5 w-3.5" strokeWidth={2.2} />
                    Copilot
                  </Link>
                ) : (
                  <span className={cn(tabClass, "text-muted-foreground/60")}>
                    <MessageSquare className="h-3.5 w-3.5" strokeWidth={2.2} />
                    Copilot
                  </span>
                )}
                <Link
                  to="/copilot/history"
                  onClick={() => setExpanded(false)}
                  className={cn(
                    tabClass,
                    active === "history"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                  )}
                >
                  <History className="h-3.5 w-3.5" strokeWidth={2.2} />
                  History
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        <main className="overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
