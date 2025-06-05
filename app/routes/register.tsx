import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { prisma } from "~/db.server";
import { createUserSession, getUser } from "~/session.server";
import bcrypt from "bcryptjs";
import { Button } from "~/components/ui/button";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (user) return redirect("/");
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({ data: { email, passwordHash: hashed } });
    return createUserSession(user.id, "/");
  } catch (err) {
    return json({ error: "User already exists" }, { status: 400 });
  }
}

export default function Register() {
  return (
    <div className="container mx-auto max-w-md space-y-4 p-4">
      <h1 className="text-3xl font-bold">Register</h1>
      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input id="email" name="email" type="email" required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
          <input id="password" name="password" type="password" required className="w-full border p-2 rounded" />
        </div>
        <Button type="submit">Register</Button>
      </Form>
      <p className="text-sm">
        Already have an account? <Link to="/login" className="underline">Login</Link>
      </p>
    </div>
  );
}
