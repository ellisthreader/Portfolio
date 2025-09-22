import React, { useState } from "react";
import axios from "axios";
import { useProfile } from "@/Context/ProfileContext";

export default function ProfileFields() {
  const { user, setUser } = useProfile();

  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [email, setEmail] = useState(user?.email || "");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailConfirm, setEmailConfirm] = useState(false);
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");

  const updateField = async (field: string, value: any) => {
    setUser((prev) => prev ? { ...prev, [field]: value, avatar_url: prev.avatar_url } : prev);

    const formData = new FormData();
    formData.append("name", field === "name" ? value : name);
    formData.append("username", field === "username" ? value : username);
    formData.append("email", field === "email" ? value : email);
    formData.append("phone", field === "phone" ? value : phone);
    formData.append("bio", field === "bio" ? value : bio);

    try {
      const response = await axios.post("/profile/update", formData, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });

      if (response.data?.user) {
        setUser((prev) => ({
          ...prev,
          ...response.data.user,
          avatar_url: response.data.user.avatar_url || prev?.avatar_url,
        }));
      }

      if (field === "username") setUsernameError(null);
      if (field === "email") setEmailError(null);
    } catch (err: any) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        if (errors.username) setUsernameError(errors.username[0]);
        if (errors.email) setEmailError(errors.email[0]);
      }
    }
  };

  return (
    <>
      {/* Full Name */}
      <div>
        <label className="block text-gray-700 dark:text-gray-200 mb-1">Full Name</label>
        <input
          type="text"
          value={name}
          maxLength={255}
          onChange={(e) => setName(e.target.value.replace(/[^A-Za-z\s]/g, ""))}
          onBlur={() => updateField("name", name)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
        />
      </div>

      {/* Username */}
      <div>
        <label className="block text-gray-700 dark:text-gray-200 mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={() => updateField("username", username)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
        />
        {usernameError && <p className="text-red-600 mt-1 text-sm">{usernameError}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-gray-700 dark:text-gray-200 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailConfirm(false);
            setEmailError(null);
          }}
          onBlur={() => {
            if (email.trim() !== user?.email) {
              if (!emailConfirm) {
                if (!window.confirm(`Are you sure you want to change your email to: ${email.trim()}?`)) {
                  setEmail(user?.email || "");
                  return;
                }
                setEmailConfirm(true);
              }
              updateField("email", email.trim());
            }
          }}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
        />
        {emailError && <p className="text-red-600 mt-1 text-sm">{emailError}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-gray-700 dark:text-gray-200 mb-1">Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => updateField("phone", phone)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-gray-700 dark:text-gray-200 mb-1">Bio / About Me</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, 500))}
          onBlur={() => updateField("bio", bio)}
          rows={4}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
        />
        <p className="text-gray-500 text-sm mt-1">{bio.length}/500</p>
      </div>
    </>
  );
}
