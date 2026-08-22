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
import { registerSchema, type RegisterInput } from '@/lib/auth-schemas';

function registerErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.statusCode === 409) return 'An account with that email already exists.';
    if (error.statusCode === 429) return 'Too many attempts. Wait a moment and try again.';
    return error.details.join(' ');
  }
  return 'Something went wrong. Please try again.';
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const mutation = useMutation({
    mutationFn: async (
      input: RegisterInput,
    ): Promise<{ kind: 'logged-in'; accessToken: string } | { kind: 'registered-only' }> => {
      await apiFetch('/auth/register', { method: 'POST', body: input });
      // Backend register returns { id, email }, not a token — log in right after
      // so a new account lands the user straight in the dashboard. If that second
      // call fails, the account still exists — don't report it as a failed signup.
      try {
        const { accessToken } = await apiFetch<{ accessToken: string }>('/auth/login', {
          method: 'POST',
          body: input,
        });
        return { kind: 'logged-in', accessToken };
      } catch {
        return { kind: 'registered-only' };
      }
    },
    onSuccess: async (result) => {
      if (result.kind === 'logged-in') {
        await login(result.accessToken);
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    },
  });

  return (
    <GuestGuard>
      <main className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Start collaborating on Lattice.</CardDescription>
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
                  <AlertTitle>Couldn&apos;t create account</AlertTitle>
                  <AlertDescription>{registerErrorMessage(mutation.error)}</AlertDescription>
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
                  autoComplete="new-password"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" disabled={mutation.isPending} className="mt-2">
                {mutation.isPending ? 'Creating account…' : 'Create account'}
              </Button>
            </form>

            <p className="text-muted-foreground mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-foreground underline underline-offset-4">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </GuestGuard>
  );
}
