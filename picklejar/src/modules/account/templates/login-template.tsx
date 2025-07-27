"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Register from "@modules/account/components/register";
import Login from "@modules/account/components/login";

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState(LOGIN_VIEW.REGISTER);
  const router = useRouter();

  // Handle successful login redirect
  const handleSuccessfulLogin = () => {
    // Redirect to home page
    router.push("/");
  };

  return (
    <div className="w-full flex justify-start px-8 py-8">
      {currentView === LOGIN_VIEW.SIGN_IN ? (
        <Login
          setCurrentView={setCurrentView}
          onSuccessfulLogin={handleSuccessfulLogin}
        />
      ) : (
        <Register setCurrentView={setCurrentView} />
      )}
    </div>
  );
};

export default LoginTemplate;
