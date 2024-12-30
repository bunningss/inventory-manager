import { AuthWrapper } from "@/components/auth/auth-wrapper";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export default function Page() {
  return (
    <AuthWrapper>
      <ForgotPasswordForm />
    </AuthWrapper>
  );
}
