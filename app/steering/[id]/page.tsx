import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSteeringById, getAllSteering } from "@/lib/steering";
import { idToSlug, slugToId, isValidSlug } from "@/lib/formatter/slug";
import { getLibraryName } from "@/lib/library";
import { ContentHeader } from "@/components/content-header";
import { ContributorInfo } from "@/components/contributor-info";

interface SteeringDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const steering = await getAllSteering();
    return steering.map((doc) => ({
      id: idToSlug(doc.id),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: SteeringDetailPageProps): Promise<Metadata> {
  const { id: slug } = await params;
  
  if (!isValidSlug(slug)) {
    return {
      title: "Invalid Steering Document URL | Promptz.dev",
      description: "The requested steering document URL is not valid.",
    };
  }
  
  const id = slugToId(slug);
  const steering = await getSteeringById(id);

  if (!steering) {
    return {
      title: "Steering Document Not Found | Promptz.dev",
      description: "The requested steering document could not be found.",
    };
  }

  const libraryName = getLibraryName(steering.path);
  const author = steering.git?.author || steering.author;
  
  return {
    title: `${steering.title} | Promptz.dev`,
    description: `Project steering document by ${author} from ${libraryName} library. ${steering.content.slice(0, 150)}...`,
    keywords: [
      "steering",
      "project rules",
      "development standards",
      "AI assistant configuration",
      steering.category || "general",
      libraryName,
      author,
      "Kiro",
      "Amazon Q Developer"
    ],
    authors: [{ name: author }],
    openGraph: {
      title: `${steering.title} | Promptz.dev`,
      description: `Project steering document by ${author} from ${libraryName} library.`,
      type: "article",
      authors: [author],
      publishedTime: steering.git?.createdDate || steering.date,
      modifiedTime: steering.git?.lastModifiedDate,
    },
    twitter: {
      card: "summary_large_image",
      title: `${steering.title} | Promptz.dev`,
      description: `Project steering document by ${author} from ${libraryName} library.`,
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

async function SteeringDetail({ slug }: { slug: string }) {
  if (!isValidSlug(slug)) {
    notFound();
  }
  
  const id = slugToId(slug);
  const steering = await getSteeringById(id);

  if (!steering) {
    notFound();
  }

  return (
    <section className="container mx-auto max-w-4xl px-6 py-12">
      {/* Back Link */}
      <Link
        href="/steering"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Steering
      </Link>

      {/* Header */}
      <ContentHeader content={steering} />

      {/* Category Badge */}
      {steering.category && (
        <div className="mb-8">
          <Badge variant="outline" className="text-xs">
            {steering.category}
          </Badge>
        </div>
      )}

      {/* Contributor Information */}
      <ContributorInfo content={steering} />

      {/* Steering Document Content */}
      <Card className="border-border/40 bg-card/50">
        <CardHeader>
          <CardTitle className="text-xl">Steering Document Content</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap overflow-x-auto rounded-lg border border-border/40 bg-muted/50 p-4 text-sm">
            {steering.content}
          </pre>
        </CardContent>
      </Card>
    </section>
  );
}

export default async function SteeringDetailPage({ params }: SteeringDetailPageProps) {
  const { id: slug } = await params;

  return (
    <Suspense fallback={<DetailSkeleton />}>
      <SteeringDetail slug={slug} />
    </Suspense>
  );
}
