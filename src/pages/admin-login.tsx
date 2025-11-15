import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ShieldCheck, Loader2, Mail, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useAdminLogin, useAdminVerifyLogin } from "@/hooks/api/use-auth";

// Local schemas and types
const adminEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});
const adminOtpSchema = z.object({
  otp: z
    .string()
    .min(1, "Please enter OTP")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

type AdminEmailFormData = z.infer<typeof adminEmailSchema>;
type AdminOtpFormData = z.infer<typeof adminOtpSchema>;

export default function AdminLoginPage() {
  const [adminStep, setAdminStep] = useState<"email" | "otp">("email");
  const [adminEmail, setAdminEmail] = useState("");
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const from = searchParams.get("from") || "/admin";

  const navigate = useNavigate();

  // Mutations
  const adminLoginMutation = useAdminLogin();
  const adminVerifyMutation = useAdminVerifyLogin();

  // Forms
  const adminEmailForm = useForm<AdminEmailFormData>({
    resolver: zodResolver(adminEmailSchema),
    defaultValues: { email: "" },
  });

  const adminOtpForm = useForm<AdminOtpFormData>({
    resolver: zodResolver(adminOtpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (error) {
      toast.error(decodeURIComponent(error));
    }
  }, [error]);

  const handleAdminEmailSubmit = async (data: AdminEmailFormData) => {
    try {
      await adminLoginMutation.mutateAsync(data);
      setAdminEmail(data.email);
      setAdminStep("otp");
    } catch {
      // mutation handles error toast
    }
  };

  const handleAdminOtpSubmit = async (data: AdminOtpFormData) => {
    try {
      await adminVerifyMutation.mutateAsync({
        email: adminEmail,
        otp: data.otp,
      });
      navigate(from || "/admin", { replace: true });
    } catch {
      // mutation handles error toast
    }
  };

  const resetAdminFlow = () => {
    setAdminStep("email");
    setAdminEmail("");
    adminEmailForm.reset();
    adminOtpForm.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Admin Sign In</CardTitle>
            <CardDescription className="text-base mt-2">
              Access the admin portal with OTP
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {adminStep === "email" ? (
            <Form {...adminEmailForm}>
              <form
                onSubmit={adminEmailForm.handleSubmit(handleAdminEmailSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={adminEmailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="admin@kist.edu.np"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={adminLoginMutation.isPending}
                >
                  {adminLoginMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Send OTP
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...adminOtpForm}>
              <form
                onSubmit={adminOtpForm.handleSubmit(handleAdminOtpSubmit)}
                className="space-y-6"
              >
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to
                  </p>
                  <p className="font-medium">{adminEmail}</p>
                </div>

                <FormField
                  control={adminOtpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <InputOTP
                            maxLength={6}
                            value={field.value || ""}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                          >
                            <InputOTPGroup className="gap-2 justify-center">
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>

                          <div className="text-center">
                            <p className="text-xs text-muted-foreground mb-2">
                              Or enter manually:
                            </p>
                            <Input
                              type="text"
                              placeholder="Enter 6-digit OTP"
                              value={field.value || ""}
                              onChange={(e) => {
                                const value = e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 6);
                                field.onChange(value);
                              }}
                              className="text-center tracking-widest"
                              maxLength={6}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      adminVerifyMutation.isPending ||
                      !adminOtpForm.watch("otp") ||
                      adminOtpForm.watch("otp").length !== 6
                    }
                  >
                    {adminVerifyMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Verify & Login
                  </Button>
                  <Button variant="link" size="sm" onClick={resetAdminFlow}>
                    Use a different email
                  </Button>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
                    <LockKeyhole className="h-3.5 w-3.5" />
                    <span>Secure admin authentication</span>
                  </div>
                </div>
              </form>
            </Form>
          )}

          <div className="text-center text-sm text-muted-foreground">
            <p>Admin access is restricted to authorized personnel only.</p>
          </div>

          <div className="text-center">
            <Link to="/student-login" className="text-primary hover:underline text-sm">
              Are you a student? Continue to student login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}