import * as React from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Button } from "@acme/ui/components/button";
import { Input } from "@acme/ui/components/input";
import { Label } from "@acme/ui/components/label";
import { cn } from "@acme/ui/lib/utils";

import { authClient } from "../lib/auth-client";
import { AuthFormHeader } from "./AuthShared";

type SubmitState = {
  errorMessage: string | null;
  isPending: boolean;
};

type SubmitAction =
  | { type: "CLEAR_ERROR" }
  | { type: "START_PENDING" }
  | { type: "SET_ERROR"; message: string }
  | { type: "FINISH" };

function submitReducer(state: SubmitState, action: SubmitAction): SubmitState {
  switch (action.type) {
    case "CLEAR_ERROR":
      return { ...state, errorMessage: null };
    case "START_PENDING":
      return { ...state, errorMessage: null, isPending: true };
    case "SET_ERROR":
      return { ...state, errorMessage: action.message };
    case "FINISH":
      return { ...state, isPending: false };
    default:
      return state;
  }
}

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
  const [submit, dispatch] = React.useReducer(submitReducer, {
    errorMessage: null,
    isPending: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "CLEAR_ERROR" });

    if (password !== confirmPassword) {
      dispatch({ type: "SET_ERROR", message: "Passwords do not match." });
      return;
    }

    dispatch({ type: "START_PENDING" });
    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        callbackURL: "/dashboard",
      });
      if (error) {
        dispatch({
          type: "SET_ERROR",
          message: error.message ?? "Could not create account.",
        });
        return;
      }
      await authClient.getSession();
      if (redirectTo) {
        router.history.push(redirectTo);
      } else {
        void navigate({ to: "/dashboard" });
      }
    } finally {
      dispatch({ type: "FINISH" });
    }
  };

  return (
    <form className={cn("grid gap-6", className)} {...props} onSubmit={handleSubmit}>
      <AuthFormHeader
        title="Create an account"
        description="Enter your details below to create your account"
      />
      <div className="grid gap-6">
        {submit.errorMessage ? (
          <p role="alert" className="text-destructive text-sm font-medium">
            {submit.errorMessage}
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
            disabled={submit.isPending}
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
            disabled={submit.isPending}
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
            disabled={submit.isPending}
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
            disabled={submit.isPending}
            required
            minLength={8}
          />
        </div>
        <Button type="submit" variant="default" className="w-full" disabled={submit.isPending}>
          {submit.isPending ? "Creating account…" : "Create account"}
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
