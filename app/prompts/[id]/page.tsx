import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentHeader } from "@/components/content-header";
import { ContributorInfo } from "@/components/contributor-info";
import { getPromptById, getAllPrompts } from "@/lib/prompts";
import { idToSlug, slugToId, isValidSlug } from "@/lib/utils/slug-utils";
import { getLibraryName } from "@/lib/library";

interface PromptDetailPageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for all available prompts
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

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PromptDetailPageProps): Promise<Metadata> {
  const { id: slug } = await params;
  
  // Validate slug format
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

// Server component to display prompt details
async function PromptDetail({ slug }: { slug: string }) {
  // Validate slug format
  if (!isValidSlug(slug)) {
    notFound();
  }
  
  const id = slugToId(slug);
  const prompt = await getPromptById(id);

  if (!prompt) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto max-w-4xl px-6 py-16">
        {/* Header Section */}
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
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Prompt Content</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg overflow-x-auto border">
              {prompt.content}
            </pre>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
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
      <PromptDetail slug={slug} />
    </Suspense>
  );
}