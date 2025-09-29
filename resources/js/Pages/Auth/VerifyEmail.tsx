import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Transition } from "@headlessui/react";

export default function VerifyEmail() {
  const [message, setMessage] = useState<string | null>(null);
  const [isCooldown, setIsCooldown] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // Optional: countdown timer for cooldown display
  useEffect(() => {
    if (!isCooldown || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsCooldown(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCooldown, remainingSeconds]);

  const handleResend = () => {
    if (isCooldown) return;

    Inertia.post(
      "/email/verification-notification",
      {},
      {
        onSuccess: (response: any) => {
          setMessage("Verification link sent! Please check your inbox.");
          setIsCooldown(true);

          // Start cooldown counter (assumes 60 seconds)
          setRemainingSeconds(60);
        },
        onError: (errors: any) => {
          // Handle throttle 429 errors gracefully
          if (errors?.response?.status === 429) {
            setMessage("Please wait before resending.");
            setIsCooldown(true);

            // Optional: parse remaining_seconds from backend
            const remaining = errors?.response?.data?.remaining_seconds ?? 60;
            setRemainingSeconds(remaining);
          } else {
            setMessage("Something went wrong. Please try again.");
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center max-w-md w-full relative">
        <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Verify Your Email
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Thanks for signing up! Please check your email to verify your account.
        </p>

        {/* Resend button */}
        <button
          onClick={handleResend}
          disabled={isCooldown}
          className={`px-4 py-2 rounded-md text-white font-medium transition ${
            isCooldown
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isCooldown ? `Sent (${remainingSeconds}s)` : "Resend Verification Email"}
        </button>

        {/* Success / Error message with smooth animation */}
        <Transition
          show={!!message}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-500"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <div className="mt-4 text-green-600 dark:text-green-400 font-medium">
            {message}
          </div>
        </Transition>
      </div>
    </div>
  );
}
