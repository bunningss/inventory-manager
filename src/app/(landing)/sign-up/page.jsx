import { AuthWrapper } from "@/components/auth/auth-wrapper";
import { RegisterForm } from "@/components/auth/register-form";

export function metadata() {
  return {
    title: "Register",
  };
}

export default async function Page() {
  return (
    <AuthWrapper>
      <RegisterForm />
    </AuthWrapper>
  );
}
