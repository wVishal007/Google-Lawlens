import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scale, Eye, EyeOff, Check, X } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { signupUser } from "../redux/slices/authSlice";

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation
  const passwordRequirements = [
    {
      test: (pwd: string) => pwd.length >= 8,
      message: "At least 8 characters",
    },
    {
      test: (pwd: string) => /[A-Z]/.test(pwd),
      message: "One uppercase letter",
    },
    {
      test: (pwd: string) => /[a-z]/.test(pwd),
      message: "One lowercase letter",
    },
    { test: (pwd: string) => /\d/.test(pwd), message: "One number" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    try {
      await dispatch(
        signupUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          gender: "male", // or from a select input
        })
      ).unwrap();
      navigate('/')
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const allRequirementsMet = passwordRequirements.every((req) =>
    req.test(formData.password)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <Scale className="w-10 h-10 text-black group-hover:scale-110 transition-transform duration-300" />
            <span className="text-3xl font-bold text-black">LawLens</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-black font-medium hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Signup Form */}
        <Card className="mt-8">
          <CardContent className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Input
                label="Full name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <Input
                label="Email address"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />

              <div className="space-y-2">
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Requirements */}
                {formData.password && (
                  <div className="space-y-2 p-3 bg-gray-50 rounded-xl">
                    {passwordRequirements.map((req, index) => {
                      const isValid = req.test(formData.password);
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          {isValid ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <X className="w-4 h-4 text-red-500" />
                          )}
                          <span
                            className={`text-sm ${isValid ? "text-green-700" : "text-red-700"}`}
                          >
                            {req.message}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="relative">
                <Input
                  label="Confirm password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  error={
                    formData.confirmPassword && !passwordsMatch
                      ? "Passwords do not match"
                      : ""
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center">
                <input
                  id="accept-terms"
                  name="accept-terms"
                  type="checkbox"
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  required
                />
                <label
                  htmlFor="accept-terms"
                  className="ml-2 block text-sm text-gray-900"
                >
                  I agree to the{" "}
                  <a href="#" className="text-black hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-black hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isLoading}
                disabled={!allRequirementsMet || !passwordsMatch}
              >
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
