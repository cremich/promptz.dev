import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentHeader } from "@/components/content-header";
import { ContributorInfo } from "@/components/contributor-info";
import { getPromptById, getAllPrompts } from "@/lib/prompts";
import { idToSlug, slugToId, isValidSlug } from "@/lib/formatter/slug";
import { getLibraryName } from "@/lib/library";

interface PromptDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const prompts = await getAllPrompts();
    return prompts.map((prompt) => ({
      id: idToSlug(prompt.id),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PromptDetailPageProps): Promise<Metadata> {
  const { id: slug } = await params;
  
  if (!isValidSlug(slug)) {
    return {
      title: "Invalid Prompt URL | Promptz.dev",
      description: "The requested prompt URL is not valid.",
    };
  }
  
  const id = slugToId(slug);
  const prompt = await getPromptById(id);

  if (!prompt) {
    return {
      title: "Prompt Not Found | Promptz.dev",
      description: "The requested prompt could not be found.",
    };
  }

  const libraryName = getLibraryName(prompt.path);
  const author = prompt.git?.author || prompt.author;
  
  return {
    title: `${prompt.title} | Promptz.dev`,
    description: `AI development prompt by ${author} from ${libraryName} library. ${prompt.content.slice(0, 150)}...`,
    keywords: [
      "AI prompt",
      "development",
      prompt.category || "general",
      libraryName,
      author,
      "Kiro",
      "Amazon Q Developer"
    ],
    authors: [{ name: author }],
    openGraph: {
      title: `${prompt.title} | Promptz.dev`,
      description: `AI development prompt by ${author} from ${libraryName} library.`,
      type: "article",
      authors: [author],
      publishedTime: prompt.git?.createdDate || prompt.date,
      modifiedTime: prompt.git?.lastModifiedDate,
    },
    twitter: {
      card: "summary_large_image",
      title: `${prompt.title} | Promptz.dev`,
      description: `AI development prompt by ${author} from ${libraryName} library.`,
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

async function PromptDetail({ slug }: { slug: string }) {
  if (!isValidSlug(slug)) {
    notFound();
  }
  
  const id = slugToId(slug);
  const prompt = await getPromptById(id);

  if (!prompt) {
    notFound();
  }

  return (
    <section className="container mx-auto max-w-4xl px-6 py-12">
      {/* Back Link */}
      <Link
        href="/prompts"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Prompts
      </Link>

      {/* Header */}
      <ContentHeader content={prompt} />
      
      {/* Category Badge */}
      {prompt.category && (
        <div className="mb-8">
          <Badge variant="outline" className="text-xs">
            {prompt.category}
          </Badge>
        </div>
      )}

      {/* Contributor Information */}
      <ContributorInfo content={prompt} />

      {/* Prompt Content */}
      <Card className="border-border/40 bg-card/50">
        <CardHeader>
          <CardTitle className="text-xl">Prompt Content</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap overflow-x-auto rounded-lg border border-border/40 bg-muted/50 p-4 text-sm">
            {prompt.content}
          </pre>
        </CardContent>
      </Card>
    </section>
  );
}

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
  const { id: slug } = await params;

  return (
    <Suspense fallback={<DetailSkeleton />}>
      <PromptDetail slug={slug} />
    </Suspense>
  );
}
