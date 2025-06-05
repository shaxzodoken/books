import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { Button } from "~/components/ui/button";

export async function loader() {
  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });
  return json({ products });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const productId = Number(formData.get("productId"));
  const quantity = Number(formData.get("quantity"));
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Response("Product not found", { status: 404 });
  const total = product.price * quantity;
  await prisma.order.create({ data: { productId, quantity, total } });
  return redirect("/orders");
}

export default function NewOrder() {
  const { products } = useLoaderData<typeof loader>();
  return (
    <div className="container mx-auto max-w-lg space-y-6 p-4">
      <h1 className="text-3xl font-bold">New Order</h1>
      <Form method="post" className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="productId">Product</label>
          <select id="productId" name="productId" className="w-full border p-2 rounded" required>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="quantity">Quantity</label>
          <input id="quantity" name="quantity" type="number" min="1" defaultValue="1" className="w-full border p-2 rounded" required />
        </div>
        <Button type="submit">Create</Button>
      </Form>
    </div>
  );
}
