import React, { useState } from "react";
import axios from "axios";

export default function PasswordUpdate() {
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handlePasswordUpdate = async () => {
    setPasswordLoading(true);
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage("❌ Passwords do not match.");
      setPasswordLoading(false);
      return;
    }

    try {
      await axios.put("/user/password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      setPasswordMessage("✅ Password updated successfully!");
      setEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors.current_password) {
          setPasswordMessage("❌ Current password is incorrect.");
        } else {
          setPasswordMessage("❌ Failed to update password. Please check your details.");
        }
      } else {
        setPasswordMessage("❌ Failed to update password. Please try again.");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div>
      <label className="block text-gray-700 dark:text-gray-200 mb-1">Password</label>
      {!editingPassword ? (
        <div className="flex items-center justify-between w-full border rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-100">
          <span>********</span>
          <button
            type="button"
            onClick={() => setEditingPassword(true)}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditingPassword(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePasswordUpdate}
              disabled={passwordLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {passwordLoading ? "Saving..." : "Save"}
            </button>
          </div>
          {passwordMessage && (
            <p className="text-sm mt-1 text-green-600 dark:text-green-400">
              {passwordMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
