import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
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

// Generate static params for all available steering documents
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

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: SteeringDetailPageProps): Promise<Metadata> {
  const { id: slug } = await params;
  
  // Validate slug format
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

// Server component to display steering document details
async function SteeringDetail({ slug }: { slug: string }) {
  // Validate slug format
  if (!isValidSlug(slug)) {
    notFound();
  }
  
  const id = slugToId(slug);
  const steering = await getSteeringById(id);

  if (!steering) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto max-w-4xl px-6 py-16">
        {/* Header Section */}
        <ContentHeader content={steering} />

        {/* Add category badge if present */}
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
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Steering Document Content</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg overflow-x-auto border">
              {steering.content}
            </pre>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default async function SteeringDetailPage({ params }: SteeringDetailPageProps) {
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
      <SteeringDetail slug={slug} />
    </Suspense>
  );
}