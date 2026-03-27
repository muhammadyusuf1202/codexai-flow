"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { toast } from "sonner";
import { Target, RefreshCw, FileCode, NotebookPen, Brain, LifeBuoy, Sparkles, MessageSquare, Code2, Globe } from 'lucide-react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, setInput, status } = useChat({
    // Muhim: Agar terminalda xato chiqsa, API yo'li 'api/chat' ekanini tekshiring
    api: '/api/chat',
    onError: (error) => {
      console.error("Chat xatosi:", error);
      toast.error("Xabarni jo'natib bo'lmadi. API kalitni tekshiring.");
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  // O'zgartirilgan tayyor savollar (Suggested Prompts)
  const suggestions = [
    { text: "Next.js da API qanday yaratiladi?", icon: <Code2 className="w-4 h-4 text-green-400" /> },
    { text: "Menga Tailwind CSS haqida gapirib ber", icon: <Sparkles className="w-4 h-4 text-blue-400" /> },
    { text: "O'zbekiston haqida qiziqarli faktlar", icon: <Globe className="w-4 h-4 text-yellow-400" /> },
    { text: "Mantiqiy masalalar tuzib ber", icon: <Brain className="w-4 h-4 text-purple-400" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-[#f0f0f0] font-sans">
      
      {/* HEADER */}
      <header className="flex items-center justify-between p-4 border-b border-[#333] sticky top-0 bg-[#1a1a1a] z-50">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#f1633a]" />
          <span className="text-sm font-medium">CodexAi Flow</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => window.location.reload()} className="text-[#999] hover:text-white transition">
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#333] border border-[#444] flex items-center justify-center text-xs font-bold">
            MY
          </div>
        </div>
      </header>

      {/* CHAT BODY */}
      <main className="flex-1 flex flex-col items-center p-6 md:p-12 pb-44 overflow-y-auto">
        <div className="w-full max-w-3xl flex flex-col gap-10">
          
          {messages.length === 0 ? (
            <div className="flex flex-col items-center">
              <div className="text-center mt-20 mb-12">
                <h1 className="flex items-center justify-center gap-3 text-4xl font-serif text-[#f0f0f0]">
                  <Target className="w-8 h-8 text-[#f1633a]" />
                  Qaytib ayting, 157-maktab
                </h1>
                <p className="text-2xl text-[#999] mt-8">Bugun sizga qanday yordam bera olaman?</p>
              </div>

              {/* Rasmda so'ragan tayyor savollaringiz (Suggetions) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(s.text)}
                    className="flex items-center gap-3 p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl hover:bg-[#333] transition text-sm text-left hover:border-[#f1633a]"
                  >
                    {s.icon}
                    <span>{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-2xl max-w-[85%] ${m.role === 'user' ? 'bg-[#333] border border-[#444]' : 'bg-transparent border border-[#333] text-[#ddd]'}`}>
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* INPUT PANEL */}
      <div className="fixed bottom-0 w-full bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a] to-transparent pb-8 pt-10 px-4 flex justify-center">
        <form 
          onSubmit={(e) => {
            console.log("Jo'natish tugmasi bosildi");
            handleSubmit(e);
          }} 
          className="relative w-full max-w-3xl shadow-2xl"
        >
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const form = e.currentTarget.form;
                if (form) form.requestSubmit();
              }
            }}
            placeholder="MindAI dan biror nima so'rang..."
            className="w-full bg-[#2a2a2a] text-white p-5 pr-16 rounded-2xl border border-[#444] outline-none focus:border-[#f1633a] transition resize-none min-h-[60px]"
            rows={1}
          />
          <button
            type="submit"
            disabled={!input?.trim() || isLoading}
            className="absolute right-3 bottom-3 p-2.5 bg-[#f1633a] text-white rounded-xl hover:bg-[#ff7e5a] transition disabled:opacity-20"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}
