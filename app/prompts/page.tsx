import { Suspense } from "react";
import { Metadata } from "next";
import { PromptsGrid, PromptsGridSkeleton } from "@/components/prompts-grid";
import { getAllPrompts } from "@/lib/prompts";

// SEO metadata for the prompts page
export const metadata: Metadata = {
  title: "All Prompts | Promptz.dev",
  description: "Browse all AI development prompts, steering documents, and resources for enhanced development workflows with Kiro and Amazon Q Developer.",
  keywords: ["AI prompts", "development", "Kiro", "Amazon Q Developer", "AI-assisted development", "prompts library"],
  openGraph: {
    title: "All Prompts | Promptz.dev",
    description: "Browse all AI development prompts, steering documents, and resources for enhanced development workflows.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Prompts | Promptz.dev",
    description: "Browse all AI development prompts, steering documents, and resources for enhanced development workflows.",
  },
};

// Loading component for Suspense boundary
function PromptsLoading() {
  return <PromptsGridSkeleton count={12} />;
}

// Server component to fetch and display all prompts
async function AllPrompts() {
  const prompts = await getAllPrompts();
  return <PromptsGrid prompts={prompts} />;
}

export default function PromptsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto max-w-7xl px-6 py-16">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50 mb-6">
            All AI Development Prompts
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400 mb-8">
            Explore our complete collection of AI development prompts, steering documents, 
            and resources from all libraries. Sorted by creation date with the newest first.
          </p>
        </div>

        {/* All Prompts Section */}
        <section>
          <Suspense fallback={<PromptsLoading />}>
            <AllPrompts />
          </Suspense>
        </section>
      </main>
    </div>
  );
}