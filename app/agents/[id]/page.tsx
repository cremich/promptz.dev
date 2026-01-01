import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentHeader } from "@/components/content-header";
import { ContributorInfo } from "@/components/contributor-info";
import { getAllAgents, getAgentById } from "@/lib/agents";
import { idToSlug, slugToId, isValidSlug } from "@/lib/utils/slug-utils";

interface AgentDetailPageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for all available agents
export async function generateStaticParams() {
  try {
    const agents = await getAllAgents();
    return agents.map((agent) => ({
      id: idToSlug(agent.id),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: AgentDetailPageProps): Promise<Metadata> {
  const { id: slug } = await params;
  
  // Validate slug format
  if (!isValidSlug(slug)) {
    return {
      title: "Invalid Agent URL | Promptz.dev",
      description: "The requested agent URL is not valid.",
    };
  }
  
  const id = slugToId(slug);
  const agent = await getAgentById(id);

  if (!agent) {
    return {
      title: "Agent Not Found | Promptz.dev",
      description: "The requested agent could not be found.",
    };
  }

  const libraryName = getLibraryName(agent.path);
  const author = agent.git?.author || agent.author;
  
  return {
    title: `${agent.title} | Promptz.dev`,
    description: `Custom AI agent by ${author} from ${libraryName} library. ${agent.description}`,
    keywords: [
      "AI agent",
      "custom agent",
      "AI assistant",
      "automation",
      "development workflow",
      libraryName,
      author,
      "Kiro",
      "Amazon Q Developer",
      // Safely spread mcpServers if it's an array
      ...(Array.isArray(agent.config.mcpServers) ? agent.config.mcpServers : []),
      // Safely spread tools if it's an array
      ...(Array.isArray(agent.config.tools) ? agent.config.tools : [])
    ],
    authors: [{ name: author }],
    openGraph: {
      title: `${agent.title} | Promptz.dev`,
      description: `Custom AI agent by ${author} from ${libraryName} library. ${agent.description}`,
      type: "article",
      authors: [author],
      publishedTime: agent.git?.createdDate || agent.date,
      modifiedTime: agent.git?.lastModifiedDate,
    },
    twitter: {
      card: "summary_large_image",
      title: `${agent.title} | Promptz.dev`,
      description: `Custom AI agent by ${author} from ${libraryName} library. ${agent.description}`,
    },
  };
}

// Extract library name from content path
function getLibraryName(path: string): string {
  const pathParts = path.split('/');
  const librariesIndex = pathParts.indexOf('libraries');
  if (librariesIndex !== -1 && librariesIndex + 1 < pathParts.length) {
    const libraryName = pathParts[librariesIndex + 1];
    return libraryName || 'unknown';
  }
  return 'unknown';
}

// Server component to display agent details
async function AgentDetail({ slug }: { slug: string }) {
  // Validate slug format
  if (!isValidSlug(slug)) {
    notFound();
  }
  
  const id = slugToId(slug);
  const agent = await getAgentById(id);

  if (!agent) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto max-w-4xl px-6 py-16">
        <ContentHeader content={agent} />
        <ContributorInfo content={agent} />
        
        {/* Agent Configuration and Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Agent Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="configuration" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="configuration">Configuration</TabsTrigger>
                <TabsTrigger value="prompt">Prompt</TabsTrigger>
              </TabsList>
              
              <TabsContent value="configuration" className="mt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      Agent Configuration
                    </h3>
                    <pre className="text-sm bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg overflow-x-auto border">
                      {JSON.stringify(agent.config, null, 2)}
                    </pre>
                  </div>
                  
                  {Array.isArray(agent.config.mcpServers) && agent.config.mcpServers.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                        MCP Servers
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {agent.config.mcpServers.map((server, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {server}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {Array.isArray(agent.config.tools) && agent.config.tools.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                        Tools
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {agent.config.tools.map((tool, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="prompt" className="mt-6">
                <div>
                  <h3 className="font-semibold text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                    Agent Prompt
                  </h3>
                  <pre className="whitespace-pre-wrap text-sm bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg overflow-x-auto border">
                    {agent.content}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
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
      <AgentDetail slug={slug} />
    </Suspense>
  );
}