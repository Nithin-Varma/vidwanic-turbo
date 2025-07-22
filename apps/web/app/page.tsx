import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import PublicationsCarousel from "./components/PublicationsCarousel";
import SchoolsPartnership from "./components/SchoolsPartnership";
import Testimonials from "./components/Testimonials";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import { prisma } from "@repo/db";

async function getPublications() {
  try {
    const publications = await prisma.magazine.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      include: {
        _count: {
          select: {
            purchases: true,
            comments: true
          }
        }
      }
    });

    // Transform data to match our interface
    return (publications || []).map((pub: any) => ({
      id: pub.id,
      title: pub.title,
      description: pub.description,
      shortDesc: pub.shortDesc,
      coverImage: pub.coverImage,
      price: pub.price,
      suitableFor: pub.suitableFor,
      totalPurchases: pub.totalPurchases,
      schoolPurchases: pub.schoolPurchases,
      createdAt: pub.createdAt.toISOString(),
      updatedAt: pub.updatedAt.toISOString(),
      commentsCount: pub._count.comments,
      purchasesCount: pub._count.purchases
    }));
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
      <SchoolsPartnership />
      <Testimonials />
      <AboutUs />
      <ContactUs />
    </>
  );
}