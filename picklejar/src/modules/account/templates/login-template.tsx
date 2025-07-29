"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@lib/context/auth-context";
import Register from "@modules/account/components/register";
import Login from "@modules/account/components/login";

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState(LOGIN_VIEW.SIGN_IN);
  const router = useRouter();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  // If user is already logged in, don't render anything
  if (user) {
    return null;
  }

  return (
    <div className="w-full flex justify-center items-center py-12">
      <div className="max-w-sm w-full">
        {currentView === LOGIN_VIEW.SIGN_IN ? (
          <Login
            setCurrentView={setCurrentView}
            onSuccessfulLogin={() => {
              // The useEffect above will handle the redirect
            }}
          />
        ) : (
          <Register setCurrentView={setCurrentView} />
        )}
      </div>
    </div>
  );
};

export default LoginTemplate;
