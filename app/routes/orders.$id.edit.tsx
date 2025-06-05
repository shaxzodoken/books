import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { Button } from "~/components/ui/button";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = Number(params.id);
  const order = await prisma.order.findUnique({
    where: { id },
    include: { product: true },
  });
  if (!order) throw new Response("Not Found", { status: 404 });
  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });
  return json({ order, products });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const id = Number(params.id);
  const formData = await request.formData();
  const productId = Number(formData.get("productId"));
  const quantity = Number(formData.get("quantity"));
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Response("Product not found", { status: 404 });
  const total = product.price * quantity;
  await prisma.order.update({ where: { id }, data: { productId, quantity, total } });
  return redirect("/orders");
}

export default function EditOrder() {
  const { order, products } = useLoaderData<typeof loader>();
  return (
    <div className="container mx-auto max-w-lg space-y-6 p-4">
      <h1 className="text-3xl font-bold">Edit Order</h1>
      <Form method="post" className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="productId">Product</label>
          <select id="productId" name="productId" defaultValue={order.productId} className="w-full border p-2 rounded" required>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="quantity">Quantity</label>
          <input id="quantity" name="quantity" type="number" min="1" defaultValue={order.quantity} className="w-full border p-2 rounded" required />
        </div>
        <Button type="submit">Update</Button>
      </Form>
    </div>
  );
}

