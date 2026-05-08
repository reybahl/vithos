import { AuthSplitLayout } from "../components/auth-split-layout";
import { SignupForm } from "../components/signup-form";

export function SignUpPage() {
  return (
    <AuthSplitLayout>
      <SignupForm />
    </AuthSplitLayout>
  );
}
