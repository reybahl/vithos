import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@acme/ui/components/button";
import { toast } from "@acme/ui/components/sonner";

import { apiClient } from "../lib/api-client";
import { apiQueryKeys } from "../lib/api-query-keys";
import { authClient } from "../lib/auth-client";
import {
  decrementCounterCache,
  incrementCounterCache,
  isLastCounterMutation,
  type CounterData,
} from "../lib/counter-cache";

const counterIncrementMutationKey = ["counter", "increment"] as const;

export function DashboardHomeContent() {
  const session = authClient.useSession();
  const queryClient = useQueryClient();

  const {
    isPending: healthIsPending,
    isError: healthIsError,
    data: healthData,
  } = useQuery({
    queryKey: apiQueryKeys.health,
    queryFn: async () => {
      const res = await apiClient.api.health.$get();
      if (!res.ok) throw new Error("Health check failed");
      return res.json() as Promise<{ ok: true }>;
    },
  });

  const {
    isPending: counterIsPending,
    isError: counterIsError,
    data: counterData,
  } = useQuery({
    queryKey: apiQueryKeys.counter,
    queryFn: async () => {
      const res = await apiClient.api.counter.$get();
      if (!res.ok) throw new Error("Counter fetch failed");
      return res.json() as Promise<CounterData>;
    },
  });

  const incrementMutation = useMutation({
    mutationKey: counterIncrementMutationKey,
    mutationFn: async () => {
      const res = await apiClient.api.counter.increment.$post();
      if (!res.ok) throw new Error("Increment failed");
      return res.json() as Promise<CounterData>;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: apiQueryKeys.counter });
      queryClient.setQueryData<CounterData>(apiQueryKeys.counter, incrementCounterCache);
    },
    onError: () => {
      queryClient.setQueryData<CounterData>(apiQueryKeys.counter, decrementCounterCache);
      toast.error("Could not update the counter.");
    },
    onSettled: () => {
      if (
        isLastCounterMutation(
          queryClient.isMutating({
            mutationKey: counterIncrementMutationKey,
          }),
        )
      ) {
        void queryClient.invalidateQueries({ queryKey: apiQueryKeys.counter });
      }
    },
  });

  function incrementCounter() {
    if (session.isPending) return;
    if (!session.data?.user) {
      toast.error("Sign in to use the counter.");
      return;
    }
    incrementMutation.mutate();
  }

  const isCounterLoading = counterIsPending && !counterIsError;
  const countText = counterIsError
    ? "-"
    : counterIsPending
      ? "..."
      : String(counterData?.count ?? 0);
  const healthText = healthIsPending
    ? "Checking"
    : healthIsError
      ? "Unreachable"
      : healthData?.ok
        ? "Healthy"
        : "Unexpected";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 text-foreground antialiased">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Minimal workspace. Live status only.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="border bg-background p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">API</p>
          <p className="mt-2 text-2xl font-medium">{healthText}</p>
          <p className="mt-1 text-xs text-muted-foreground">/api/health</p>
        </div>

        <div className="border bg-background p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Counter</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-2xl font-medium tabular-nums">{countText}</p>
            <Button
              type="button"
              variant="secondary"
              className="h-9 px-3"
              disabled={isCounterLoading}
              onClick={() => void incrementCounter()}
            >
              Increment
            </Button>
          </div>
          {!session.data?.user ? (
            <p className="mt-2 text-xs text-muted-foreground">Sign in required to update.</p>
          ) : null}
        </div>
      </section>

      <section className="border bg-background p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Repository</p>
        <a
          className="mt-2 inline-flex items-center gap-2 font-mono text-sm text-primary hover:underline"
          href="https://github.com/reybahl/vithos"
          target="_blank"
          rel="noreferrer"
        >
          reybahl/vithos
        </a>
      </section>
    </div>
  );
}
