import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  GitBranch,
  GitPullRequest,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

import { SiteHeader } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BENTO_FEATURES = [
  {
    title: "AI-powered reviews",
    description:
      "Every pull request gets a thorough, context-aware review — bugs, style, security, and best practices.",
    icon: Bot,
    className: "md:col-span-2 md:row-span-2",
    featured: true as const,
  },
  {
    title: "GitHub native",
    description: "Install once. Reviews appear as PR comments on GitHub.",
    icon: GitBranch,
    className: "md:col-span-1",
    featured: false as const,
  },
  {
    title: "Instant feedback",
    description: "Reviews land within seconds of opening a PR.",
    icon: Zap,
    className: "md:col-span-1",
    featured: false as const,
  },
  {
    title: "PR insights",
    description:
      "Track review status, approvals, and changes requested in one dashboard.",
    icon: GitPullRequest,
    className: "md:col-span-1",
    featured: false as const,
  },
  {
    title: "Codebase context",
    description: "Vector-indexed repos give the AI full project awareness.",
    icon: Sparkles,
    className: "md:col-span-1",
    featured: false as const,
  },
  {
    title: "Secure by design",
    description:
      "OAuth-only access. You control which repos the app can reach.",
    icon: Shield,
    className: "md:col-span-2",
    featured: false as const,
  },
] as const;

const STEPS = [
  {
    step: "01",
    title: "Connect GitHub",
    description:
      "Sign in and install the gitPal GitHub App on your account or org.",
  },
  {
    step: "02",
    title: "Select repositories",
    description:
      "Choose which repos to enable. Sync your codebase for deeper context.",
  },
  {
    step: "03",
    title: "Open a pull request",
    description:
      "gitPal automatically reviews every PR and posts feedback on GitHub.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/60">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,var(--primary)/0.12,transparent)]"
          />
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-6">
                AI code review for GitHub
              </Badge>
              <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Ship better code with{" "}
                <span className="text-primary">gitPal</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
                Your AI pair reviewer that catches bugs, suggests improvements,
                and posts actionable feedback directly on pull requests.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/sign-in">
                    Start reviewing for free
                    <ArrowRight />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/dashboard">View dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Bento features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-12 max-w-2xl">
            <h2 className="font-heading text-3xl font-semibold tracking-tight">
              Everything you need to review smarter
            </h2>
            <p className="mt-3 text-muted-foreground">
              gitPal integrates seamlessly with your GitHub workflow and gives
              your team AI-powered reviews without leaving the PR.
            </p>
          </div>

          <div className="grid auto-rows-fr gap-4 md:grid-cols-4">
            {BENTO_FEATURES.map((feature) => (
              <Card
                key={feature.title}
                className={`group transition-shadow hover:shadow-md ${feature.className} ${
                  feature.featured
                    ? "bg-linear-to-br from-primary/5 via-card to-card"
                    : ""
                }`}
              >
                <CardHeader>
                  <div
                    className={`mb-2 flex size-10 items-center justify-center rounded-lg border ${
                      feature.featured
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    <feature.icon className="size-5" />
                  </div>
                  <CardTitle
                    className={feature.featured ? "text-xl" : undefined}
                  >
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                {feature.featured ? (
                  <CardContent className="mt-auto">
                    <div className="rounded-lg border border-border/60 bg-muted/40 p-4 font-mono text-xs text-muted-foreground">
                      <p className="text-primary">gitPal bot</p>
                      <p className="mt-2">
                        ⚠️ Potential null reference in{" "}
                        <span className="text-foreground">auth.ts:42</span>
                      </p>
                      <p className="mt-1">
                        💡 Consider extracting this into a shared utility.
                      </p>
                      <p className="mt-1">
                        ✅ Overall: looks good with minor fixes.
                      </p>
                    </div>
                  </CardContent>
                ) : null}
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="border-t border-border/60 bg-muted/30 py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <h2 className="font-heading text-3xl font-semibold tracking-tight">
                Up and running in minutes
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
                No complex setup. Connect GitHub, pick your repos, and let
                gitPal handle the rest.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {STEPS.map((item) => (
                <Card key={item.step} className="relative overflow-hidden">
                  <CardHeader>
                    <span className="font-mono text-4xl font-bold text-primary/20">
                      {item.step}
                    </span>
                    <CardTitle className="mt-2">{item.title}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Card className="overflow-hidden bg-linear-to-br from-primary/10 via-card to-card">
            <CardContent className="flex flex-col items-center gap-6 px-6 py-16 text-center sm:px-12">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo-dark.svg"
                  alt="gitPal"
                  width={40}
                  height={40}
                  className="size-10 object-contain"
                />
                <span className="font-heading text-2xl font-semibold">
                  gitPal
                </span>
              </div>
              <h2 className="font-heading max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready to level up your code reviews?
              </h2>
              <p className="max-w-md text-muted-foreground">
                Join developers who ship faster with AI-powered PR feedback.
                Free tier included — no credit card required.
              </p>
              <Button size="lg" asChild>
                <Link href="/sign-in">
                  Get started with GitHub
                  <ArrowRight />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-dark.svg"
              alt="gitPal"
              width={20}
              height={20}
              className="size-5 object-contain"
            />
            <span>gitPal — AI-powered code review</span>
          </div>
          <p>© {new Date().getFullYear()} gitPal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
