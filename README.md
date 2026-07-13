# gitPal — AI-Powered GitHub Code Reviewer

gitPal is a production-grade, full-stack SaaS application that automates code reviews on GitHub pull requests. By listening to GitHub webhook events, gitPal fetches pull request diffs, indexes them into Pinecone, performs vector search for context, and uses LLMs (via Vercel AI SDK and OpenRouter) to post structured, actionable review comments directly to the PR thread.

Additionally, developers can trigger an on-demand codebase-wide sync to store files in Pinecone, providing the AI reviewer with deeper repository-wide context when reviewing diffs.

---

## How It Works (System Flow)

The diagram below illustrates the webhook-to-comment flow, background job scheduling, and vector database querying of gitPal:

```mermaid
sequenceDiagram
    autonumber
    actor Developer
    participant GitHub as GitHub App
    participant Webhook as Next.js Webhook Handler
    participant DB as PostgreSQL (Prisma)
    participant Inngest as Inngest Job Queue
    participant Pinecone as Pinecone Vector DB
    participant LLM as Vercel AI SDK / OpenRouter

    Developer->>GitHub: Opens / Updates PR
    GitHub->>Webhook: Sends webhook payload (signature verified)
    Webhook->>DB: Saves PR record (sets status to 'pending')
    Webhook->>Webhook: Verifies subscription review quota
    Webhook->>Inngest: Dispatches 'github/pr.received' event
    Webhook-->>GitHub: Returns 200 OK

    Note over Inngest: review-pull-request function triggered
    Inngest->>DB: Updates status to 'processing'
    Inngest->>GitHub: Fetches PR diff & files (via Octokit)
    Inngest->>Inngest: Chunks code diffs (max 80 lines per chunk)
    Inngest->>Pinecone: Indexes chunks under PR-isolated namespace
    Inngest->>Inngest: Wait 10s for indexing

    rect rgb(20, 20, 30)
        Note over Inngest: If codebase has been synced
        Inngest->>DB: Fetches RepoSync record
        Inngest->>Pinecone: Retrieves related codebase context (using PR Title)
    end

    Inngest->>Pinecone: Searches PR namespace for relevant diff context
    Inngest->>LLM: Requests review with context, diff chunks, & instructions
    LLM-->>Inngest: Returns structured Markdown review
    Inngest->>GitHub: Posts review comment on the PR (via Octokit)
    Inngest->>DB: Saves review comment and updates status to 'reviewed'
    DB-->>Developer: Notified via GitHub UI
```

---

## Features

- **Native GitHub App Integration** — Install on organizations or accounts. Accesses files securely and posts feedback directly as pull request review comments.
- **Webhook-Triggered PR Reviews** — Evaluates changes automatically whenever a PR is `opened`, `synchronize` (new commits pushed), or `reopened`.
- **Structured Multi-Dimensional AI Reviews** — Checks code across critical metrics: correctness, security vulnerabilities (XSS, SQL Injection, exposed secrets), performance bottlenecks, reliability, readability, maintainability, and alternative approaches, while celebrating well-written code.
- **Isolated Vector-Based Context** — Each PR has its own namespace inside Pinecone. Diffs are chunked and queried using semantic search to present the most relevant codebase blocks to the AI model.
- **On-Demand Repository Codebase Sync** — Synced repositories index up to 200 files (<100KB) into Pinecone. When analyzing a PR, gitPal retrieves cross-file repository context for deeper, smarter reviews.
- **Intuitive SaaS Dashboard** — Features overview statistics, usage summaries, repository connection status, recent pull request histories, and account settings.
- **Advanced Authentication** — Secure social logins via GitHub powered by **Better Auth** with cookie session management.
- **Flexible Subscription System** — Implements Free (5 reviews/month) and Pro (unlimited reviews) subscriptions using **Razorpay** billing integration.
- **Resilient Background Processing** — Handled via **Inngest** to process long-running diff chunking, vector indexing, and LLM completions reliably without blocking request threads.
- **Refined Theme Support** — System, light, and dark modes powered by `next-themes` and styled with Tailwind CSS 4.

---

## Tech Stack & Tools

### Frontend & UI

