import { ResetPasswordTemplate } from "@/components/email-templates/reset-password-template";

export async function sendResetPasswordLink(name, resetLink, emails) {
  await resend.emails.send({
    from: "Support <contact@ilham.com.bd>",
    to: emails,
    subject: "Reset Password",
    react: <ResetPasswordTemplate name={name} resetPasswordLink={resetLink} />,
  });
}
