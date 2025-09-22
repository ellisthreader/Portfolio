import React, { useState } from "react";
import axios from "axios";
import { useProfile } from "@/Context/ProfileContext";

interface Props {
  updateAvatar?: (url: string) => void;
}

export default function AvatarUpload({ updateAvatar }: Props) {
  const { user, setUser } = useProfile();
  const [loading, setLoading] = useState(false);

  // Upload avatar from local file
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    // send other fields so Laravel validation passes
    formData.append("name", user.name || "");
    formData.append("username", user.username || "");
    formData.append("email", user.email || "");
    formData.append("phone", user.phone || "");
    formData.append("bio", user.bio || "");

    try {
      const res = await axios.post("/profile/update", formData, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });

      const avatarUrl = res.data?.user?.avatar_url;
      if (avatarUrl) {
        setUser((prev) => (prev ? { ...prev, avatar_url: avatarUrl } : prev));
        updateAvatar?.(avatarUrl);
      }
    } catch (err: any) {
      console.error("Failed to upload avatar", err.response?.data || err);
      alert("Failed to upload avatar. Please check your fields.");
    } finally {
      setLoading(false);
    }
  };

  // Generate random avatar via Unsplash
  const handleGenerateRandom = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const res = await axios.post(
        "/profile/generate-avatar",
        {},
        { headers: { "X-Requested-With": "XMLHttpRequest" } }
      );

      const avatarUrl = res.data?.user?.avatar_url;
      if (avatarUrl) {
        setUser((prev) => (prev ? { ...prev, avatar_url: avatarUrl } : prev));
        updateAvatar?.(avatarUrl);
      } else {
        alert(res.data.message || "Failed to generate avatar.");
      }
    } catch (err: any) {
      console.error("Error generating avatar", err.response?.data || err);
      alert(err.response?.data?.message || "Could not generate avatar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-gray-700 dark:text-gray-200 mb-1">
        Profile Picture
      </label>
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          disabled={loading}
          value={undefined} // prevents React warning
          className="block text-sm text-gray-600 dark:text-gray-300"
        />
        <button
          type="button"
          disabled={loading}
          onClick={handleGenerateRandom}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Generate Random
        </button>
      </div>
    </div>
  );
}
