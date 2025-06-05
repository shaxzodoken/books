import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { Button } from "~/components/ui/button";

export async function loader() {
  const products = await prisma.product.findMany({ orderBy: { id: "desc" } });
  return json({ products });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "delete") {
    const id = Number(formData.get("id"));
    if (id) {
      await prisma.product.delete({ where: { id } });
    }
    return redirect("/products");
  }
  return null;
}

export default function Products() {
  const { products } = useLoaderData<typeof loader>();
  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link to="/products/new">New Product</Link>
        </Button>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <li key={p.id} className="rounded border p-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-1">
              <p className="text-lg font-semibold">{p.name}</p>
              <p className="text-sm text-gray-500">${p.price.toFixed(2)}</p>
              {p.description && <p className="text-sm text-gray-600 dark:text-gray-400">{p.description}</p>}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" asChild>
                <Link to={`/products/${p.id}/edit`}>Edit</Link>
              </Button>
              <Form method="post" className="ml-auto">
                <input type="hidden" name="id" value={p.id} />
                <Button type="submit" name="intent" value="delete" variant="destructive">
                  Delete
                </Button>
              </Form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
