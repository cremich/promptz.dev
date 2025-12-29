import Image from "next/image";
import { Suspense } from "react";
import { PromptsGrid, PromptsGridSkeleton } from "@/components/prompts-grid";
import { getLatestPrompts } from "@/lib/prompts";

// Loading component for Suspense boundary
function PromptsLoading() {
  return <PromptsGridSkeleton count={6} />;
}

// Server component to fetch and display prompts
async function LatestPrompts() {
  const prompts = await getLatestPrompts(6);
  return <PromptsGrid prompts={prompts} maxItems={6} />;
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
            Discover the latest AI development prompts, steering documents, and resources 
            to enhance your development workflow with Kiro and Amazon Q Developer.
          </p>
          <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
            <a
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[180px]"
              href="/prompts"
            >
              Browse All Prompts
            </a>
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
            <a
              href="/prompts"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors"
            >
              View all →
            </a>
          </div>
          
          <Suspense fallback={<PromptsLoading />}>
            <LatestPrompts />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
