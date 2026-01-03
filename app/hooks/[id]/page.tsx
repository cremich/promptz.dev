import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

export async function generateMetadata({ params }: HookDetailPageProps): Promise<Metadata> {
  const { id: slug } = await params;
  
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

function DetailSkeleton() {
  return (
    <section className="container mx-auto max-w-4xl px-6 py-12">
      <div className="animate-pulse space-y-8">
        <div className="h-5 w-24 rounded bg-muted" />
        <div className="h-10 w-3/4 rounded bg-muted" />
        <div className="h-24 rounded bg-muted" />
        <div className="h-64 rounded bg-muted" />
      </div>
    </section>
  );
}

async function HookDetail({ slug }: { slug: string }) {
  if (!isValidSlug(slug)) {
    notFound();
  }
  
  const id = slugToId(slug);
  const hook = await getHookById(id);

  if (!hook) {
    notFound();
  }

  return (
    <section className="container mx-auto max-w-4xl px-6 py-12">
      {/* Back Link */}
      <Link
        href="/hooks"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Hooks
      </Link>

      {/* Header with Trigger Badge */}
      <div className="mb-8">
        <ContentHeader content={hook} />
        <div className="mt-4 flex flex-wrap gap-2">
          <HookTriggerBadge trigger={hook.trigger} />
        </div>
      </div>

      {/* Contributor Information */}
      <ContributorInfo content={hook} />

      {/* Hook Content */}
      <Card className="border-border/40 bg-card/50">
        <CardHeader>
          <CardTitle className="text-xl">Hook Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap overflow-x-auto rounded-lg border border-border/40 bg-muted/50 p-4 text-sm">
            {hook.content}
          </pre>
        </CardContent>
      </Card>
    </section>
  );
}

export default async function HookDetailPage({ params }: HookDetailPageProps) {
  const { id: slug } = await params;

  return (
    <Suspense fallback={<DetailSkeleton />}>
      <HookDetail slug={slug} />
    </Suspense>
  );
}
