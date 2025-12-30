import { Suspense } from "react";
import { Metadata } from "next";
import { SteeringGrid, SteeringGridSkeleton } from "@/components/steering-grid";
import { getAllSteering } from "@/lib/steering";

// SEO metadata for the steering page
export const metadata: Metadata = {
  title: "All Steering Documents | Promptz.dev",
  description: "Browse all AI steering documents and configuration files for consistent AI assistant behavior with Kiro and Amazon Q Developer.",
  keywords: ["AI steering", "configuration", "Kiro", "Amazon Q Developer", "AI-assisted development", "steering documents", "AI guidance"],
  openGraph: {
    title: "All Steering Documents | Promptz.dev",
    description: "Browse all AI steering documents and configuration files for consistent AI assistant behavior.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Steering Documents | Promptz.dev",
    description: "Browse all AI steering documents and configuration files for consistent AI assistant behavior.",
  },
};

// Loading component for Suspense boundary
function SteeringLoading() {
  return <SteeringGridSkeleton count={12} />;
}

// Server component to fetch and display all steering documents
async function AllSteering() {
  const steering = await getAllSteering();
  return <SteeringGrid steering={steering} />;
}

export default function SteeringPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto max-w-7xl px-6 py-16">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50 mb-6">
            All Steering Documents
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400 mb-8">
            Explore our complete collection of AI steering documents and configuration files 
            that ensure AI assistants consistently follow established patterns, libraries, and standards.
          </p>
        </div>

        {/* All Steering Documents Section */}
        <section>
          <Suspense fallback={<SteeringLoading />}>
            <AllSteering />
          </Suspense>
        </section>
      </main>
    </div>
  );
}