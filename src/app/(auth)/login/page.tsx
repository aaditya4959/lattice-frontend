'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';

import { GuestGuard } from '@/components/guest-guard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiFetch, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { loginSchema, type LoginInput } from '@/lib/auth-schemas';

function loginErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.statusCode === 429) return 'Too many attempts. Wait a moment and try again.';
    if (error.statusCode === 401) return 'Incorrect email or password.';
    return error.details.join(' ');
  }
  return 'Something went wrong. Please try again.';
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: (input: LoginInput) =>
      apiFetch<{ accessToken: string }>('/auth/login', { method: 'POST', body: input }),
    onSuccess: async (data) => {
      await login(data.accessToken);
      router.push('/dashboard');
    },
  });

  return (
    <GuestGuard>
      <main className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Log in</CardTitle>
            <CardDescription>Welcome back to Lattice.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit((values) => mutation.mutate(values))}
              noValidate
            >
              {mutation.isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Couldn&apos;t log in</AlertTitle>
                  <AlertDescription>{loginErrorMessage(mutation.error)}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" {...register('email')} />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" disabled={mutation.isPending} className="mt-2">
                {mutation.isPending ? 'Logging in…' : 'Log in'}
              </Button>
            </form>

            <p className="text-muted-foreground mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-foreground underline underline-offset-4">
                Register
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </GuestGuard>
  );
}