- **Next.js 16 (App Router)** — React Framework for server-rendered page shells, layout management, and server actions.
- **React 19** — Core UI rendering.
- **Tailwind CSS 4** — Modern utility-first styling engine.
- **shadcn/ui & Radix UI** — Accessible, premium component primitives.
- **TanStack Query (v5)** — Client-side server state management, caching, and background synchronization.
- **Streamdown** — Custom markdown renderer tailored for clean streaming AI outputs.
- **Recharts** — Responsive graphs mapping review histories and usage logs.
- **Lucide React & Hugeicons** — Elegant, unified icon families.

### Backend, Auth & DB

- **PostgreSQL** — Relational database.
- **Prisma ORM (v7)** — Type-safe client, custom generator settings, and migration workflows.
- **Better Auth** — Developer-friendly, robust session authentication for GitHub OAuth.
- **Inngest** — Event-driven background job orchestrator.

### AI & Vector Search

- **Vercel AI SDK** — Streaming/non-streaming language model orchestrator.
- **OpenRouter** — AI gateway accessing diverse LLM backends (configured for `openrouter/free` models by default).
- **Pinecone** — Serverless vector database utilized with integrated text embeddings (`llama-text-embed-v2`).

### APIs & Billing

- **Octokit** — Official GitHub SDK used to pull trees, blobs, diffs, and create review comments.
- **Razorpay** — Payment processing gateway handling subscriptions, billing lifecycles, and transaction webhooks.

---

## Project Structure

```
├── app/
│   ├── (app)/                   # Protected layouts and dashboard routes
│   │   ├── dashboard/
│   │   │   ├── github/          # GitHub App connection settings
│   │   │   ├── pull-request/    # Pull request detail and reviews list
│   │   │   ├── repos/           # Repository listing and codebase syncing
│   │   │   └── settings/        # Billing subscriptions and account options
│   │   └── layout.tsx
│   ├── (auth)/                  # Social sign-in page
│   │   └── sign-in/
│   ├── api/
│   │   ├── auth/                # Better Auth API endpoints
│   │   ├── github/              # GitHub Webhook handler for PR events
│   │   ├── inngest/             # Serve endpoints for Inngest dev server / cloud
│   │   └── razorpay/            # Razorpay subscription webhook handler
│   ├── globals.css              # Global styles and tailwind directives
│   └── page.tsx                 # Landing marketing page
├── features/                    # Feature-driven modular slices
│   ├── ai/                      # Vercel AI SDK provider config & models
│   ├── auth/                    # Better Auth actions, hooks, and buttons
│   ├── billing/                 # Razorpay subscription logic & middleware usage checks
│   ├── dashboard/               # Sidebars, shells, layout components
│   ├── github/                  # Installation APIs, webhook parsing, & Octokit setups
│   ├── inngest/                 # Inngest client instantiation
│   ├── overview/                # Dashboard overview and charts
│   ├── pinecone/                # Pinecone client index helper
│   ├── pull-requests/           # PR lists, status style maps, and review details
│   ├── repo-sync/               # Full repo code indexing, chunking, and deletion logic
│   ├── reviews/                 # PR diff extraction, chunking, and AI review generation
│   └── settings/                # Settings navigation and profile data
├── lib/                         # Global database, utils, auth-client definitions
├── prisma/                      # Database schema structure & migration configuration
└── public/                      # Static logos, fonts, assets
```

---

## Database Schema Overview

The database leverages six key database tables in `schema.prisma`:

1. **User** — Stores core user information, current billing plan (`free` vs `pro`), Razorpay subscription details, and status.
2. **GithubInstallation** — Maps users to their GitHub App installation identifiers.
3. **PullRequest** — Logs incoming PR metadata, review statuses (`pending`, `processing`, `reviewed`, `rate_limited`), and saves generated markdown comments.
4. **RepoSync** — Tracks status (`pending`, `syncing`, `synced`, `failed`) and metrics of indexed codebase repositories.
5. **Session / Account / Verification** — Utilized by Better Auth to manage OAuth credential mappings and session cookies.

---

## Installation & Setup

Follow these steps to configure and run gitPal in your local development environment.

