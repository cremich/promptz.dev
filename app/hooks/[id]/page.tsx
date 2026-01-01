import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ContentHeader } from "@/components/content-header";
import { ContributorInfo } from "@/components/contributor-info";
import { HookTriggerBadge } from "@/components/hook-trigger-badge";
import { getHookById, getAllHooks } from "@/lib/hooks";
import { getLibraryName } from "@/lib/library";
import { idToSlug, slugToId, isValidSlug } from "@/lib/formatter/slug";
import type { Hook } from "@/lib/types/content";

interface HookDetailPageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for all available hooks
export async function generateStaticParams() {
  try {
    const hooks = await getAllHooks();
    return hooks.map((hook) => ({
      id: idToSlug(hook.id),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: HookDetailPageProps): Promise<Metadata> {
  const { id: slug } = await params;
  
  // Validate slug format
  if (!isValidSlug(slug)) {
    return {
      title: "Invalid Agent Hook URL | Promptz.dev",
      description: "The requested agent hook URL is not valid.",
    };
  }
  
  const id = slugToId(slug);
  const hook = await getHookById(id);

  if (!hook) {
    return {
      title: "Agent Hook Not Found | Promptz.dev",
      description: "The requested agent hook could not be found.",
    };
  }

  return generateHookMetadata(hook);
}

// Extract metadata generation logic
function generateHookMetadata(hook: Hook): Metadata {
  const libraryName = getLibraryName(hook.path);
  const author = hook.git?.author || hook.author;
  
  return {
    title: `${hook.title} | Promptz.dev`,
    description: `Agent hook by ${author} from ${libraryName} library. ${hook.description || hook.content.slice(0, 150)}...`,
    keywords: [
      "agent hook",
      "IDE automation",
      "Kiro hook",
      "development automation",
      hook.trigger || "automation",
      libraryName,
      author,
      "Kiro",
      "Amazon Q Developer"
    ],
    authors: [{ name: author }],
    openGraph: {
      title: `${hook.title} | Promptz.dev`,
      description: `Agent hook by ${author} from ${libraryName} library. ${hook.description || 'IDE automation tool for enhanced development workflow.'}`,
      type: "article",
      authors: [author],
      publishedTime: hook.git?.createdDate || hook.date,
      modifiedTime: hook.git?.lastModifiedDate,
    },
    twitter: {
      card: "summary_large_image",
      title: `${hook.title} | Promptz.dev`,
      description: `Agent hook by ${author} from ${libraryName} library.`,
    },
  };
}

// Render hook content section
function HookContentSection({ content }: { content: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Hook Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap text-sm bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg overflow-x-auto border">
          {content}
        </pre>
      </CardContent>
    </Card>
  );
}

// Server component to display hook details
async function HookDetail({ slug }: { slug: string }) {
  // Validate slug format
  if (!isValidSlug(slug)) {
    notFound();
  }
  
  const id = slugToId(slug);
  const hook = await getHookById(id);

  if (!hook) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto max-w-4xl px-6 py-16">
        {/* Header Section with additional trigger badge */}
        <div className="mb-8">
          <ContentHeader content={hook} />
          <div className="flex flex-wrap gap-2 mt-4">
            <HookTriggerBadge trigger={hook.trigger} />
          </div>
        </div>

        {/* Contributor Information */}
        <ContributorInfo content={hook} />

        {/* Hook Content */}
        <HookContentSection content={hook.content} />
      </main>
    </div>
  );
}

export default async function HookDetailPage({ params }: HookDetailPageProps) {
  const { id: slug } = await params;

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
        <main className="container mx-auto max-w-4xl px-6 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
            <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          </div>
        </main>
      </div>
    }>
      <HookDetail slug={slug} />
    </Suspense>
  );
}