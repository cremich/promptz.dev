import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Grid, GridSkeleton } from "@/components/grid";
import { getLatestPrompts } from "@/lib/prompts";
import { getLatestSteering } from "@/lib/steering";
import { getLatestAgents } from "@/lib/agents";
import { getLatestHooks } from "@/lib/hooks";
import { getLatestPowers } from "@/lib/powers";

// Loading component for Suspense boundary
function ContentLoading() {
  return <GridSkeleton count={6} />;
}

// Server component to fetch and display prompts
async function LatestPrompts() {
  const prompts = await getLatestPrompts(6);
  return <Grid items={prompts} maxItems={6} />;
}

// Server component to fetch and display steering documents
async function LatestSteering() {
  const steering = await getLatestSteering(6);
  return <Grid items={steering} maxItems={6} />;
}

// Server component to fetch and display agents
async function LatestAgents() {
  const agents = await getLatestAgents(6);
  return <Grid items={agents} maxItems={6} />;
}

// Server component to fetch and display hooks
async function LatestHooks() {
  const hooks = await getLatestHooks(6);
  return <Grid items={hooks} maxItems={6} />;
}

// Server component to fetch and display powers
async function LatestPowers() {
  const powers = await getLatestPowers(6);
  return <Grid items={powers} maxItems={6} />;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto max-w-7xl px-6 py-16">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <Image
            className="dark:invert mb-8"
            src="/next.svg"
            alt="Promptz.dev logo"
            width={120}
            height={24}
            priority
          />
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50 mb-6">
            AI Development Prompts & Resources
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400 mb-8">
            Discover the latest AI development prompts, custom agents, steering documents, agent hooks, Kiro powers, and resources 
            to enhance your development workflow with Kiro and Amazon Q Developer.
          </p>
          <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
            <Link
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[180px]"
              href="/prompts"
            >
              Browse All Prompts
            </Link>
            <a
              className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-6 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[180px]"
              href="https://github.com/promptz-dev/promptz"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contribute
            </a>
          </div>
        </div>

        {/* Latest Prompts Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
              Latest Prompts
            </h2>
            <Link
              href="/prompts"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors"
            >
              View all →
            </Link>
          </div>
          
          <Suspense fallback={<ContentLoading />}>
            <LatestPrompts />
          </Suspense>
        </section>

        {/* Latest Agents Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
              Latest Custom Agents
            </h2>
            <Link
              href="/agents"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors"
            >
              View all →
            </Link>
          </div>
          
          <Suspense fallback={<ContentLoading />}>
            <LatestAgents />
          </Suspense>
        </section>

        {/* Latest Powers Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
              Latest Kiro Powers
            </h2>
            <Link
              href="/powers"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors"
            >
              View all →
            </Link>
          </div>
          
          <Suspense fallback={<ContentLoading />}>
            <LatestPowers />
          </Suspense>
        </section>

        {/* Latest Steering Documents Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
              Latest Steering Documents
            </h2>
            <Link
              href="/steering"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors"
            >
              View all →
            </Link>
          </div>
          
          <Suspense fallback={<ContentLoading />}>
            <LatestSteering />
          </Suspense>
        </section>

        {/* Latest Agent Hooks Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
              Latest Agent Hooks
            </h2>
            <Link
              href="/hooks"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors"
            >
              View all →
            </Link>
          </div>
          
          <Suspense fallback={<ContentLoading />}>
            <LatestHooks />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
