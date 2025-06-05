import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { Button } from "~/components/ui/button";

export async function loader() {
  const orders = await prisma.order.findMany({
    orderBy: { id: "desc" },
    include: { product: true },
  });
  return json({ orders });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "delete") {
    const id = Number(formData.get("id"));
    if (id) {
      await prisma.order.delete({ where: { id } });
    }
    return redirect("/orders");
  }
  return null;
}

export default function Orders() {
  const { orders } = useLoaderData<typeof loader>();
  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Button asChild>
          <Link to="/orders/new">New Order</Link>
        </Button>
      </div>
      <ul className="grid gap-4">
        {orders.map((o) => (
          <li key={o.id} className="rounded border p-4 shadow-sm flex flex-col gap-2">
            <p className="font-semibold">{o.product.name}</p>
            <p className="text-sm text-gray-500">Quantity: {o.quantity}</p>
            <p className="text-sm text-gray-500">Total: ${o.total.toFixed(2)}</p>
            <div className="mt-2 flex gap-2">
              <Button variant="outline" asChild>
                <Link to={`/orders/${o.id}/edit`}>Edit</Link>
              </Button>
              <Form method="post" className="ml-auto">
                <input type="hidden" name="id" value={o.id} />
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
