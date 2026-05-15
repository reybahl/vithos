import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@repo/ui/components/button";
import { toast } from "@repo/ui/components/sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import reactLogo from "../assets/react.svg";
import viteLogo from "../assets/vite.svg";
import heroImg from "../assets/hero.png";
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
      toast.success("Count updated", {
        description: `New value: ${data.count}`,
      });
    } catch {
      toast.error("Could not update the counter.");
    }
  }

  const counterLoading = counterQuery.isPending && !counterQuery.isError;
  const counterUnreachable = counterQuery.isError;

  return (
    <div className="mx-auto max-w-4xl text-foreground antialiased">
      <div className="mb-10 flex flex-col items-center justify-center gap-6 text-center sm:flex-row sm:text-left">
        <div className="relative h-[179px] w-[170px] shrink-0">
          <img src={heroImg} className="h-full w-full object-contain" alt="" />
          <img
            src={reactLogo}
            className="absolute bottom-0 left-0 h-10 w-10"
            alt="React"
          />
          <img
            src={viteLogo}
            className="absolute -right-2 top-1/2 h-10 w-10 -translate-y-1/2"
            alt="Vite"
          />
        </div>
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">vithos</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Edit{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
              src/components/DashboardHomeContent.tsx
            </code>{" "}
            and save to test HMR
          </p>
          <p className="mt-2 font-mono text-sm text-muted-foreground">
            API{" "}
            <code className="rounded bg-muted px-1 text-foreground">
              /api/health
            </code>
            :{" "}
            {healthQuery.isPending
              ? "loading…"
              : healthQuery.isError
                ? "unreachable (start apps/api)"
                : healthQuery.data?.ok
                  ? "ok"
                  : "bad response"}
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-4"
            disabled={
              (counterQuery.isPending && !counterQuery.isError) ||
              incrementMutation.isPending
            }
            onClick={() => void incrementCounter()}
          >
            Count is{" "}
            {counterLoading
              ? "loading…"
              : counterUnreachable
                ? "unreachable"
                : counterQuery.data?.count}
          </Button>
        </div>
      </div>

      <div className="mb-6 h-2 bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_8px)] text-border" />

      <Card className="mx-auto max-w-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Repository</CardTitle>
          <CardDescription>Source for this project</CardDescription>
        </CardHeader>
        <CardContent>
          <a
            className="inline-flex items-center gap-2 font-mono text-sm text-primary hover:underline"
            href="https://github.com/reybahl/vithos"
            target="_blank"
            rel="noreferrer"
          >
            reybahl/vithos
          </a>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Components from{" "}
          <code className="rounded bg-muted px-1">@repo/ui</code>
        </CardFooter>
      </Card>
    </div>
  );
}
