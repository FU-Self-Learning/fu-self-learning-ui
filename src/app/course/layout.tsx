import React from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "My Learning", href: "/course", active: true },
  { label: "Catalog", href: "/catalog" },
  { label: "Favorites", href: "/favorites" },
];

type CourseLayoutProps = {
  children: React.ReactNode;
};

export default function CourseLayout({ children }: CourseLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`text-base font-medium px-2 py-1 rounded transition-colors duration-150 ${
                    item.active
                      ? "text-black border-b-2 border-black"
                      : "text-gray-500 hover:text-black hover:border-b-2 hover:border-black"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
