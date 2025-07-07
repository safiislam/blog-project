"use client";

import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function BlogPage() {
  const params = useParams();
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://dogs-strapi.ryzan.co/api/blogs?filters[slug][$eq]=${params?.slug}&populate=*`
        );

        if (!res.ok) throw new Error("Failed to fetch blog");

        const data = await res.json();
        setBlogData(data.data?.[0] || null);
      } catch (err) {
        setError(err.message || "Error loading blog");
      } finally {
        setLoading(false);
      }
    };

    if (params?.slug) fetchData();
  }, [params?.slug]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} />;
  if (!blogData) return <NotFoundDisplay />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-gray-800 dark:text-gray-100 space-y-8">
      {/* Featured Image */}
      {blogData.image && (
        <div className="overflow-hidden rounded-xl shadow-lg">
          <img
            src={`https://dogs-strapi.ryzan.co${blogData.image.url}`}
            alt={blogData.title || "Blog image"}
            className="w-full h-auto max-h-[400px] object-cover"
          />
        </div>
      )}

      {/* Author Info */}
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <img
            src={
              blogData?.author?.avatar ||
              `https://ui-avatars.com/api/?name=${blogData?.author?.name}&background=random`
            }
            alt={blogData.author?.name || "Author"}
            className="h-12 w-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {blogData.author?.name || "Unknown Author"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(blogData.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
        {blogData.title}
      </h1>

      {/* Description */}
      {blogData.description && (
        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
          {blogData.description}
        </p>
      )}

      {/* Content */}
      <div className="prose dark:prose-invert prose-lg max-w-none">
        <Markdown>{blogData.blog_text}</Markdown>
      </div>
    </div>
  );
}

// Loading Skeleton (Pure Tailwind)
function LoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
}

// Error Display (Pure Tailwind)
function ErrorDisplay({ error }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center">
      <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-lg">
        <p>Error loading blog post: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 rounded-md text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

// Not Found Display (Pure Tailwind)
function NotFoundDisplay() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center">
      <div className="bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 p-4 rounded-lg">
        <p>Blog post not found</p>
        <Link
          href="/"
          className="mt-2 inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30 rounded-md text-sm font-medium transition-colors"
        >
          Browse all posts
        </Link>
      </div>
    </div>
  );
}
