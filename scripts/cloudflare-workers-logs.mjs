const DEFAULT_WORKER = "vithos";
const DEFAULT_MINUTES = 30;
const DEFAULT_LIMIT = 200;

function usage() {
  console.log(`Usage: pnpm worker:logs -- [options]

Queries persisted Cloudflare Workers Logs. It does not use wrangler tail, which is live-only.

Required environment variables:
  CLOUDFLARE_API_TOKEN     API token with Workers Observability Write permission
  CLOUDFLARE_ACCOUNT_ID    Cloudflare account ID

Options:
  --minutes <n>            Look back this many minutes (default: ${DEFAULT_MINUTES})
  --limit <n>              Maximum events, 1-2000 (default: ${DEFAULT_LIMIT})
  --worker <name>          Worker script name (default: ${DEFAULT_WORKER})
  --search <text>          Full-text search, e.g. "auth_response_error"
  --json                   Print the complete Cloudflare response
  --help                   Show this help

Examples:
  pnpm worker:logs -- --search auth_response_error
  pnpm worker:logs -- --minutes 120 --search "Invalid origin"
`);
}

function parsePositiveInt(value, option, max) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) {
    throw new Error(`${option} must be an integer between 1 and ${max}.`);
  }
  return parsed;
}

function parseArgs(args) {
  const options = {
    limit: DEFAULT_LIMIT,
    minutes: DEFAULT_MINUTES,
    search: undefined,
    worker: DEFAULT_WORKER,
    json: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help") return { help: true };
    if (arg === "--json") {
      options.json = true;
      continue;
    }

    const value = args[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`${arg} requires a value.`);

    if (arg === "--minutes") options.minutes = parsePositiveInt(value, arg, 10_080);
    else if (arg === "--limit") options.limit = parsePositiveInt(value, arg, 2_000);
    else if (arg === "--worker") options.worker = value;
    else if (arg === "--search") options.search = value;
    else throw new Error(`Unknown option: ${arg}`);

    index += 1;
  }

  return options;
}

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} must be set.`);
  return value;
}

function eventLine(event) {
  const metadata = event?.$metadata ?? {};
  const workers = event?.$workers ?? {};
  const request = workers.event?.request ?? {};
  const response = workers.event?.response ?? {};
  const details = event?.message ?? event?.event ?? metadata.message ?? "";

  return JSON.stringify({
    timestamp: event?.timestamp ?? metadata.timestamp,
    requestId: workers.requestId,
    scriptVersion: workers.scriptVersion?.id,
    method: request.method,
    url: request.url,
    status: response.status,
    event: event?.event,
    message: details,
  });
}

async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args[0] === "--" ? args.slice(1) : args);
  if (options.help) {
    usage();
    return;
  }

  const token = requireEnv("CLOUDFLARE_API_TOKEN");
  const accountId = requireEnv("CLOUDFLARE_ACCOUNT_ID");
  const now = Date.now();
  const body = {
    queryId: "vithos-local-worker-log-query",
    timeframe: { from: now - options.minutes * 60_000, to: now },
    limit: options.limit,
    parameters: {
      view: "events",
      filters: [
        {
          key: "$metadata.service",
          operation: "eq",
          type: "string",
          value: options.worker,
        },
      ],
      ...(options.search
        ? { needle: { value: options.search, isRegex: false, matchCase: false } }
        : {}),
    },
  };

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/workers/observability/telemetry/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(`Cloudflare query failed: ${JSON.stringify(result.errors ?? result)}`);
  }

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  const events = result.result?.events ?? [];
  if (events.length === 0) {
    console.log("No matching Worker log events.");
    return;
  }
  for (const event of events) console.log(eventLine(event));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
