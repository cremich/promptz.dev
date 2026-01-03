import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentHeader } from "@/components/content-header";
import { ContributorInfo } from "@/components/contributor-info";
import { getAllAgents, getAgentById } from "@/lib/agents";
import { idToSlug, slugToId, isValidSlug } from "@/lib/formatter/slug";

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
      ...(Array.isArray(agent.config.mcpServers) ? agent.config.mcpServers : []),
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

function getLibraryName(path: string): string {
  const pathParts = path.split('/');
  const librariesIndex = pathParts.indexOf('libraries');
  if (librariesIndex !== -1 && librariesIndex + 1 < pathParts.length) {
    const libraryName = pathParts[librariesIndex + 1];
    return libraryName || 'unknown';
  }
  return 'unknown';
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

async function AgentDetail({ slug }: { slug: string }) {
  if (!isValidSlug(slug)) {
    notFound();
  }
  
  const id = slugToId(slug);
  const agent = await getAgentById(id);

  if (!agent) {
    notFound();
  }

  return (
    <section className="container mx-auto max-w-4xl px-6 py-12">
      {/* Back Link */}
      <Link
        href="/agents"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Agents
      </Link>

      {/* Header */}
      <ContentHeader content={agent} />
      <ContributorInfo content={agent} />
      
      {/* Agent Configuration and Content */}
      <Card className="border-border/40 bg-card/50">
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
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                    Agent Configuration
                  </h3>
                  <pre className="overflow-x-auto rounded-lg border border-border/40 bg-muted/50 p-4 text-sm">
                    {JSON.stringify(agent.config, null, 2)}
                  </pre>
                </div>
                
                {Array.isArray(agent.config.mcpServers) && agent.config.mcpServers.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-medium text-muted-foreground">
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
                    <h3 className="mb-3 text-sm font-medium text-muted-foreground">
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
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                  Agent Prompt
                </h3>
                <pre className="whitespace-pre-wrap overflow-x-auto rounded-lg border border-border/40 bg-muted/50 p-4 text-sm">
                  {agent.content}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
}

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { id: slug } = await params;

  return (
    <Suspense fallback={<DetailSkeleton />}>
      <AgentDetail slug={slug} />
    </Suspense>
  );
}
