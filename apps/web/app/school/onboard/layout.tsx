import { auth } from "../../../auth";
import { prisma } from "@repo/db";
import { redirect } from "next/navigation";

async function checkExistingSchool(userId: string) {
  try {
    const existingSchool = await prisma.schoolProfile.findUnique({
      where: { onboardedByUserId: userId },
      select: {
        id: true,
        schoolName: true,
        isVerified: true,
        createdAt: true
      }
    });
    return existingSchool;
  } catch (error) {
    console.error('Error checking existing school:', error);
    return null;
  }
}

export default async function SchoolOnboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (session?.user?.id) {
    const existingSchool = await checkExistingSchool(session.user.id);
    
    if (existingSchool) {
      // Redirect to dashboard if school already exists
      redirect('/school/dashboard');
    }
  }

  return <>{children}</>;
}