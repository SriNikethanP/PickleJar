"use client";

import { useState } from "react";
import { useAuth } from "@lib/context/auth-context";
import Register from "@modules/account/components/register";
import Login from "@modules/account/components/login";

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState(LOGIN_VIEW.SIGN_IN);
  const { user } = useAuth();

  // If user is already logged in, don't render anything
  // The parallel routes will handle showing the dashboard
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
              // The parallel routes will automatically show the dashboard
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
