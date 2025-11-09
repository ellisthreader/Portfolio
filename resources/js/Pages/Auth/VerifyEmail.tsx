import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Transition } from "@headlessui/react";

export default function VerifyEmail() {
  const [message, setMessage] = useState<string | null>(null);
  const [isCooldown, setIsCooldown] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // Countdown timer for resend cooldown
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

  // Handle resend verification link
  const handleResend = () => {
    if (isCooldown) return;

    router.post(
      "/email/verification-notification",
      {},
      {
        onSuccess: () => {
          setMessage("✅ Verification link sent! Please check your inbox.");
          setIsCooldown(true);
          setRemainingSeconds(60); // 1-minute cooldown
        },
        onError: (errors: any) => {
          if (errors?.response?.status === 429) {
            // Throttle protection
            setMessage("⏳ Please wait before resending another email.");
            setIsCooldown(true);

            const remaining = errors?.response?.data?.remaining_seconds ?? 60;
            setRemainingSeconds(remaining);
          } else {
            setMessage("⚠️ Something went wrong. Please try again later.");
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
          Thanks for signing up! Please check your email inbox and verify your account to continue.
        </p>

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

        {/* Animated feedback message */}
        <Transition
          show={!!message}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-500"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <div
            className={`mt-4 font-medium ${
              message?.includes("✅")
                ? "text-green-600 dark:text-green-400"
                : "text-yellow-600 dark:text-yellow-400"
            }`}
          >
            {message}
          </div>
        </Transition>
      </div>
    </div>
  );
}
