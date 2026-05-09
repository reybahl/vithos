import { useSearch } from "@tanstack/react-router";
import { AuthSplitLayout } from "../components/auth-split-layout";
import { LoginForm } from "../components/login-form";

export function SignInPage() {
  const { redirect } = useSearch({ from: "/signin" });
  return (
    <AuthSplitLayout>
      <LoginForm redirectTo={redirect} />
    </AuthSplitLayout>
  );
}
