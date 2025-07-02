"use server";
/* eslint-disable jsx-a11y/alt-text */
import Link from "next/link";

export default async function Home() {
  const res = await fetch("http://localhost:1337/api/blogs?populate=*", {
    cache: "no-cache",
  });
  const data = await res.json();
  return (
    <div className="p-8">
      <p className="text-xl text-center">Blogs</p>
      <div className="grid grid-cols-4 gap-2 rounded-md">
        {data?.data?.map((i) => (
          <Link
            href={`/blog/${i.slug}`}
            key={i.id}
            className="border flex justify-center flex-col items-center"
          >
            <img src={`http://localhost:1337${i?.image?.url}`} />
            <h1 className="text-lg">{i.title}</h1>
            <p>{i.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
