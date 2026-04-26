import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

function App() {
  const [count, setCount] = useState(0)

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
              Get started
            </h1>
            <p className="mt-2 text-lg text-neutral-600">
              Edit <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm">src/App.tsx</code>{' '}
              and save to test HMR
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

        <div className="grid gap-8 sm:grid-cols-2">
          <section className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Documentation</h2>
            <p className="mt-1 text-neutral-600">Your questions, answered</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  className="inline-flex items-center gap-2 text-violet-600 hover:underline"
                  href="https://vite.dev/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={viteLogo} className="h-4 w-4" alt="" />
                  Explore Vite
                </a>
              </li>
              <li>
                <a
                  className="inline-flex items-center gap-2 text-violet-600 hover:underline"
                  href="https://react.dev/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={reactLogo} className="h-4 w-4" alt="" />
                  Learn more
                </a>
              </li>
            </ul>
          </section>
          <section className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Connect</h2>
            <p className="mt-1 text-neutral-600">Join the Vite community</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  className="text-violet-600 hover:underline"
                  href="https://github.com/vitejs/vite"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  className="text-violet-600 hover:underline"
                  href="https://chat.vite.dev/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Discord
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default App
