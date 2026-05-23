import * as React from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Button } from "@acme/ui/components/button";
import { Input } from "@acme/ui/components/input";
import { Label } from "@acme/ui/components/label";
import { cn } from "@acme/ui/lib/utils";

import { authClient } from "../lib/auth-client";
import { AuthFormHeader } from "./AuthShared";

export function LoginForm({
  className,
  redirectTo,
  ...props
}: React.ComponentProps<"form"> & { redirectTo?: string }) {
  const navigate = useNavigate();
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsPending(true);
    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: "/dashboard",
      });
      if (error) {
        setErrorMessage(error.message ?? "Could not sign in.");
        return;
      }
      await authClient.getSession();
      if (redirectTo) {
        router.history.push(redirectTo);
      } else {
        void navigate({ to: "/dashboard" });
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      className={cn("grid gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <AuthFormHeader
        title="Login to your account"
        description="Enter your email below to login to your account"
      />
      <div className="grid gap-6">
        {errorMessage ? (
          <p role="alert" className="text-destructive text-sm font-medium">
            {errorMessage}
          </p>
        ) : null}
        <div className="grid gap-2">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="m@example.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            disabled={isPending}
            required
          />
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Label
            htmlFor="login-password"
            className="col-start-1 row-start-1 self-center"
          >
            Password
          </Label>
          <Input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="col-span-2 col-start-1 row-start-2 min-w-0"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            disabled={isPending}
            required
          />
          <a
            href="#"
            className="text-muted-foreground col-start-2 row-start-1 justify-self-end self-center text-xs font-medium underline-offset-4 hover:underline"
          >
            Forgot your password?
          </a>
        </div>
        <Button
          type="submit"
          variant="default"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Signing in…" : "Login"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          search={{ redirect: redirectTo }}
          className="underline underline-offset-4"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
}
