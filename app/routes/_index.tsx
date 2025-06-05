import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => [
  { title: "E-Shop" },
  { name: "description", content: "Professional e-commerce platform" },
];

export default function Index() {
  return (
    <section className="flex flex-col items-center gap-8 py-24 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight">Discover Great Books</h1>
      <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300">
        Browse our collection of curated titles and manage your inventory with ease.
      </p>
      <Button asChild size="lg" className="px-6 py-4 text-lg">
        <Link to="/products">Shop Now</Link>
      </Button>
    </section>
  );
}
