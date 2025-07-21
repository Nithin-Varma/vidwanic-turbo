import { Button } from "@repo/ui/components/ui/button";
import { ArrowLeft, Calendar, Users, Star, MessageCircle, Send, Download, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";
import PublicationDetailClient from "./PublicationDetailClient";
import { auth } from "../../../auth";
import { prisma } from "@repo/db";

async function getPublication(id: string) {
  try {
    const publication = await prisma.magazine.findUnique({
      where: { id },
      include: {
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            purchases: true,
            comments: true
          }
        }
      }
    });

    return publication;
  } catch (error) {
    console.error('Error fetching publication:', error);
    return null;
  }
}

export default async function PublicationDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const publication = await getPublication(params.id);

  if (!publication) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-vidwanic-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-vidwanic-text mb-4">Publication Not Found</h1>
            <p className="text-gray-600 mb-8">The publication you're looking for doesn't exist.</p>
            <Link href="/publications">
              <Button className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Publications
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <PublicationDetailClient publication={publication} session={session} />
    </>
  );
}