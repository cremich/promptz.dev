import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ContentHeader } from "@/components/content-header";
import { ContributorInfo } from "@/components/contributor-info";
import { Keywords } from "@/components/keywords";
import { getPowerById, getAllPowers } from "@/lib/powers";
import { idToSlug, slugToId, isValidSlug } from "@/lib/formatter/slug";
import { getLibraryName } from "@/lib/library";
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

// Power Content Tabs component
function PowerContentTabs({ 
  power, 
  steeringContents 
}: { 
  power: Power; 
  steeringContents: Array<{ filename: string; content: string }> 
}) {
  return (
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
  );
}
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

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto max-w-4xl px-6 py-16">
        {/* Header Section */}
        <ContentHeader content={power} />
        
        {/* Keywords */}
        <Keywords keywords={power.keywords} />

        {/* Contributor Information */}
        <ContributorInfo content={power} />

        {/* Power Content Tabs */}
        <PowerContentTabs power={power} steeringContents={steeringContents} />
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