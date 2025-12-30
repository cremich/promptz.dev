import { Suspense } from "react";
import { Metadata } from "next";
import { HooksGrid, HooksGridSkeleton } from "@/components/hooks-grid";
import { getAllHooks } from "@/lib/hooks";

// SEO metadata for the hooks page
export const metadata: Metadata = {
  title: "All Agent Hooks | Promptz.dev",
  description: "Browse all agent hooks and automation tools that execute predefined agent actions when specific IDE events occur with Kiro and Amazon Q Developer.",
  keywords: ["agent hooks", "automation", "Kiro", "Amazon Q Developer", "AI-assisted development", "IDE automation", "workflow triggers"],
  openGraph: {
    title: "All Agent Hooks | Promptz.dev",
    description: "Browse all agent hooks and automation tools that execute predefined agent actions when specific IDE events occur.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Agent Hooks | Promptz.dev",
    description: "Browse all agent hooks and automation tools that execute predefined agent actions when specific IDE events occur.",
  },
};

// Loading component for Suspense boundary
function HooksLoading() {
  return <HooksGridSkeleton count={12} />;
}

// Server component to fetch and display all hooks
async function AllHooks() {
  const hooks = await getAllHooks();
  return <HooksGrid hooks={hooks} />;
}

export default function HooksPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto max-w-7xl px-6 py-16">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50 mb-6">
            All Agent Hooks
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400 mb-8">
            Explore our complete collection of agent hooks and automation tools that execute 
            predefined agent actions when specific IDE events occur. Sorted by creation date with the newest first.
          </p>
        </div>

        {/* All Hooks Section */}
        <section>
          <Suspense fallback={<HooksLoading />}>
            <AllHooks />
          </Suspense>
        </section>
      </main>
    </div>
  );
}