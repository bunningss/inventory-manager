import { AuthWrapper } from "@/components/auth-wrapper";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export default async function Page({ params }) {
  return (
    <AuthWrapper>
      <ResetPasswordForm resetToken={params.resetToken} />
    </AuthWrapper>
  );
}
