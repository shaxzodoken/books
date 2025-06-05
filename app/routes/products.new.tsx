import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { prisma } from "~/db.server";
import { Button } from "~/components/ui/button";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = String(formData.get("name"));
  const price = parseFloat(String(formData.get("price")));
  const description = formData.get("description") as string | null;
  await prisma.product.create({ data: { name, price, description } });
  return redirect("/products");
}

export default function NewProduct() {
  return (
    <div className="container mx-auto max-w-lg space-y-6 p-4">
      <h1 className="text-3xl font-bold">New Product</h1>
      <Form method="post" className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
          <input id="name" name="name" className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="price">Price</label>
          <input id="price" name="price" type="number" step="0.01" className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
          <textarea id="description" name="description" className="w-full border p-2 rounded" />
        </div>
        <Button type="submit">Create</Button>
      </Form>
    </div>
  );
}
