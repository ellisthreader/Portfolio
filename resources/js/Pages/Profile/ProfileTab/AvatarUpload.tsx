import React, { useState, useEffect } from "react";
import axios from "axios";
import { useProfile } from "@/Context/ProfileContext";

interface Props {
  updateAvatar?: (url: string) => void;
}

export default function AvatarUpload({ updateAvatar }: Props) {
  const { user, setUser } = useProfile();
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  /**
   * Always refresh cooldown state from server when component mounts
   */
  useEffect(() => {
    const fetchCooldown = async () => {
      try {
        const res = await axios.get("/profile/edit", {
          headers: { "X-Requested-With": "XMLHttpRequest" },
        });

        if (res.data?.auth?.user) {
          setUser(res.data.auth.user);

          const serverNow = new Date(res.data.auth.user.server_time);
          const cooldownEnd = new Date(res.data.auth.user.cooldown_ends_at);
          const diff = Math.max(
            0,
            Math.floor((cooldownEnd.getTime() - serverNow.getTime()) / 1000)
          );
          setSecondsLeft(diff);

          console.log("[AvatarUpload] Synced cooldown on mount:", {
            diff,
            cooldownEnd,
          });
        }
      } catch (err) {
        console.error("[AvatarUpload] Failed to fetch cooldown", err);
      }
    };

    fetchCooldown();
  }, [setUser]);

  /**
   * Countdown timer
   */
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  /**
   * Upload avatar
   */
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setLoading(true);
    console.log("[AvatarUpload] Upload avatar clicked", { file });

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axios.post("/profile/update", formData, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });

      if (res.data?.user) {
        setUser(res.data.user);
        updateAvatar?.(res.data.user.avatar_url);

        const serverNow = new Date(res.data.user.server_time);
        const cooldownEnd = new Date(res.data.user.cooldown_ends_at);
        const diff = Math.max(
          0,
          Math.floor((cooldownEnd.getTime() - serverNow.getTime()) / 1000)
        );
        setSecondsLeft(diff);

        console.log("[AvatarUpload] Avatar uploaded:", res.data.user);
      }
    } catch (err: any) {
      console.error(
        "[AvatarUpload] Failed to upload avatar",
        err.response?.data || err
      );
      alert("Failed to upload avatar. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate random avatar
   */
  const handleGenerateRandom = async () => {
    if (!user || secondsLeft > 0 || loading) return;

    setLoading(true);
    console.log("[AvatarUpload] Generate random avatar clicked", { secondsLeft });

    try {
      const res = await axios.post(
        "/profile/generate-avatar",
        {},
        {
          headers: { "X-Requested-With": "XMLHttpRequest" },
        }
      );

      if (res.data?.user) {
        setUser(res.data.user);
        updateAvatar?.(res.data.user.avatar_url);

        const serverNow = new Date(res.data.user.server_time);
        const cooldownEnd = new Date(res.data.user.cooldown_ends_at);
        const diff = Math.max(
          0,
          Math.floor((cooldownEnd.getTime() - serverNow.getTime()) / 1000)
        );
        setSecondsLeft(diff);

        console.log("[AvatarUpload] Random avatar generated:", res.data.user);
      }
    } catch (err: any) {
      if (err.response?.status === 429 && err.response.data) {
        console.warn("[AvatarUpload] Cooldown active:", err.response.data);
        if (
          err.response.data.cooldown_ends_at &&
          err.response.data.server_time
        ) {
          const serverNow = new Date(err.response.data.server_time);
          const cooldownEnd = new Date(err.response.data.cooldown_ends_at);
          const diff = Math.max(
            0,
            Math.floor((cooldownEnd.getTime() - serverNow.getTime()) / 1000)
          );
          setSecondsLeft(diff);
        }
        alert(err.response.data.message || "Please wait before generating again.");
      } else {
        console.error(
          "[AvatarUpload] Failed to generate random avatar",
          err.response?.data || err
        );
        alert(err.response?.data?.message || "Could not generate avatar.");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format seconds into mm:ss
   */
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mb-6">
      <label className="block text-gray-700 dark:text-gray-200 mb-2 text-sm font-medium">
        Profile Picture
      </label>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Upload button */}
        <label className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm font-medium">
          <span className="text-gray-700 dark:text-gray-200">Upload Picture</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={loading}
            className="hidden"
          />
        </label>

        {/* Generate Random button */}
        <button
          type="button"
          disabled={loading || secondsLeft > 0}
          onClick={handleGenerateRandom}
          className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition ${
            secondsLeft > 0
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {secondsLeft > 0
            ? `Try again in ${formatTime(secondsLeft)}`
            : "Generate Random"}
        </button>
      </div>
    </div>
  );
}
