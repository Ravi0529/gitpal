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
import GithubSignInForm from "@/features/auth/components/github-sign-in-form";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to GitPal Code Reviewer platform using your GitHub account.",
};

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  const { callbackUrl } = await searchParams;
  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="items-center gap-4 pb-4 text-center">
        <div className="m-8 flex justify-center pt-2">
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/logo-dark.svg"
              alt="GitPal Logo"
              width={56}
              height={56}
              priority
              className="h-auto w-14 max-w-full text-foreground"
            />
            <span className="text-4xl font-semibold tracking-tight text-foreground">
              gitPal
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-base">Welcome back</CardTitle>
          <CardDescription className="mx-auto max-w-sm leading-relaxed">
            Sign in with GitHub to review and manage your code.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <FieldSet>
          <FieldGroup>
            <Field>
              <div className="flex flex-col items-center">
                <GithubSignInForm callbackUrl={callbackUrl} />
                <FieldDescription className="pt-2 max-w-sm text-center leading-relaxed">
                  We only request the permissions needed to identify your
                  account. You can revoke access at any time from your GitHub
                  settings.
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
