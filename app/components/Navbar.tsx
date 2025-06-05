import { Form, Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
export default function Navbar({ user }: { user: { role: string } | null }) {
  return (
    <header className="border-b bg-white/60 backdrop-blur-md dark:bg-gray-950/60 sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between py-4">
        <Link to="/" className="text-xl font-bold">E-Shop</Link>
        <ul className="flex gap-4 items-center">
          <li>
            <Link to="/products" className="hover:underline">Products</Link>
          </li>
          {user?.role === "ADMIN" && (
            <li>
              <Link to="/products/new" className="hover:underline">New Product</Link>
            </li>
          )}
          {user ? (
            <li>
              <Form method="post" action="/logout">
                <Button variant="ghost" type="submit">
                  Logout
                </Button>
              </Form>
            </li>
          ) : (
            <li>
              <Link to="/login" className="hover:underline">Sign In</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
