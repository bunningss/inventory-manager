"use client";
import Link from "next/link";
import { Heading } from "../heading";
import { postData } from "@/utils/api-calls";
import { useState } from "react";
import { errorNotification, successNotification } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { FormInput } from "../form/form-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormModal } from "../form/form-modal";
import { setCookie } from "@/utils/cookie";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginForm = async (data) => {
    setIsLoading(true);

    try {
      const { response, error } = await postData("login", data);

      if (error) {
        return errorNotification(response.msg);
      }

      await setCookie(process.env.NEXT_PUBLIC_SESSION_COOKIE, response.payload);

      router.push("/");
      successNotification(response.msg);
    } catch (err) {
      errorNotification(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Heading className="text-center mb-2">Welcome back!</Heading>
      <FormModal
        form={form}
        formLabel="sign in"
        loading={isLoading}
        disabled={isLoading}
        onSubmit={handleLoginForm}
      >
        <FormInput
          placeholder="example@email.com"
          type="email"
          label="Email address / ইমেইল"
          required
          name="email"
          form={form}
        />
        <FormInput
          placeholder="********"
          type="password"
          label="Password / পাসওয়ার্ড"
          required
          name="password"
          form={form}
        />
      </FormModal>
      <div className="flex flex-col md:flex-row justify-between gap-2 mt-2">
        <Link href="/forgot-password" className="font-bold hover:underline">
          {" "}
          Forgot password?
        </Link>

        <span className="block text-mute">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-bold hover:underline">
            Sign up.
          </Link>
        </span>
      </div>
    </>
  );
}
