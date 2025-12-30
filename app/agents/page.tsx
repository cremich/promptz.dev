import { Suspense } from "react";
import { Metadata } from "next";
import { Grid, GridSkeleton } from "@/components/grid";
import { getAllAgents } from "@/lib/agents";

// SEO metadata for the agents page
export const metadata: Metadata = {
  title: "All Custom Agents | Promptz.dev",
  description: "Browse all custom AI agents and specialized assistants for specific workflows and development processes with Kiro and Amazon Q Developer.",
  keywords: ["AI agents", "custom agents", "Kiro", "Amazon Q Developer", "AI-assisted development", "specialized assistants", "workflow automation"],
  openGraph: {
    title: "All Custom Agents | Promptz.dev",
    description: "Browse all custom AI agents and specialized assistants for specific workflows and development processes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Custom Agents | Promptz.dev",
    description: "Browse all custom AI agents and specialized assistants for specific workflows and development processes.",
  },
};

// Loading component for Suspense boundary
function AgentsLoading() {
  return <GridSkeleton count={12} />;
}

// Server component to fetch and display all agents
async function AllAgents() {
  const agents = await getAllAgents();
  return <Grid items={agents} />;
}

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto max-w-7xl px-6 py-16">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50 mb-6">
            All Custom Agents
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400 mb-8">
            Explore our complete collection of custom AI agents and specialized assistants 
            designed for specific workflows and development processes. Sorted by creation date with the newest first.
          </p>
        </div>

        {/* All Agents Section */}
        <section>
          <Suspense fallback={<AgentsLoading />}>
            <AllAgents />
          </Suspense>
        </section>
      </main>
    </div>
  );
}