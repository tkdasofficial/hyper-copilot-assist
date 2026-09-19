import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/hyper/Sidebar";
import { TopBar } from "@/components/hyper/TopBar";
import { CopilotChat } from "@/components/hyper/CopilotChat";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () =>
    pageHead({
      path: "/dashboard",
      title: "Copilot \u2014 Hyper Copilot",
      description:
        "Chat with Hyper Copilot to create, plan, analyze and turn your ideas into action.",
      noindex: true,
      keywords: ["Hyper Copilot chat", "AI copilot workspace"],
    }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background">
      <Sidebar />
      <div className="lg:pl-[248px]">
        <TopBar />

        <main className="overflow-x-hidden"><CopilotChat /></main>
      </div>
    </div>
  );
}
