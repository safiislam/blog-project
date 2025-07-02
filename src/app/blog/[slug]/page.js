import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import React from "react";
import Markdown from "react-markdown";
const Page = async ({ params }) => {
  const res = await fetch(
    `http://localhost:1337/api/blogs?filters[slug][$eq]=${params?.slug}&populate=*`,
    {
      cache: "no-cache",
    }
  );

  const data = await res.json();
  const singleData = data?.data?.[0];

  if (!singleData) {
    return <div>No data found</div>;
  }

  const blogText = singleData?.blog_text;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-gray-800 dark:text-gray-100 space-y-8">
      {/* Featured Image */}
      {singleData?.image?.url && (
        <div className="overflow-hidden rounded-xl shadow-lg">
          <img
            src={`http://localhost:1337${singleData.image.url}`}
            alt={singleData?.title || "Blog image"}
            className="w-full h-auto max-h-[480px] object-cover"
          />
        </div>
      )}

      {/* Author Info */}
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <img
            src={
              singleData.author.avatar ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(singleData.author.name || "U") +
                "&background=random"
            }
            alt={singleData.author.name}
            className="h-12 w-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {singleData.author.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(singleData?.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
        {singleData?.title}
      </h1>

      {/* Description */}
      {singleData?.description && (
        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
          {singleData.description}
        </p>
      )}

      {/* Content */}
      <div className="html-content">
        <Markdown>{blogText}</Markdown>
      </div>
    </div>
  );
};

export default Page;
