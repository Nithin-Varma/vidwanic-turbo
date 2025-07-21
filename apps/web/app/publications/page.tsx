import { Button } from "@repo/ui/components/ui/button";
import { Search, Filter, Calendar, Users, Star, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import PublicationsClient from "./PublicationsClient";
import { prisma } from "@repo/db";

async function getPublications() {
  try {
    const publications = await prisma.magazine.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        _count: {
          select: {
            purchases: true,
            comments: true
          }
        }
      }
    });

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
      commentsCount: pub._count.comments,
      purchasesCount: pub._count.purchases
    }));
  } catch (error) {
    console.error('Error fetching publications:', error);
    return [];
  }
}

export default async function PublicationsPage() {
  const publications = await getPublications();

  return (
    <>
      <Header />
      <PublicationsClient publications={publications} />
    </>
  );
}