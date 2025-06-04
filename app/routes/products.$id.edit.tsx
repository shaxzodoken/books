import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { Button } from "~/components/ui/button";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = Number(params.id);
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Response("Not Found", { status: 404 });
  return json({ product });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const id = Number(params.id);
  const formData = await request.formData();
  const name = String(formData.get("name"));
  const price = parseFloat(String(formData.get("price")));
  const description = formData.get("description") as string | null;
  await prisma.product.update({ where: { id }, data: { name, price, description } });
  return redirect("/products");
}

export default function EditProduct() {
  const { product } = useLoaderData<typeof loader>();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <Form method="post" className="space-y-4 max-w-sm">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
          <input id="name" name="name" defaultValue={product.name} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="price">Price</label>
          <input id="price" name="price" type="number" step="0.01" defaultValue={product.price} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
          <textarea id="description" name="description" defaultValue={product.description ?? ''} className="w-full border p-2 rounded" />
        </div>
        <Button type="submit">Update</Button>
      </Form>
    </div>
  );
}
