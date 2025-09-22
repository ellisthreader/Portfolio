import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import NavMenu from "@/Components/Menu/NavMenu";


export default function Login() {
  const [tab, setTab] = useState<"login" | "register" | "forgot">("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Access server-side errors from Inertia
  const { errors: serverErrors } = usePage().props;

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    Inertia.post(
      "/login",
      {
        email: loginEmail,
        password: loginPassword,
      },
      {
        onFinish: () => setLoginLoading(false),
        preserveScroll: true,
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navbar at the top */}
      <NavMenu />

      {/* Main content */}
      <main className="pt-24 flex justify-center">
        <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          {/* Tabs */}
          <div className="flex justify-center mb-6 space-x-2">
            <button
              className={`px-4 py-2 font-semibold rounded-t ${
                tab === "login"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              }`}
              onClick={() => setTab("login")}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 font-semibold rounded-t ${
                tab === "register"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              }`}
              onClick={() => setTab("register")}
            >
              Register
            </button>
            <button
              className={`px-4 py-2 font-semibold rounded-t ${
                tab === "forgot"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              }`}
              onClick={() => setTab("forgot")}
            >
              Forgot Password
            </button>
          </div>

          {/* Login Tab */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>

              {serverErrors?.email && (
                <p className="text-red-500 text-sm">{serverErrors.email}</p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
              >
                {loginLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* Register Tab */}
          {tab === "register" && <Register />}

          {/* Forgot Password Tab */}
          {tab === "forgot" && <ForgotPassword />}
        </div>
      </main>
    </div>
  );
}
