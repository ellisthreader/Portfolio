import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    console.log("Sending email:", email); // debug

    try {
      // Get CSRF token from meta tag
      const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

      await axios.post(
        "/forgot-password",
        { email },
        {
          headers: {
            "X-CSRF-TOKEN": token || "",
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );

      setSent(true);
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.errors?.email?.[0] || "Something went wrong";
      setErrors(errorMessage);
    }
  };

  if (sent) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md text-center">
        <div className="text-green-500 text-4xl mb-4">✔️</div>
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Reset Link Sent!</h2>
        <p className="text-gray-700 dark:text-gray-300">
          If the email exists, a password reset link has been sent to it.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Forgot Password</h2>

      {errors && (
        <p className="text-red-500 mb-2 dark:text-red-400">{errors}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
          required
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
