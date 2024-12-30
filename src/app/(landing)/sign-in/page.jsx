import { AuthWrapper } from "@/components/auth-wrapper";
import { LoginForm } from "@/components/forms/login-form";

export function metadata() {
  return {
    title: "Login",
  };
}

export default async function Page() {
  return (
    <AuthWrapper>
      <LoginForm />
    </AuthWrapper>
  );
}
