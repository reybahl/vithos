import type * as React from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { cn } from "@repo/ui/lib/utils";

import { AuthFormHeader, AuthGoogleOAuthSection } from "./auth-shared";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form
      className={cn("grid gap-6", className)}
      {...props}
      onSubmit={(e) => e.preventDefault()}
    >
      <AuthFormHeader
        title="Login to your account"
        description="Enter your email below to login to your account"
      />
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="login-email">Email</Label>
          <Input id="login-email" type="email" placeholder="m@example.com" />
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
            type="password"
            className="col-span-2 col-start-1 row-start-2 min-w-0"
          />
          <a
            href="#"
            className="text-muted-foreground col-start-2 row-start-1 justify-self-end self-center text-xs font-medium underline-offset-4 hover:underline"
          >
            Forgot your password?
          </a>
        </div>
        <Button type="submit" variant="default" className="w-full">
          Login
        </Button>
        <AuthGoogleOAuthSection />
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
}
