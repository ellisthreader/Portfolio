import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { MessageSquare } from "lucide-react";

interface ChatMessage {
  sender: string;
  content: string;
  chatId: number;
  timestamp: string;
}

export default function AdminDashboard({ auth }: any) {
  const user = auth?.user;
  const [latestMessages, setLatestMessages] = useState<ChatMessage[]>([]);
  const [activeChats, setActiveChats] = useState<number>(0);

  const fetchInitialMessages = async () => {
    try {
      const res = await fetch("/api/chat");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const messages: ChatMessage[] = (data.messages || []).map((m: any) => ({
        sender: m.user?.name ?? "Guest",
        content: m.content,
        chatId: m.chat_id,
        timestamp: new Date(m.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setLatestMessages(messages.slice(-10).reverse());
      setActiveChats(messages.length);
    } catch (err) {
      console.error("❌ Failed to fetch initial messages:", err);
    }
  };

  useEffect(() => {
    fetchInitialMessages();

    const Echo = (window as any).Echo;
    if (!Echo) {
      console.warn("⚠️ Laravel Echo not initialized yet.");
      return;
    }

    const channel = Echo.private("admin.livechats");

    const handleBroadcast = (event: any) => {
      const newMessage: ChatMessage = {
        sender: event.from,
        content: event.message,
        chatId: event.chatId,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setLatestMessages((prev) => [newMessage, ...prev].slice(0, 10));
      setActiveChats((prev) => prev + 1);
    };

    channel.listen(".AdminChatBroadcast", handleBroadcast);

    return () => {
      channel.stopListening(".AdminChatBroadcast", handleBroadcast);
    };
  }, []);

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-10 transition-colors duration-500">
        
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Welcome back,{" "}
            <span className="font-semibold">
              {user?.name ?? "Admin"}
            </span>{" "}
            👋
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">1,523</h2>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Chats</p>
            <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              {activeChats}
            </h2>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">New Orders</p>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">32</h2>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">System Health</p>
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">99%</h2>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Live Chats ({activeChats})
            </h2>
            <MessageSquare className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Real-time updates from ongoing user chats.
          </p>

          <div className="max-h-60 overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-4">
            {latestMessages.length > 0 ? (
              latestMessages.map((msg, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-2 last:border-none last:mb-0"
                >
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {msg.sender}{" "}
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                      (Chat #{msg.chatId})
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{msg.content}</p>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{msg.timestamp}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No active chats yet.</p>
            )}
          </div>

          <a
            href="/admin/livechats"
            className="inline-block text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Open Live Chat Manager
          </a>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
