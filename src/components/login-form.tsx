"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (formData: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const email = formData.email;
      const password = formData.password;

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "로그인 중 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    handleLogin(values);
  }
  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-md", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>관리자 로그인</CardTitle>
          <CardDescription>관리자 로그인 페이지입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이메일</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="m@example.com"
                          {...field}
                          type="email"
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>비밀번호</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="********"
                          {...field}
                          type="password"
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {message && (
                  <Alert
                    className={`mt-4 ${
                      message.type === "error"
                        ? "border-red-200 bg-red-50"
                        : "border-green-200 bg-green-50"
                    }`}
                  >
                    <AlertDescription
                      className={
                        message.type === "error"
                          ? "text-red-700"
                          : "text-green-700"
                      }
                    >
                      {message.text}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !form.formState.isValid}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  로그인
                </Button>
              </form>
            </Form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-gray-600 text-center">
            관리자 계정이 필요합니다
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
