import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { createUserSession, getUser } from "~/session.server";
import bcrypt from "bcryptjs";
import { Button } from "~/components/ui/button";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (user) return redirect("/");
  const url = new URL(request.url);
  return json({ redirectTo: url.searchParams.get("redirectTo") ?? "/" });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const redirectTo = String(formData.get("redirectTo") || "/");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return json({ error: "Invalid credentials" }, { status: 400 });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return json({ error: "Invalid credentials" }, { status: 400 });
  return createUserSession(user.id, redirectTo);
}

export default function Login() {
  const { redirectTo } = useLoaderData<typeof loader>();
  return (
    <div className="container mx-auto max-w-md space-y-4 p-4">
      <h1 className="text-3xl font-bold">Login</h1>
      <Form method="post" className="space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input id="email" name="email" type="email" required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
          <input id="password" name="password" type="password" required className="w-full border p-2 rounded" />
        </div>
        <Button type="submit">Login</Button>
      </Form>
      <p className="text-sm">
        Don&apos;t have an account? <Link to="/register" className="underline">Register</Link>
      </p>
    </div>
  );
}
