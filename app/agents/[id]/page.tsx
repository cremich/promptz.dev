import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllAgents, getAgentById } from "@/lib/agents";
import { getFormattedDisplayDate } from "@/lib/utils/date-formatter";
import { getShortHash } from "@/lib/utils/git-extractor";
import { idToSlug, slugToId, isValidSlug } from "@/lib/utils/slug-utils";
import { 
  getContentTypeBadgeVariant, 
  getLibraryBadgeVariant, 
  getLibraryName 
} from "@/lib/utils/badge-utils";
import { cn } from "@/lib/utils";
import type { Agent } from "@/lib/types/content";

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

// Generate GitHub URL for the agent file
function getGitHubUrl(agent: Agent): string {
  const libraryName = getLibraryName(agent.path);
  const baseUrl = libraryName === 'kiro-powers' 
    ? 'https://github.com/kirodotdev/powers/blob/main'
    : 'https://github.com/cremich/promptz.lib/blob/main';
  
  // Extract relative path from the full path
  const pathParts = agent.path.split('/');
  const libraryIndex = pathParts.findIndex(part => part === libraryName);
  const relativePath = pathParts.slice(libraryIndex + 1).join('/');
  
  return `${baseUrl}/${relativePath}`;
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

  const libraryName = getLibraryName(agent.path);
  const contentTypeBadge = getContentTypeBadgeVariant('agent');
  const libraryBadge = getLibraryBadgeVariant(libraryName);
  const githubUrl = getGitHubUrl(agent);
  
  // Use git information if available, otherwise fall back to frontmatter
  const displayAuthor = agent.git?.author || agent.author;
  const createdDate = getFormattedDisplayDate(agent.git?.createdDate, agent.date);
  const lastModifiedDate = agent.git?.lastModifiedDate 
    ? getFormattedDisplayDate(agent.git.lastModifiedDate, null)
    : null;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto max-w-4xl px-6 py-16">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50">
              {agent.title}
            </h1>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Badge 
                variant={contentTypeBadge.variant}
                className={cn("text-xs", contentTypeBadge.className)}
              >
                agent
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
            {agent.description}
          </p>
          
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            ID: <code className="text-sm bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">{agent.id}</code>
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
              
              {agent.git?.commitHash && (
                <div>
                  <h3 className="font-semibold text-sm text-zinc-600 dark:text-zinc-400 mb-1">Latest Commit</h3>
                  <p className="text-sm font-mono">
                    {getShortHash(agent.git.commitHash)}
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