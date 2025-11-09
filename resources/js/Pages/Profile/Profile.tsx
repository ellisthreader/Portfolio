import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import axios from "axios";
import { ProfileProvider, useProfile } from "@/Context/ProfileContext";
import AvatarUpload from "./ProfileTab/AvatarUpload";
import ProfileFields from "./ProfileTab/ProfileFields";
import OrdersTab from "./OrdersTab";
import SettingsTab from "./SettingsTab";
import { getAvatarSrc } from "@/Utils/avatar";
import { toast } from "react-toastify";

// ---------------- Sidebar Component ----------------
function Sidebar({
  activeTab,
  setActiveTab,
  avatarUrl,
  setZoomImage,
  handleLogout,
}: any) {
  const { user, setUser } = useProfile();
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  // Fetch email verification cooldown
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

  // Handle countdown timer for resend cooldown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(
      () => setSecondsLeft((prev) => Math.max(Math.ceil(prev - 1), 0)),
      1000
    );
    return () => clearInterval(interval);
  }, [secondsLeft]);

  // Handle resend verification email using Inertia router
  const handleResend = () => {
    if (!user || secondsLeft > 0) return;

    router.post(
      "/email/verification-notification",
      {},
      {
        onSuccess: () => {
          setSecondsLeft(60);
          toast.success("Verification email sent!", {
            position: "top-center",
            autoClose: 3000,
          });
        },
        onError: (errors: any) => {
          if (errors?.response?.status === 429) {
            const remaining = errors?.response?.data?.remaining_seconds
              ? Math.ceil(errors.response.data.remaining_seconds)
              : 60;
            setSecondsLeft(remaining);
            toast.error(errors?.response?.data?.message || "Please wait before resending.", {
              position: "top-center",
              autoClose: 3000,
            });
          } else {
            toast.error("Failed to send verification email.", {
              position: "top-center",
              autoClose: 3000,
            });
          }
        },
      }
    );
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

      <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
        {user?.name || "Anonymous"}
      </h2>
      <p className="text-gray-600 dark:text-gray-400">@{user?.username || "unknown"}</p>
      <p className="text-gray-500 dark:text-gray-400 mt-1">
        Joined: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
      </p>

      {/* Email Verification */}
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

      {/* Sidebar Tabs */}
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

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
      >
        Log Out
      </button>
    </div>
  );
}

// ---------------- Main Profile Page ----------------
export default function Profile() {
  const { auth } = usePage().props as any;
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "settings">("profile");
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    auth.user?.avatar_url || auth.user?.avatar || null
  );

  // ✅ Replaced Inertia.post with router.post
  const handleLogout = () => router.post("/logout");

  // Auto-open tab based on ?tab=orders etc.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam === "orders" || tabParam === "settings" || tabParam === "profile") {
      setActiveTab(tabParam as any);
    }
  }, []);

  // Keep avatar updated
  useEffect(() => {
    setAvatarUrl(auth.user?.avatar_url || auth.user?.avatar || null);
  }, [auth.user?.avatar_url, auth.user?.avatar]);

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
          {/* LEFT: Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            avatarUrl={avatarUrl}
            setZoomImage={setZoomImage}
            handleLogout={handleLogout}
          />

          {/* RIGHT: Main content */}
          <div className="flex-1 pl-6 space-y-6">
            {activeTab === "profile" && (
              <>
                <AvatarUpload updateAvatar={setAvatarUrl} />
                <ProfileFields
                  notify={(type: "success" | "error", message: string) =>
                    toast[type](message, { position: "top-center", autoClose: 3000 })
                  }
                />
              </>
            )}
            {activeTab === "orders" && <OrdersTab auth={auth} />}
            {activeTab === "settings" && <SettingsTab auth={auth} />}
          </div>
        </div>

        {/* Zoomed Avatar Overlay */}
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
