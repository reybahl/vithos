import { useEffect } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { authClient } from "./lib/auth-client";
import { router } from "./router";

export function AppRouterProvider() {
  const session = authClient.useSession();

  useEffect(() => {
    if (session.isPending) return;
    void router.invalidate();
  }, [session.isPending, session.data?.user?.id]);

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

