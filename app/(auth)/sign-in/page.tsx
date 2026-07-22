import Image from "next/image";
import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import GithubSignInForm from "@/features/auth/components/github-sign-in-form";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to GitPal Code Reviewer platform using your GitHub account.",
};

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string; callback?: string }>;
};

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  const { callbackUrl, callback } = await searchParams;
  const returnTo = callbackUrl ?? callback;
  return (
    <Card className="relative overflow-hidden border-border/80 shadow-lg">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-primary/10 to-transparent"
      />
      <CardHeader className="relative items-center gap-4 pb-2 text-center">
        <div className="flex justify-center pt-4">
          <div className="flex items-center justify-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-xl border border-border/60 bg-background shadow-sm">
              <Image
                src="/logo-dark.svg"
                alt="GitPal Logo"
                width={40}
                height={40}
                priority
                className="size-10 object-contain"
              />
            </div>
            <span className="font-heading text-3xl font-semibold tracking-tight">
              gitPal
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <Badge variant="secondary" className="mb-1">
            AI code review
          </Badge>
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription className="mx-auto max-w-sm leading-relaxed">
            Sign in with GitHub to review and manage your pull requests with AI.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="relative pt-2 pb-8">
        <FieldSet>
          <FieldGroup>
            <Field>
              <div className="flex flex-col items-center gap-4">
                <GithubSignInForm callbackUrl={returnTo} />
                <FieldDescription className="max-w-sm text-center leading-relaxed">
                  We only request the permissions needed to identify your account.
                  You can revoke access at any time from your GitHub settings.
                </FieldDescription>
              </div>
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  );
};

export default SignInPage;
