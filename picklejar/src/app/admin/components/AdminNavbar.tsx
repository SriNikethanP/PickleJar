"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@lib/context/admin-auth-context";
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  Truck,
  Home,
  FolderOpen,
  Tag,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: Users,
  },
  {
    href: "/admin/inventory",
    label: "Inventory",
    icon: Package,
  },
  {
    href: "/admin/collections",
    label: "Collections",
    icon: FolderOpen,
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: Tag,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ShoppingCart,
  },
  {
    href: "/admin/payments",
    label: "Payments",
    icon: CreditCard,
  },
  // {
  //   href: "/admin/shipping",
  //   label: "Shipping",
  //   icon: Truck,
  // },
];

export function AdminNavbar() {
  const pathname = usePathname();
  const { admin, logout } = useAdminAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and brand */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Admin Portal
            </h1>
          </div>

          {/* Desktop nav */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive
                      ? "border-indigo-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:inline-flex justify-end ml-4 items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>

          {/* Hamburger for mobile */}
          <button
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Open main menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-gray-200 px-2 pt-2 pb-3 space-y-1 z-50 shadow-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700 mt-2"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
