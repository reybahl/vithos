import { useSearch } from "@tanstack/react-router";
import { AuthSplitLayout } from "../components/AuthSplitLayout";
import { SignupForm } from "../components/SignupForm";

export function SignUpPage() {
  const { redirect } = useSearch({ from: "/signup" });
  return (
    <AuthSplitLayout>
      <SignupForm redirectTo={redirect} />
    </AuthSplitLayout>
  );
}
