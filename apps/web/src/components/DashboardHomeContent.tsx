import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@acme/ui/components/button";
import { toast } from "@acme/ui/components/sonner";

import { apiClient } from "../lib/api-client";
import { apiQueryKeys } from "../lib/api-query-keys";
import { authClient } from "../lib/auth-client";

export function DashboardHomeContent() {
  const session = authClient.useSession();
  const queryClient = useQueryClient();

  const healthQuery = useQuery({
    queryKey: apiQueryKeys.health,
    queryFn: async () => {
      const res = await apiClient.api.health.$get();
      if (!res.ok) throw new Error("Health check failed");
      return res.json() as Promise<{ ok: true }>;
    },
  });

  const counterQuery = useQuery({
    queryKey: apiQueryKeys.counter,
    queryFn: async () => {
      const res = await apiClient.api.counter.$get();
      if (!res.ok) throw new Error("Counter fetch failed");
      return res.json() as Promise<{ count: number }>;
    },
  });

  const incrementMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.api.counter.increment.$post();
      if (!res.ok) throw new Error("Increment failed");
      return res.json() as Promise<{ count: number }>;
    },
  });

  async function incrementCounter() {
    if (session.isPending) return;
    if (!session.data?.user) {
      toast.error("Sign in to use the counter.");
      return;
    }
    try {
      const data = await incrementMutation.mutateAsync();
      queryClient.setQueryData(apiQueryKeys.counter, data);
    } catch {
      toast.error("Could not update the counter.");
    }
  }

  const isCounterBusy =
    (counterQuery.isPending && !counterQuery.isError) ||
    incrementMutation.isPending;
  const countText = counterQuery.isError
    ? "-"
    : counterQuery.isPending
      ? "..."
      : String(counterQuery.data?.count ?? 0);
  const healthText = healthQuery.isPending
    ? "Checking"
    : healthQuery.isError
      ? "Unreachable"
      : healthQuery.data?.ok
        ? "Healthy"
        : "Unexpected";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 text-foreground antialiased">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Minimal workspace. Live status only.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="border bg-background p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            API
          </p>
          <p className="mt-2 text-2xl font-medium">{healthText}</p>
          <p className="mt-1 text-xs text-muted-foreground">/api/health</p>
        </div>

        <div className="border bg-background p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Counter
          </p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-2xl font-medium tabular-nums">{countText}</p>
            <Button
              type="button"
              variant="secondary"
              className="h-9 px-3"
              disabled={isCounterBusy}
              onClick={() => void incrementCounter()}
            >
              Increment
            </Button>
          </div>
          {!session.data?.user ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Sign in required to update.
            </p>
          ) : null}
        </div>
      </section>

      <section className="border bg-background p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Repository
        </p>
        <a
          className="mt-2 inline-flex items-center gap-2 font-mono text-sm text-primary hover:underline"
          href="https://github.com/your-org/your-repo"
          target="_blank"
          rel="noreferrer"
        >
          your-org/your-repo
        </a>
      </section>
    </div>
  );
}