### 1. Prerequisites

Before installing, ensure you have:

- **Node.js** v20+ and **npm** installed.
- A running **PostgreSQL** database.
- A **GitHub Developer Account** to set up a GitHub App.
- A **Pinecone Account** with a Serverless Index using **Integrated Embeddings** (`llama-text-embed-v2` with field mapping `text=text`).
- An **OpenRouter API Key**.
- A **Razorpay Account** (running in Test Mode).

---

### 2. Environment Configuration

Clone the repository, create a `.env` file from the example, and configure the variables:

```bash
cp .env.example .env
```

Fill in your configurations inside `.env`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/gitpal?schema=public"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-super-secret-auth-key-32-chars"
BETTER_AUTH_URL="http://localhost:3000"

# GitHub Social Auth (OAuth Credentials inside GitHub App)
GITHUB_CLIENT_ID="Iv1.xxxxxxxxx"
GITHUB_CLIENT_SECRET="your-github-app-client-secret"

# GitHub App Integration
NEXT_PUBLIC_GITHUB_PUBLIC_LINK="https://github.com/apps/your-app-slug"
GITHUB_APP_ID="123456"
GITHUB_APP_NAME="your-app-name"
GITHUB_WEBHOOK_SECRET="your-custom-webhook-secret-string"
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"

# Inngest Background Jobs
# Set to 1 when running local dev server, remove or set to 0 in production
INNGEST_DEV=1

# AI LLM Provider
OPENROUTER_API_KEY="sk-or-v1-xxxxxxxx"

# Pinecone Database Configuration
PINECONE_INDEX="your-pinecone-index-name"
PINECONE_API_KEY="your-pinecone-api-key"

# Razorpay Subscriptions
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxx"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
RAZORPAY_PLAN_ID="plan_xxxxxxxx"
RAZORPAY_WEBHOOK_SECRET="your-razorpay-webhook-secret"
```

---

### 3. Installation Steps

Install the package dependencies:

```bash
npm install
```

Generate the Prisma Client into the custom path configured in your schema:

```bash
npx prisma generate
```

Run database migrations to initialize tables and relationships:

```bash
npx prisma migrate dev
```

---

### 4. Background Job Setup

Start the local Inngest development server in a separate terminal. This monitors sent events and allows testing pipeline logic locally:

```bash
npx inngest-cli@latest dev
```

The Inngest UI runs at `http://localhost:8288` by default and connects to `http://localhost:3000/api/inngest` to run tasks.

---

### 5. Start Dev Server & Tunnels

Start the Next.js development server:

```bash
npm run dev
```

Your app will be running at `http://localhost:3000`.

#### Hooking up GitHub Webhooks

GitHub cannot send webhooks directly to `localhost`. You must establish a secure tunnel using a tool like **ngrok** or **localtunnel**.

1. Open a tunnel on port 3000:
   ```bash
   ngrok http 3000
   ```
2. Copy the forwarding HTTPS address (e.g. `https://xxxx.ngrok-free.dev`).
3. Update your **GitHub App Settings**:
   - Set **Webhook URL** to `https://xxxx.ngrok-free.dev/api/github`.
   - Set the same ngrok URL in **Better Auth Redirect URLs** if testing auth redirects.
4. Add the forwarding domain to `allowedDevOrigins` in `next.config.ts` if needed to prevent CORS issues.

---

## Testing Your First Review

1. Navigate to `http://localhost:3000` and click **Start reviewing for free**.
2. Authenticate using your GitHub profile.
3. In the dashboard, click **Repositories**, then click **Connect GitHub App** to install the app on your user account or test organization.
4. Enable the app on a specific test repository.
5. _(Optional)_ Click **Sync Codebase** on the repository page to build codebase-wide vector chunks inside Pinecone.
6. Go to GitHub and open a Pull Request (or push a new commit to an existing one) containing code changes in that repository.
7. Within seconds, you will see:
   - A background job start in the Inngest Dev Console (`http://localhost:8288`).
   - Pinecone indexing the diff and searching for context.
   - An automated, multi-dimensional code review comment posted on your GitHub PR thread!
   - The PR and review log appear inside your gitPal dashboard history.
