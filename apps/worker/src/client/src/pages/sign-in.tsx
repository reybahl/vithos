import { useSearch } from "@tanstack/react-router";
import { AuthSplitLayout } from "../components/AuthSplitLayout";
import { LoginForm } from "../components/LoginForm";

export function SignInPage() {
  const { redirect } = useSearch({ from: "/signin" });
  return (
    <AuthSplitLayout>
      <LoginForm redirectTo={redirect} />
    </AuthSplitLayout>
  );
}
