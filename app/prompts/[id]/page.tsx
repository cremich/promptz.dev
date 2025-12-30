import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPromptById, getAllPrompts } from "@/lib/prompts";
import { getFormattedDisplayDate } from "@/lib/utils/date-formatter";
import { getShortHash } from "@/lib/utils/git-extractor";
import { idToSlug, slugToId, isValidSlug } from "@/lib/utils/slug-utils";
import { 
  getContentTypeBadgeVariant, 
  getLibraryBadgeVariant, 
  getLibraryName 
} from "@/lib/utils/badge-utils";
import { cn } from "@/lib/utils";
import type { Prompt } from "@/lib/types/content";

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

// Generate GitHub URL for the prompt file
function getGitHubUrl(prompt: Prompt): string {
  const libraryName = getLibraryName(prompt.path);
  const baseUrl = libraryName === 'kiro-powers' 
    ? 'https://github.com/kirodotdev/powers/blob/main'
    : 'https://github.com/cremich/promptz.lib/blob/main';
  
  // Extract relative path from the full path
  const pathParts = prompt.path.split('/');
  const libraryIndex = pathParts.findIndex(part => part === libraryName);
  const relativePath = pathParts.slice(libraryIndex + 1).join('/');
  
  return `${baseUrl}/${relativePath}`;
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

  const libraryName = getLibraryName(prompt.path);
  const contentTypeBadge = getContentTypeBadgeVariant('prompt');
  const libraryBadge = getLibraryBadgeVariant(libraryName);
  const githubUrl = getGitHubUrl(prompt);
  
  // Use git information if available, otherwise fall back to frontmatter
  const displayAuthor = prompt.git?.author || prompt.author;
  const createdDate = getFormattedDisplayDate(prompt.git?.createdDate, prompt.date);
  const lastModifiedDate = prompt.git?.lastModifiedDate 
    ? getFormattedDisplayDate(prompt.git.lastModifiedDate, null)
    : null;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto max-w-4xl px-6 py-16">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50">
              {prompt.title}
            </h1>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Badge 
                variant={contentTypeBadge.variant}
                className={cn("text-xs", contentTypeBadge.className)}
              >
                prompt
              </Badge>
              <Badge 
                variant={libraryBadge.variant}
                className={cn("text-xs", libraryBadge.className)}
              >
                {libraryName}
              </Badge>
              {prompt.category && (
                <Badge variant="outline" className="text-xs">
                  {prompt.category}
                </Badge>
              )}
            </div>
          </div>
          
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">
            ID: <code className="text-sm bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">{prompt.id}</code>
          </p>
        </div>

        {/* Contributor Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Contributor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm text-zinc-600 dark:text-zinc-400 mb-1">Author</h3>
                <p className="text-sm">
                  {displayAuthor}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm text-zinc-600 dark:text-zinc-400 mb-1">Created</h3>
                <p className="text-sm">{createdDate}</p>
              </div>
              
              {lastModifiedDate && (
                <div>
                  <h3 className="font-semibold text-sm text-zinc-600 dark:text-zinc-400 mb-1">Last Modified</h3>
                  <p className="text-sm">{lastModifiedDate}</p>
                </div>
              )}
              
              {prompt.git?.commitHash && (
                <div>
                  <h3 className="font-semibold text-sm text-zinc-600 dark:text-zinc-400 mb-1">Latest Commit</h3>
                  <p className="text-sm font-mono">
                    {getShortHash(prompt.git.commitHash)}
                  </p>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>
          </CardContent>
        </Card>

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