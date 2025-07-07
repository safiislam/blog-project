"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(
          "https://dogs-strapi.ryzan.co/api/blogs?populate=*"
        );
        const data = await res.json();
        setBlogs(data?.data || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <div className="text-center py-10">Loading blogs...</div>;

  if (blogs.length === 0)
    return <div className="text-center py-10">No Blogs Found</div>;

  return (
    <div className="p-8">
      <p className="text-xl text-center">Blogs</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 rounded-md">
        {blogs.map((i) => {
          return (
            <Link
              href={`/blog/${i.slug}`}
              key={i.id}
              className="border rounded-md p-4 flex flex-col items-center hover:shadow transition"
            >
              {i?.image?.url && (
                <img
                  src={`https://dogs-strapi.ryzan.co${i?.image?.url}`}
                  alt={i.title}
                  className="w-full h-40 object-cover rounded"
                />
              )}
              <h1 className="text-lg font-bold mt-2">{i.title}</h1>
              <p className="text-sm text-gray-600">{i.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
