"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Calendar, Users, Star, MessageCircle, Send, Download, Eye, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { handleSignIn } from "../../lib/auth-actions";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface Publication {
  id: string;
  title: string;
  description: string | null;
  shortDesc: string | null;
  coverImage: string | null;
  price: number;
  suitableFor: string | null;
  totalPurchases: number;
  schoolPurchases: number;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
  _count: {
    comments: number;
    purchases: number;
  };
}

interface Session {
  user: {
    id: string;
    isAdmin: boolean;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface Props {
  publication: Publication;
  session: Session | null;
}

export default function PublicationDetailClient({ publication, session }: Props) {
  const [comments, setComments] = useState(publication.comments);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session?.user) return;

    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/publications/${publication.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Add the new comment to the local state
        setComments([result.data, ...comments]);
        setNewComment("");
      } else {
        if (response.status === 401) {
          alert('Please sign in to post a comment.');
        } else {
          alert(result.error || 'Failed to post comment. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <main className="min-h-screen bg-vidwanic-background">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-vidwanic-orange hover:underline">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/publications" className="text-vidwanic-orange hover:underline">
              Publications
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 truncate">{publication.title}</span>
          </div>
        </div>
      </div>

      {/* Publication Details */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Cover Image */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="aspect-[3/4] relative bg-gradient-to-br from-vidwanic-orange to-vidwanic-orange-hover rounded-2xl shadow-2xl overflow-hidden">
                  {publication.coverImage ? (
                    <Image
                      src={publication.coverImage}
                      alt={publication.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <div className="text-center">
                        <Calendar className="w-16 h-16 mx-auto mb-4 opacity-80" />
                        <p className="text-lg opacity-90">No Cover Image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Details */}
            <div>
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-vidwanic-orange/10 text-vidwanic-orange font-medium text-sm mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  Published {new Date(publication.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-vidwanic-text mb-6">
                {publication.title}
              </h1>

              {publication.shortDesc && (
                <p className="text-xl text-gray-600 mb-6">
                  {publication.shortDesc}
                </p>
              )}

              <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-vidwanic-orange">₹{publication.price}</div>
                    <div className="text-sm text-gray-600">Price</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-vidwanic-text">{publication.totalPurchases}</div>
                    <div className="text-sm text-gray-600">Total Purchases</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-vidwanic-text">{publication.schoolPurchases}</div>
                    <div className="text-sm text-gray-600">School Purchases</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-vidwanic-text">{comments.length}</div>
                    <div className="text-sm text-gray-600">Comments</div>
                  </div>
                </div>
              </div>

              {publication.suitableFor && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-vidwanic-orange" />
                    <span className="font-semibold text-vidwanic-text">Suitable For:</span>
                  </div>
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-vidwanic-orange/10 text-vidwanic-orange font-medium">
                    {publication.suitableFor}
                  </span>
                </div>
              )}

              {publication.description && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-vidwanic-text mb-4">Description</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">{publication.description}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl">
                  <Eye className="w-5 h-5 mr-2" />
                  Read Preview
                </Button>
                <Button variant="outline" className="border-vidwanic-orange text-vidwanic-orange hover:bg-vidwanic-orange hover:text-white font-semibold px-8 py-3 rounded-full transition-all duration-200">
                  <Download className="w-5 h-5 mr-2" />
                  Purchase & Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-3 mb-8">
            <MessageCircle className="w-6 h-6 text-vidwanic-orange" />
            <h2 className="text-2xl font-bold text-vidwanic-text">
              Comments ({comments.length})
            </h2>
          </div>

          {/* Comment Form */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            {session?.user ? (
              <form onSubmit={handleSubmitComment}>
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Add a comment
                  </label>
                  <textarea
                    id="comment"
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about this publication..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vidwanic-orange focus:border-transparent resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!newComment.trim() || submittingComment}
                  className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold px-6 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingComment ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Post Comment
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <LogIn className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Sign in to join the conversation</h3>
                <p className="text-gray-600 mb-4">Share your thoughts and engage with the community</p>
                <form action={handleSignIn}>
                  <Button type="submit" className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold px-6 py-2 rounded-full">
                    Sign In to Comment
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {comment.user.image ? (
                      <img
                        src={comment.user.image}
                        alt={comment.user.name || 'User'}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-vidwanic-orange rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {comment.user.name ? comment.user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-vidwanic-text">
                        {comment.user.name || 'Anonymous User'}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}