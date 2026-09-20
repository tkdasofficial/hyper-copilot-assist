import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/copilot/")({
  beforeLoad: () => {
    throw redirect({ to: "/copilot/new" });
  },
});
