import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [canSubmit, setCanSubmit] = useState(false);

  // Validate inputs live
  useEffect(() => {
    const newErrors = { name: "", email: "", password: "", confirmPassword: "" };

    // Username validation
    if (name.length < 3) newErrors.name = "Username must be at least 3 characters.";

    // Email validation (simple regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = "Invalid email address.";

    // Password strength
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number.";
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one symbol.";
    }

    // Confirm password
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);

    // Button enabled if no errors
    const hasErrors = Object.values(newErrors).some((e) => e !== "");
    setCanSubmit(!hasErrors);
  }, [name, email, password, confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    Inertia.post("/register", {
      name,
      email,
      password,
      password_confirmation: confirmPassword,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Sign Up</h2>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700 dark:text-gray-200">Username</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 rounded border"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700 dark:text-gray-200">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded border"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700 dark:text-gray-200">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 rounded border"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700 dark:text-gray-200">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 rounded border"
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className={`w-full py-2 rounded bg-blue-600 text-white font-semibold ${!canSubmit ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
      >
        Sign Up
      </button>
    </form>
  );
}
