import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { HomePage } from "./pages/home";
import { SignInPage } from "./pages/sign-in";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signin",
  component: SignInPage,
});

const routeTree = rootRoute.addChildren([indexRoute, signInRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
