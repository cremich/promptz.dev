import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getPowerById, getAllPowers } from "@/lib/powers";
import { getFormattedDisplayDate } from "@/lib/utils/date-formatter";
import { getShortHash } from "@/lib/utils/git-extractor";
import { idToSlug, slugToId, isValidSlug } from "@/lib/utils/slug-utils";
import { 
  getContentTypeBadgeVariant, 
  getLibraryBadgeVariant, 
  getLibraryName 
} from "@/lib/utils/badge-utils";
import { cn } from "@/lib/utils";
import type { Power } from "@/lib/types/content";

interface PowerDetailPageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for all available powers
export async function generateStaticParams() {
  try {
    const powers = await getAllPowers();
    return powers.map((power) => ({
      id: idToSlug(power.id),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PowerDetailPageProps): Promise<Metadata> {
  const { id: slug } = await params;
  
  // Validate slug format
  if (!isValidSlug(slug)) {
    return {
      title: "Invalid Power URL | Promptz.dev",
      description: "The requested power URL is not valid.",
    };
  }
  
  const id = slugToId(slug);
  const power = await getPowerById(id);

  if (!power) {
    return {
      title: "Power Not Found | Promptz.dev",
      description: "The requested power could not be found.",
    };
  }

  const libraryName = getLibraryName(power.path);
  const author = power.git?.author || power.author;
  
  return {
    title: `${power.displayName || power.title} | Promptz.dev`,
    description: `Kiro power by ${author} from ${libraryName} library. ${power.description}`,
    keywords: [
      "Kiro power",
      "AI development",
      "development tools",
      ...power.keywords,
      libraryName,
      author,
      "Kiro",
      "Amazon Q Developer"
    ],
    authors: [{ name: author }],
    openGraph: {
      title: `${power.displayName || power.title} | Promptz.dev`,
      description: `Kiro power by ${author} from ${libraryName} library. ${power.description}`,
      type: "article",
      authors: [author],
      publishedTime: power.git?.createdDate || power.date,
      modifiedTime: power.git?.lastModifiedDate,
    },
    twitter: {
      card: "summary_large_image",
      title: `${power.displayName || power.title} | Promptz.dev`,
      description: `Kiro power by ${author} from ${libraryName} library. ${power.description}`,
    },
  };
}

// Generate GitHub URL for the power directory
function getGitHubUrl(power: Power): string {
  const libraryName = getLibraryName(power.path);
  const baseUrl = libraryName === 'kiro-powers' 
    ? 'https://github.com/kirodotdev/powers/blob/main'
    : 'https://github.com/cremich/promptz.lib/blob/main';
  
  // Extract relative path from the full path
  const pathParts = power.path.split('/');
  const libraryIndex = pathParts.findIndex(part => part === libraryName);
  const relativePath = pathParts.slice(libraryIndex + 1).join('/');
  
  // Remove the filename to get the directory path
  const directoryPath = relativePath.split('/').slice(0, -1).join('/');
  
  return `${baseUrl}/${directoryPath}`;
}

// Load steering file content for a power
async function loadSteeringFileContent(power: Power, filename: string): Promise<string> {
  try {
    const powerDir = power.path.replace('/POWER.md', '');
    const steeringFilePath = `${powerDir}/steering/${filename}`;
    
    // Use the same file reading utility as the content service
    const fs = await import('fs');
    const content = await fs.promises.readFile(steeringFilePath, 'utf-8');
    return content;
  } catch (error) {
    console.warn(`Failed to load steering file: ${filename}`, error);
    return `Failed to load content for ${filename}`;
  }
}

// Load all steering files content for a power
async function loadAllSteeringFiles(power: Power): Promise<Array<{ filename: string; content: string }>> {
  if (!power.steeringFiles || power.steeringFiles.length === 0) {
    return [];
  }
  
  const steeringContents = await Promise.all(
    power.steeringFiles.map(async (filename) => ({
      filename,
      content: await loadSteeringFileContent(power, filename)
    }))
  );
  
  return steeringContents;
}

// Server component to display power details
async function PowerDetail({ slug }: { slug: string }) {
  // Validate slug format
  if (!isValidSlug(slug)) {
    notFound();
  }
  
  const id = slugToId(slug);
  const power = await getPowerById(id);

  if (!power) {
    notFound();
  }

  // Load steering files content
  const steeringContents = await loadAllSteeringFiles(power);

  const libraryName = getLibraryName(power.path);
  const contentTypeBadge = getContentTypeBadgeVariant('power');
  const libraryBadge = getLibraryBadgeVariant(libraryName);
  const githubUrl = getGitHubUrl(power);
  
  // Use git information if available, otherwise fall back to frontmatter
  const displayAuthor = power.git?.author || power.author;
  const createdDate = getFormattedDisplayDate(power.git?.createdDate, power.date);
  const lastModifiedDate = power.git?.lastModifiedDate 
    ? getFormattedDisplayDate(power.git.lastModifiedDate, null)
    : null;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto max-w-4xl px-6 py-16">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50">
              {power.displayName || power.title}
            </h1>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Badge 
                variant={contentTypeBadge.variant}
                className={cn("text-xs", contentTypeBadge.className)}
              >
                power
              </Badge>
              <Badge 
                variant={libraryBadge.variant}
                className={cn("text-xs", libraryBadge.className)}
              >
                {libraryName}
              </Badge>
            </div>
          </div>
          
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">
            {power.description}
          </p>
          
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            ID: <code className="text-sm bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">{power.id}</code>
          </p>
          
          {/* Keywords */}
          {power.keywords && power.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {power.keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
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
              
              {power.git?.commitHash && (
                <div>
                  <h3 className="font-semibold text-sm text-zinc-600 dark:text-zinc-400 mb-1">Latest Commit</h3>
                  <p className="text-sm font-mono">
                    {getShortHash(power.git.commitHash)}
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

        {/* Power Content Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Power Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="prompt" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="prompt">Prompt</TabsTrigger>
                <TabsTrigger value="configuration" disabled={!power.mcpConfig}>
                  MCP Configuration
                </TabsTrigger>
                <TabsTrigger value="steering" disabled={steeringContents.length === 0}>
                  Steering Files
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="prompt" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">POWER.md</h3>
                  <pre className="whitespace-pre-wrap text-sm bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg overflow-x-auto border">
                    {power.content}
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="configuration" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">mcp.json</h3>
                  {power.mcpConfig ? (
                    <pre className="whitespace-pre-wrap text-sm bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg overflow-x-auto border">
                      {JSON.stringify(power.mcpConfig, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      No MCP configuration available for this power.
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="steering" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Steering Files</h3>
                  {steeringContents.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {steeringContents.map((steeringFile, index) => (
                        <AccordionItem key={index} value={`steering-${index}`}>
                          <AccordionTrigger className="text-left">
                            {steeringFile.filename}
                          </AccordionTrigger>
                          <AccordionContent>
                            <pre className="whitespace-pre-wrap text-sm bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg overflow-x-auto border">
                              {steeringFile.content}
                            </pre>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      No steering files available for this power.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default async function PowerDetailPage({ params }: PowerDetailPageProps) {
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
      <PowerDetail slug={slug} />
    </Suspense>
  );
}