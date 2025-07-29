"use client";

import { useState } from "react";
import { toast } from "sonner";
import Input from "@modules/common/components/input";
import { LOGIN_VIEW } from "@modules/account/templates/login-template";
import { SubmitButton } from "@modules/checkout/components/submit-button";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { useAuth } from "@lib/context/auth-context";

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void;
};

// Validation functions
const validateFullName = (name: string): string | null => {
  if (!name.trim()) return "Full name is required";
  if (name.trim().length < 2) return "Full name must be at least 2 characters";
  if (name.trim().length > 50)
    return "Full name must be less than 50 characters";
  if (!/^[a-zA-Z\s]+$/.test(name.trim()))
    return "Full name can only contain letters and spaces";
  return null;
};

const validateEmail = (email: string): string | null => {
  if (!email.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return null;
};

const validateMobile = (mobile: string): string | null => {
  if (!mobile.trim()) return "Mobile number is required";
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(mobile.replace(/\s/g, "")))
    return "Please enter a valid 10-digit mobile number";
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  if (password.length > 50) return "Password must be less than 50 characters";
  return null;
};

const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
};

const Register = ({ setCurrentView }: Props) => {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate each field
    const fullNameError = validateFullName(formData.full_name);
    if (fullNameError) newErrors.full_name = fullNameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const mobileError = validateMobile(formData.phone);
    if (mobileError) newErrors.phone = mobileError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirm_password
    );
    if (confirmPasswordError) newErrors.confirm_password = confirmPasswordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        fullName: formData.full_name,
        email: formData.email,
        mobile: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirm_password,
      };

      const success = await register(userData);
      if (success) {
        toast.success("Registration successful! Please sign in.");
        // Show success message briefly, then redirect to login
        setTimeout(() => {
          setCurrentView(LOGIN_VIEW.SIGN_IN);
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="max-w-sm flex flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="text-large-semi uppercase mb-6">
        Become a Pickle Jar Member
      </h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-4">
        Create your Pickle Jar Member profile, and get access to an enhanced
        shopping experience.
      </p>
      <form className="w-full flex flex-col" onSubmit={handleSubmit}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Full name"
            name="full_name"
            value={formData.full_name}
            onChange={(e) => handleInputChange("full_name", e.target.value)}
            required
            autoComplete="name"
            data-testid="full-name-input"
            error={errors.full_name}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
            autoComplete="email"
            data-testid="email-input"
            error={errors.email}
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            autoComplete="tel"
            data-testid="phone-input"
            error={errors.phone}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            required
            autoComplete="new-password"
            data-testid="password-input"
            error={errors.password}
          />
          <Input
            label="Confirm Password"
            name="confirm_password"
            type="password"
            value={formData.confirm_password}
            onChange={(e) =>
              handleInputChange("confirm_password", e.target.value)
            }
            required
            autoComplete="new-password"
            data-testid="confirm-password-input"
            error={errors.confirm_password}
          />
        </div>

        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          By creating an account, you agree to Pickle Jar&apos;s{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="underline"
          >
            Privacy Policy
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="underline"
          >
            Terms of Use
          </LocalizedClientLink>
          .
        </span>
        <SubmitButton
          className="w-full mt-6"
          data-testid="register-button"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Join"}
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Already a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
        >
          Sign in
        </button>
        .
      </span>
    </div>
  );
};

export default Register;
