import { AuthWrapper } from "@/components/auth/auth-wrapper";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default async function Page({ params }) {
  return (
    <AuthWrapper>
      <ResetPasswordForm resetToken={params.resetToken} />
    </AuthWrapper>
  );
}
