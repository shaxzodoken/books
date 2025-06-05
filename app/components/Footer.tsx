export default function Footer() {
  return (
    <footer className="border-t py-8 bg-gray-100 dark:bg-gray-900 text-center">
      <div className="container mx-auto text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} E-Shop. All rights reserved.
      </div>
    </footer>
  );
}
