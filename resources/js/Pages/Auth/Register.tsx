import React, { useState, useEffect } from "react";
import axios from "axios";
import { Inertia } from "@inertiajs/inertia";
import confetti from "canvas-confetti";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupErrors, setSignupErrors] = useState<any>({});
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const [signupLoading, setSignupLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false); // Prevent double POST

  const passwordRequirements = [
    { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
    { label: "Contains uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
    { label: "Contains number", test: (pw: string) => /\d/.test(pw) },
    { label: "Contains special character", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
  ];

  // --------------------------
  // Username validation & check
  // --------------------------
  useEffect(() => {
    if (!username) {
      setUsernameSuggestions([]);
      setSignupErrors((prev: any) => ({ ...prev, username: undefined }));
      return;
    }

    if (username.length > 20) {
      setSignupErrors((prev: any) => ({
        ...prev,
        username: "Username must be 20 characters or less.",
      }));
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setSignupErrors((prev: any) => ({
        ...prev,
        username: "Only letters, numbers, and underscores are allowed.",
      }));
      return;
    }

    const timeout = setTimeout(() => {
      axios
        .get("/check-username", { params: { username } })
        .then((res) => {
          if (res.data.exists) {
            setSignupErrors((prev: any) => ({
              ...prev,
              username: "Username already taken.",
            }));
            setUsernameSuggestions(res.data.suggestions || []);
          } else {
            setSignupErrors((prev: any) => ({ ...prev, username: undefined }));
            setUsernameSuggestions([]);
          }
        })
        .catch(() => {
          setSignupErrors((prev: any) => ({
            ...prev,
            username: "Error checking username.",
          }));
        });
    }, 500);

    return () => clearTimeout(timeout);
  }, [username]);

  // --------------------------
  // Email validation & check
  // --------------------------
  useEffect(() => {
    if (!email) return;

    const timeout = setTimeout(() => {
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        setSignupErrors((prev: any) => ({ ...prev, email: "Invalid email address." }));
        return;
      }

      axios
        .get("/check-email", { params: { email } })
        .then((res) => {
          if (res.data.exists) {
            setSignupErrors((prev: any) => ({
              ...prev,
              email: "This email is already registered.",
            }));
          } else {
            setSignupErrors((prev: any) => ({ ...prev, email: undefined }));
          }
        })
        .catch(() => {
          setSignupErrors((prev: any) => ({
            ...prev,
            email: "Error checking email.",
          }));
        });
    }, 500);

    return () => clearTimeout(timeout);
  }, [email]);

  // --------------------------
  // Confirm password check
  // --------------------------
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setSignupErrors((prev: any) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
    } else {
      setSignupErrors((prev: any) => {
        const { confirmPassword, ...rest } = prev;
        return rest;
      });
    }
  }, [password, confirmPassword]);

  // --------------------------
  // Handle signup
  // --------------------------
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasSubmitted) return;

    setHasSubmitted(true);
    setSignupLoading(true);

    // Client-side validation
    const errors: any = {};
    if (!username) errors.username = "Username is required.";
    if (!email) errors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Invalid email address.";
    if (!password) errors.password = "Password is required.";
    if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";

    const unmet = passwordRequirements.filter((r) => !r.test(password));
    if (unmet.length > 0) errors.password = "Password does not meet all requirements.";

    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
      setSignupLoading(false);
      setHasSubmitted(false);
      return;
    }

    setSignupErrors({});

    try {
      const response = await axios.post("/register", {
        username,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      setSuccess(true);

      // Confetti
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

      // Redirect to profile edit
      setTimeout(() => Inertia.visit("/profile/edit"), 3000);
    } catch (err: any) {
      const backendErrors = err.response?.data?.errors || {};
      setSignupErrors(backendErrors);
      setHasSubmitted(false);
    } finally {
      setSignupLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            🎉 Account Created! 🎉
          </h2>
          <p className="text-gray-700 dark:text-gray-200 mb-4">
            Your account has been created.
          </p>
          <button
            onClick={() => Inertia.visit("/profile/edit")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      {/* Username */}
      <div>
        <label className="block text-gray-700 dark:text-gray-200 mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={20}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
        />
        {signupErrors.username && (
          <p className="text-red-500 text-sm mt-1">{signupErrors.username}</p>
        )}
        {usernameSuggestions.length > 0 && (
          <p className="text-gray-500 text-sm mt-1">
            Suggestions: {usernameSuggestions.join(", ")}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-gray-700 dark:text-gray-200 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
        />
        {signupErrors.email && <p className="text-red-500 text-sm mt-1">{signupErrors.email}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="block text-gray-700 dark:text-gray-200 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
        />
        {signupErrors.password && (
          <p className="text-red-500 text-sm mt-1">{signupErrors.password}</p>
        )}
        <ul className="mt-2 text-sm">
          {passwordRequirements.map((req) => (
            <li
              key={req.label}
              className={req.test(password) ? "text-green-600" : "text-gray-500"}
            >
              • {req.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-gray-700 dark:text-gray-200 mb-1">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
        />
        {signupErrors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{signupErrors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={signupLoading || hasSubmitted}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
      >
        {signupLoading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}
