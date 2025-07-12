import WorkClientPage from '@/components/WorkClientPage';

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
    return <p className="text-center text-muted-foreground mt-12">No projects found. Check back later!</p>;
  }

  return <WorkClientPage categorizedProjects={categorizedProjects} />;
}
