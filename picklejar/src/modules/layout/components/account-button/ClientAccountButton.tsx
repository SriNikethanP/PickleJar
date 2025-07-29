"use client";

import { useAuth } from "@lib/context/auth-context";
import { useRouter } from "next/navigation";

export default function ClientAccountButton() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleAccountClick = () => {
    if (user) {
      router.push("/account");
    } else {
      router.push("/account");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="flex items-center space-x-2">
      {user ? (
        <>
          <button
            onClick={handleAccountClick}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="hidden md:block">{user.fullName}</span>
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          onClick={handleAccountClick}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="hidden md:block">Account</span>
        </button>
      )}
    </div>
  );
}
