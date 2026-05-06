import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import { apiClient } from "./lib/api-client";

function App() {
  const [count, setCount] = useState(0);
  const [health, setHealth] = useState<{ ok: true } | "error" | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await apiClient.api.health.$get();
        if (!res.ok) {
          setHealth("error");
          return;
        }
        setHealth(await res.json());
      } catch {
        setHealth("error");
      }
    })();
  }, []);

  return (
    <div className="min-h-dvh text-neutral-800 antialiased [color-scheme:light_dark]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10 flex flex-col items-center justify-center gap-6 text-center sm:flex-row sm:text-left">
          <div className="relative h-[179px] w-[170px] shrink-0">
            <img
              src={heroImg}
              className="h-full w-full object-contain"
              alt=""
            />
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
            <h1 className="text-3xl font-semibold text-neutral-950 sm:text-4xl">
              vithos
            </h1>
            <p className="mt-2 text-lg text-neutral-600">
              Edit{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm">
                src/App.tsx
              </code>{" "}
              and save to test HMR
            </p>
            <p className="mt-2 font-mono text-sm text-neutral-500">
              API{" "}
              <code className="rounded bg-neutral-100 px-1">/api/health</code>:{" "}
              {health === null
                ? "loading…"
                : health === "error"
                  ? "unreachable (start apps/api)"
                  : health.ok
                    ? "ok"
                    : "bad response"}
            </p>
            <button
              type="button"
              className="mt-4 rounded-lg border border-violet-500/50 bg-violet-500/10 px-4 py-2 font-medium text-violet-800 transition hover:border-violet-500"
              onClick={() => setCount((c) => c + 1)}
            >
              Count is {count}
            </button>
          </div>
        </div>

        <div className="mb-6 h-2 bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_8px)] text-neutral-200" />

        <section className="mx-auto max-w-xl rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Repository</h2>
          <p className="mt-1 text-neutral-600">Source for this project</p>
          <div className="mt-4">
            <a
              className="inline-flex items-center gap-2 font-mono text-sm text-violet-600 hover:underline"
              href="https://github.com/reybahl/vithos"
              target="_blank"
              rel="noreferrer"
            >
              reybahl/vithos
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
