import { Suspense } from "react";
import Link from "next/link";
import { Grid, GridSkeleton } from "@/components/grid";
import { getAllPowers } from "@/lib/powers";

// Loading component for Suspense boundary
function PowersLoading() {
  return <GridSkeleton count={12} />;
}

// Server component to fetch and display all powers
async function AllPowers() {
  const powers = await getAllPowers();
  return <Grid items={powers} />;
}

export default function PowersPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto max-w-7xl px-6 py-16">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50 mb-6">
            Kiro Powers
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400 mb-8">
            Discover packaged tools, workflows, and best practices that Kiro can activate on-demand. 
            Powers provide comprehensive integrations with popular services and development tools.
          </p>
          <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
            <Link
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[180px]"
              href="/"
            >
              Back to Home
            </Link>
            <a
              className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-6 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[180px]"
              href="https://github.com/kiro-dev/kiro-powers"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contribute
            </a>
          </div>
        </div>

        {/* Powers Grid Section */}
        <section>
          <Suspense fallback={<PowersLoading />}>
            <AllPowers />
          </Suspense>
        </section>
      </main>
    </div>
  );
}

export const metadata = {
  title: "Kiro Powers | Promptz.dev",
  description: "Discover packaged tools, workflows, and best practices that Kiro can activate on-demand. Powers provide comprehensive integrations with popular services and development tools.",
};