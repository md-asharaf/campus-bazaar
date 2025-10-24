import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminLogin, useAdminVerifyLogin } from '@/hooks/api/useAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ShieldCheck, Loader2, Mail, User } from 'lucide-react';
import { toast } from 'sonner';

// Schemas
const adminEmailSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

const adminOtpSchema = z.object({
  otp: z.string().min(1, 'Please enter OTP').max(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

type AdminEmailFormData = z.infer<typeof adminEmailSchema>;
type AdminOtpFormData = z.infer<typeof adminOtpSchema>;

export function Login() {
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [adminStep, setAdminStep] = useState<'email' | 'otp'>('email');
  const [adminEmail, setAdminEmail] = useState('');

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const from = searchParams.get('from') || '/';

  // Auth hooks
  const { user, loading: userLoading } = useAuth();
  const { admin, loading: adminLoading } = useAdminAuth();

  // Admin mutation hooks
  const adminLoginMutation = useAdminLogin();
  const adminVerifyMutation = useAdminVerifyLogin();

  // Admin forms
  const adminEmailForm = useForm<AdminEmailFormData>({
    resolver: zodResolver(adminEmailSchema),
    defaultValues: { email: '' },
  });

  const adminOtpForm = useForm<AdminOtpFormData>({
    resolver: zodResolver(adminOtpSchema),
    defaultValues: { otp: '' },
  });

  // Effects
  useEffect(() => {
    if (error) {
      toast.error(decodeURIComponent(error));
    }
  }, [error]);

  // Redirect logic
  useEffect(() => {
    if (!userLoading && !adminLoading) {
      if (user && activeTab === 'user') {
        navigate(from === '/admin' ? '/dashboard' : from, { replace: true });
      } else if (admin && activeTab === 'admin') {
        navigate('/admin', { replace: true });
      }
    }
  }, [user, admin, userLoading, adminLoading, activeTab, navigate, from]);

  // Handlers
  const handleGoogleLogin = () => {
    const googleLoginUrl = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/auth/users/google`;
    window.location.href = googleLoginUrl;
  };

  const handleAdminEmailSubmit = async (data: AdminEmailFormData) => {
    try {
      await adminLoginMutation.mutateAsync(data);
      setAdminEmail(data.email);
      setAdminStep('otp');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleAdminOtpSubmit = async (data: AdminOtpFormData) => {
    try {
      await adminVerifyMutation.mutateAsync({
        email: adminEmail,
        otp: data.otp
      });
      navigate('/admin');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const resetAdminFlow = () => {
    setAdminStep('email');
    setAdminEmail('');
    adminEmailForm.reset();
    adminOtpForm.reset();
  };

  // Show loading spinner while checking auth state
  if (userLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <img
              src="/logo.png"
              alt="CampusBazaar Logo"
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                // Fallback to shield icon if logo not found
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <ShieldCheck className="w-8 h-8 text-primary hidden" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-base mt-2">
              {activeTab === 'user'
                ? 'Sign in to your CampusBazaar account'
                : 'Access the admin portal'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value as 'user' | 'admin');
            resetAdminFlow();
          }}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="user" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  Authentication failed. Please try again.
                </div>
              )}

              <Button
                onClick={handleGoogleLogin}
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Secure Student Authentication
                  </span>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">
                  Only verified KIST students can access CampusBazaar
                </p>
                <p>
                  By continuing, you agree to our{" "}
                  <a href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="space-y-6">
              {adminStep === 'email' ? (
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
                    <Button type="submit" className="w-full" disabled={adminLoginMutation.isPending}>
                      {adminLoginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                                <p className="text-xs text-muted-foreground mb-2">Or enter manually:</p>
                                <Input
                                  type="text"
                                  placeholder="Enter 6-digit OTP"
                                  value={field.value || ""}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
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
                        disabled={adminVerifyMutation.isPending || !adminOtpForm.watch('otp') || adminOtpForm.watch('otp').length !== 6}
                      >
                        {adminVerifyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Verify & Login
                      </Button>
                      <Button variant="link" size="sm" onClick={resetAdminFlow}>
                        Use a different email
                      </Button>
                      <div className="text-xs text-center text-muted-foreground">
                        Debug: OTP value = "{adminOtpForm.watch('otp') || ''}" (length: {(adminOtpForm.watch('otp') || '').length})
                      </div>
                    </div>
                  </form>
                </Form>
              )}

              <div className="text-center text-xs text-muted-foreground">
                <p>
                  Admin access is restricted to authorized personnel only.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}