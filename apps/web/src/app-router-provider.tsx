import { RouterProvider } from "@tanstack/react-router";
import { authClient } from "./lib/auth-client";
import { router } from "./router";

export function AppRouterProvider() {
  const session = authClient.useSession();
  return (
    <RouterProvider
      router={router}
      context={{
        auth: {
          isAuthenticated: Boolean(session.data?.user),
          isPending: session.isPending,
        },
      }}
    />
  );
}
