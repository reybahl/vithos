import { useSearch } from "@tanstack/react-router";
import { AuthSplitLayout } from "../components/auth-split-layout";
import { SignupForm } from "../components/signup-form";

export function SignUpPage() {
  const { redirect } = useSearch({ from: "/signup" });
  return (
    <AuthSplitLayout>
      <SignupForm redirectTo={redirect} />
    </AuthSplitLayout>
  );
}
