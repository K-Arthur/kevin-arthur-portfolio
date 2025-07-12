import { Suspense } from 'react';
import WorkClientPage from '@/components/WorkClientPage';
import { Skeleton } from '@/components/ui/skeleton';

// This function now fetches data from our new API endpoint
async function getProjects() {
  try {
    // Ensure we are calling the deployed or local URL
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/work`, { 
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    if (!res.ok) {
      console.error('Failed to fetch projects from API:', res.status, res.statusText);
      return [];
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching projects for work page:', error);
    return [];
  }
}

export const metadata = {
  title: 'My Work',
  description: 'A curated collection of my best projects in UI/UX design, branding, and motion graphics.',
};

export default async function WorkPage() {
  const categorizedProjects = await getProjects();
  
  if (!categorizedProjects || categorizedProjects.length === 0) {
    return <p className="text-center text-muted-foreground mt-12">No projects found.</p>;
  }

  return (
    <Suspense fallback={<WorkPageSkeleton />}>
      <WorkClientPage categorizedProjects={categorizedProjects} />
    </Suspense>
  );
}

// A skeleton loader to improve perceived performance
function WorkPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="space-y-12">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton className="h-8 w-1/3 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {[1, 2, 3].map((j) => (
                <div key={j} className="group">
                  <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                  <div className="mt-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
