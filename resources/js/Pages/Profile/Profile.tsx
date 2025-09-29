import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import axios from "axios";
import { ProfileProvider, useProfile } from "@/Context/ProfileContext";
import AvatarUpload from "./ProfileTab/AvatarUpload";
import ProfileFields from "./ProfileTab/ProfileFields";
import OrdersTab from "./OrdersTab";
import SettingsTab from "./SettingsTab";
import { getAvatarSrc } from "@/Utils/avatar";
import { Transition } from "@headlessui/react";

function Sidebar({
  activeTab,
  setActiveTab,
  avatarUrl,
  setZoomImage,
  handleLogout,
}: any) {
  const { user, setUser } = useProfile();
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  // --- Fetch server cooldown ---
  useEffect(() => {
    const fetchCooldown = async () => {
      if (!user) return;
      try {
        const res = await axios.get("/profile/edit", {
          headers: { "X-Requested-With": "XMLHttpRequest" },
        });

        if (res.data?.auth?.user) {
          setUser(res.data.auth.user);

          const serverNow = new Date(res.data.auth.user.server_time);
          const cooldownEnd = new Date(
            res.data.auth.user.email_verification_cooldown_ends_at
          );

          setSecondsLeft(
            Math.ceil(Math.max(0, (cooldownEnd.getTime() - serverNow.getTime()) / 1000))
          );
        }
      } catch (err) {
        console.error("[Sidebar] Failed to fetch cooldown", err);
      }
    };

    fetchCooldown();
  }, [setUser, user]);

  // --- Countdown timer ---
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(
      () => setSecondsLeft((prev) => Math.max(Math.ceil(prev - 1), 0)),
      1000
    );
    return () => clearInterval(interval);
  }, [secondsLeft]);

  // --- Resend verification ---
  const handleResend = async () => {
    if (!user || secondsLeft > 0) return;

    try {
      await axios.post("/email/verification-notification");
      setSecondsLeft(60); // start 1-min cooldown
    } catch (err: any) {
      if (err.response?.status === 429) {
        const remaining = err.response.data?.remaining_seconds
          ? Math.ceil(err.response.data.remaining_seconds)
          : 60;
        setSecondsLeft(remaining);
        console.warn(err.response.data.message);
      } else {
        console.error("[Sidebar] Resend verification failed", err);
      }
    }
  };

  return (
    <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 pr-6 flex flex-col items-center">
      {/* Avatar */}
      <div
        className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer"
        onClick={() => avatarUrl && setZoomImage(avatarUrl)}
      >
        <img
          src={getAvatarSrc(avatarUrl)}
          alt={user?.username || "Avatar"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* User Info */}
      <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
        {user?.name || "Anonymous"}
      </h2>
      <p className="text-gray-600 dark:text-gray-400">@{user?.username || "unknown"}</p>
      <p className="text-gray-500 dark:text-gray-400 mt-1">
        Joined: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
      </p>

      {/* Account Verified Badge or Resend */}
      {user && user.email_verified_at ? (
        <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          ✅ Account Verified
        </div>
      ) : (
        <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          ⚠️ Not Verified
          <button
            onClick={handleResend}
            disabled={secondsLeft > 0}
            className={`ml-2 underline font-medium ${
              secondsLeft > 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {secondsLeft > 0 ? `Sent (${secondsLeft}s)` : "Resend"}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="mt-8 w-full">
        {["profile", "orders", "settings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium capitalize mb-2 transition ${
              activeTab === tab
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="mt-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
      >
        Log Out
      </button>
    </div>
  );
}

export default function Profile() {
  const { auth, flash } = usePage().props as any;
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "settings">("profile");
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    auth.user?.avatar_url || auth.user?.avatar || null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(flash?.success || null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogout = () => Inertia.post("/logout");

  // Keep avatar in sync
  useEffect(() => {
    setAvatarUrl(auth.user?.avatar_url || auth.user?.avatar || null);
  }, [auth.user?.avatar_url, auth.user?.avatar]);

  // Auto-clear notifications
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage, errorMessage]);

  if (!auth.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md text-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            You are not logged in.
          </h1>
        </div>
      </div>
    );
  }

  return (
    <ProfileProvider initialUser={auth.user}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-6">
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex gap-8">
          {/* LEFT */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            avatarUrl={avatarUrl}
            setZoomImage={setZoomImage}
            handleLogout={handleLogout}
          />

          {/* RIGHT */}
          <div className="flex-1 pl-6 space-y-6">
            {/* Notifications */}
            <Transition
              as="div"
              show={!!successMessage || !!errorMessage}
              enter="transition ease-out duration-300 transform"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition-opacity duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                className={`mb-4 px-4 py-2 rounded-md ${
                  successMessage ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {successMessage || errorMessage}
              </div>
            </Transition>

            {activeTab === "profile" && (
              <>
                <AvatarUpload
                  updateAvatar={setAvatarUrl}
                  setSuccessMessage={setSuccessMessage}
                  setErrorMessage={setErrorMessage}
                />
                <ProfileFields
                  setSuccessMessage={setSuccessMessage}
                  setErrorMessage={setErrorMessage}
                />
              </>
            )}
            {activeTab === "orders" && <OrdersTab auth={auth} />}
            {activeTab === "settings" && <SettingsTab auth={auth} />}
          </div>
        </div>

        {/* Zoom Modal */}
        {zoomImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 cursor-zoom-out"
            onClick={() => setZoomImage(null)}
          >
            <img
              src={getAvatarSrc(zoomImage)}
              alt="zoomed avatar"
              className="max-h-[80vh] max-w-[80vw] rounded-md"
            />
          </div>
        )}
      </div>
    </ProfileProvider>
  );
}
