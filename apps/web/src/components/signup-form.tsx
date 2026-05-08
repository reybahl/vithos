import type * as React from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { cn } from "@repo/ui/lib/utils";

import { AuthFormHeader } from "./auth-shared";

export function SignupForm({
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
        title="Create an account"
        description="Enter your details below to create your account"
      />
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input id="signup-email" type="email" placeholder="m@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input id="signup-password" type="password" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="signup-confirm">Confirm password</Label>
          <Input id="signup-confirm" type="password" />
        </div>
        <Button type="submit" variant="default" className="w-full">
          Create account
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/signin" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </form>
  );
}
