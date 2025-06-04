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
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild>
          <Link to="/products/new">New Product</Link>
        </Button>
      </div>
      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p.id} className="border p-2 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-gray-500">${p.price.toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to={`/products/${p.id}/edit`}>Edit</Link>
              </Button>
              <Form method="post">
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
