import * as React from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { cn } from "@repo/ui/lib/utils";

import { authClient } from "../lib/auth-client";
import { AuthFormHeader } from "./auth-shared";

export function SignupForm({
  className,
  redirectTo,
  ...props
}: React.ComponentProps<"form"> & { redirectTo?: string }) {
  const navigate = useNavigate();
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsPending(true);
    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        callbackURL: "/dashboard",
      });
      if (error) {
        setErrorMessage(error.message ?? "Could not create account.");
        return;
      }
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
        title="Create an account"
        description="Enter your details below to create your account"
      />
      <div className="grid gap-6">
        {errorMessage ? (
          <p role="alert" className="text-destructive text-sm font-medium">
            {errorMessage}
          </p>
        ) : null}
        <div className="grid gap-2">
          <Label htmlFor="signup-name">Name</Label>
          <Input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Ada Lovelace"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            disabled={isPending}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
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
        <div className="grid gap-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            disabled={isPending}
            required
            minLength={8}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="signup-confirm">Confirm password</Label>
          <Input
            id="signup-confirm"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(ev) => setConfirmPassword(ev.target.value)}
            disabled={isPending}
            required
            minLength={8}
          />
        </div>
        <Button
          type="submit"
          variant="default"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Creating account…" : "Create account"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link
          to="/signin"
          search={{ redirect: redirectTo }}
          className="underline underline-offset-4"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}
