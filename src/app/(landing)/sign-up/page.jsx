import { AuthWrapper } from "@/components/auth-wrapper";
import { RegisterForm } from "@/components/forms/register-form";

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
