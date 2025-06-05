import { Link } from "@remix-run/react";

export default function Navbar() {
  return (
    <header className="border-b bg-white/60 backdrop-blur-md dark:bg-gray-950/60 sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between py-4">
        <Link to="/" className="text-xl font-bold">E-Shop</Link>
        <ul className="flex gap-4">
          <li>
            <Link to="/products" className="hover:underline">Products</Link>
          </li>
          <li>
            <Link to="/orders" className="hover:underline">Orders</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
