"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils";

import { MaterialSymbol } from "@/components/ui/material-symbol";
type Message = {
  id: string; body: string; createdAt: string; type: string;
  sender?: { id: string; name: string; image?: string };
};
export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get current user
    fetch("/api/v1/profile").then(r => r.json()).then(d => setCurrentUserId(d?.userId ?? ""));
    // Load messages
    fetch(`/api/v1/messages/${conversationId}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
      });
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/v1/messages/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, body: body.trim() }),
      });
      if (res.ok) {
        const newMsg = await res.json();
        setMessages(prev => [...prev, newMsg]);
        setBody("");
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-screen pt-16">
      {/* Header */}
      <div className="flex items-center gap-3 px-gutter py-3 bg-surface-pure border-b border-surface-container-high shadow-sm flex-shrink-0">
        <button onClick={() => router.push("/messages")} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
          <MaterialSymbol icon="arrow_back" className="text-[22px] text-on-surface-variant" />
        </button>
        <Avatar name="Conversation" size="sm" />
        <div className="flex-1 min-w-0">
          <p className="font-title-md text-title-md text-navy-deep font-semibold truncate">Conversation</p>
        </div>
        <Link href={`/messages/${conversationId}/details`} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
          <MaterialSymbol icon="info" className="text-[22px] text-on-surface-variant" />
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-gutter py-space-lg space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MaterialSymbol icon="chat" className="text-[48px] text-on-surface-variant mb-3" />
            <p className="font-body-lg text-body-lg text-on-surface-variant">No messages yet. Say hello!</p>
          </div>
        )}
        {messages.map(msg => {
          const isOwn = msg.sender?.id === currentUserId;
          if (msg.type === "SYSTEM") {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="px-3 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant">{msg.body}</span>
              </div>
            );
          }
          return (
            <div key={msg.id} className={`flex gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>
              {!isOwn && <Avatar name={msg.sender?.name} size="sm" className="flex-shrink-0 mt-auto" />}
              <div className={`max-w-xs lg:max-w-md ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                {!isOwn && <span className="font-label-sm text-label-sm text-on-surface-variant ml-1">{msg.sender?.name}</span>}
                <div className={`px-4 py-2.5 rounded-2xl font-body-md text-body-md break-words ${isOwn ? "bg-navy-deep text-on-primary rounded-br-md" : "bg-surface-pure shadow-sm text-on-surface rounded-bl-md"}`}>
                  {msg.body}
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant mx-1">{formatRelativeTime(msg.createdAt)}</span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-gutter py-3 bg-surface-pure border-t border-surface-container-high">
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 h-11 px-4 rounded-full bg-surface-subtle text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-teal-accent/40 transition-all"
          />
          <button
            type="submit"
            disabled={!body.trim() || sending}
            className="w-11 h-11 rounded-full bg-navy-deep flex items-center justify-center text-on-primary shadow-sm hover:bg-on-primary-fixed transition-all disabled:opacity-50"
          >
            {sending
              ? <MaterialSymbol icon="progress_activity" className="text-[18px] animate-spin" />
              : <MaterialSymbol icon="send" className="text-[18px]" />
            }
          </button>
        </form>
      </div>
    </div>
  );
}
