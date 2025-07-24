import { auth } from "../../../auth";
import { prisma } from "@repo/db";
import { redirect } from "next/navigation";
import MagazineOrderClient from "./MagazineOrderClient";

async function getSchoolAndMagazines(userId: string) {
  try {
    const schoolProfile = await prisma.schoolProfile.findUnique({
      where: { onboardedByUserId: userId }
    });

    if (!schoolProfile || !schoolProfile.isVerified) {
      return null;
    }

    const magazines = await prisma.magazine.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        shortDesc: true,
        coverImage: true,
        price: true,
        suitableFor: true,
        totalPurchases: true,
        schoolPurchases: true,
        createdAt: true
      }
    });

    return {
      schoolProfile,
      magazines
    };
  } catch (error) {
    console.error('Error fetching school and magazines:', error);
    return null;
  }
}

export default async function SchoolMagazinesPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const data = await getSchoolAndMagazines(session.user.id);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            Your school must be verified to access magazine ordering.
          </p>
          <a
            href="/school/dashboard"
            className="text-vidwanic-orange hover:text-vidwanic-orange-hover underline"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <MagazineOrderClient 
      schoolProfile={data.schoolProfile} 
      magazines={data.magazines}
      session={session}
    />
  );
}