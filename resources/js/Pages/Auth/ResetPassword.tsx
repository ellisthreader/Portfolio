import React, { useState, useEffect } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";

export default function ResetPassword() {
  // Extract token from path
  const pathParts = window.location.pathname.split("/");
  const token = pathParts[pathParts.length - 1];

  // Extract email from query string
  const query = new URLSearchParams(window.location.search);
  const email = query.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [status, setStatus] = useState<string | null>(null);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  }, [password]);

  if (!token || !email) {
    return (
      <div className="text-red-500 p-4 text-center">
        Invalid or expired link.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!passwordCriteria.length)
      newErrors.passwordLength = "At least 8 characters required.";
    if (!passwordCriteria.uppercase)
      newErrors.passwordUppercase = "Must contain uppercase letter.";
    if (!passwordCriteria.number)
      newErrors.passwordNumber = "Must contain a number.";
    if (!passwordCriteria.special)
      newErrors.passwordSpecial = "Must contain a special character.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      setStatus("Password reset successfully! Redirecting to login...");
      setErrors({});

      // Redirect with Inertia after 2s
      setTimeout(() => {
        router.visit("/login");
      }, 2000);
    } catch (err: any) {
      setErrors({
        general:
          err.response?.data?.errors?.email?.[0] || "Invalid or expired link.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Reset Password
        </h2>

        {status && (
          <div className="bg-green-100 text-green-800 px-4 py-3 rounded mb-4 flex items-center justify-center">
            <span className="mr-2">✅</span>
            {status}
          </div>
        )}

        {errors.general && (
          <div className="bg-red-100 text-red-800 px-4 py-3 rounded mb-4 text-center">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>

          <ul className="text-sm text-gray-500 dark:text-gray-300 mb-2">
            <li className={passwordCriteria.length ? "text-green-600" : ""}>
              • At least 8 characters
            </li>
            <li className={passwordCriteria.uppercase ? "text-green-600" : ""}>
              • Contains uppercase letter
            </li>
            <li className={passwordCriteria.number ? "text-green-600" : ""}>
              • Contains a number
            </li>
            <li className={passwordCriteria.special ? "text-green-600" : ""}>
              • Contains special character
            </li>
          </ul>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
