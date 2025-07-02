"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:1337/api/blogs?populate=*");
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
          const blog = i.attributes;
          const imageUrl = blog?.image?.data?.attributes?.url;

          return (
            <Link
              href={`/blog/${blog.slug}`}
              key={i.id}
              className="border rounded-md p-4 flex flex-col items-center hover:shadow transition"
            >
              {imageUrl && (
                <img
                  src={`http://localhost:1337${imageUrl}`}
                  alt={blog.title}
                  className="w-full h-40 object-cover rounded"
                />
              )}
              <h1 className="text-lg font-bold mt-2">{blog.title}</h1>
              <p className="text-sm text-gray-600">{blog.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
