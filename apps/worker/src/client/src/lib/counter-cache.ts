export type CounterData = { count: number };

export function incrementCounterCache(current: CounterData | undefined): CounterData {
  return { count: (current?.count ?? 0) + 1 };
}

export function decrementCounterCache(current: CounterData | undefined): CounterData {
  return { count: Math.max(0, (current?.count ?? 0) - 1) };
}

/** A mutation is still pending while its `onSettled` callback runs. */
export function isLastCounterMutation(activeMutations: number): boolean {
  return activeMutations === 1;
}
