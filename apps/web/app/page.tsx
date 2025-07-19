import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import PublicationsCarousel from "./components/PublicationsCarousel";

async function getPublications() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/publications?limit=10`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch publications');
    }
    
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching publications:', error);
    return [];
  }
}

export default async function HomePage() {
  const publications = await getPublications();

  return (
    <>
      <Header />
      <HeroSection />
      <PublicationsCarousel publications={publications} />
    </>
  );
}