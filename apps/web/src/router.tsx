import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { DashboardPage } from "./pages/dashboard";
import { SignInPage } from "./pages/sign-in";
import { SignUpPage } from "./pages/sign-up";

export interface RouterContext {
  auth: {
    isAuthenticated: boolean;
    isPending: boolean;
  };
}

/** If already signed in, skip auth pages—use `redirect` target when safe (same origin). */
function beforeLoadForwardIfSignedIn({
  context,
  search,
}: {
  context: RouterContext;
  search: { redirect?: string };
}) {
  if (context.auth.isPending || !context.auth.isAuthenticated) return;

  let to = "/dashboard";
  if (search.redirect) {
    try {
      const u = new URL(search.redirect, window.location.origin);
      if (u.origin === window.location.origin) {
        to = `${u.pathname}${u.search}${u.hash}` || "/dashboard";
      }
    } catch {
      // fall back to /dashboard
    }
  }
  throw redirect({ to });
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
});

const authenticatedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_authenticated",
  component: () => <Outlet />,
  beforeLoad: ({ context, location }) => {
    if (context.auth.isPending) return;
    if (context.auth.isAuthenticated) return;
    throw redirect({
      to: "/signin",
      search: { redirect: location.href },
    });
  },
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/dashboard", replace: true });
  },
  component: () => null,
});

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signin",
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  beforeLoad: beforeLoadForwardIfSignedIn,
  component: SignInPage,
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  beforeLoad: beforeLoadForwardIfSignedIn,
  component: SignUpPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  authenticatedLayoutRoute.addChildren([
    // e.g. createRoute({ getParentRoute: () => authenticatedLayoutRoute, path: '/settings', ... })
  ]),
  signInRoute,
  signUpRoute,
]);

export const router = createRouter({
  routeTree,
  context: {
    auth: {
      isAuthenticated: false,
      isPending: true,
    },
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
