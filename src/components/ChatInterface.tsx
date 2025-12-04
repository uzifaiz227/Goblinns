"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Upload, Loader2, Bot, User, Image as ImageIcon, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

import { CategoryType } from "./Sidebar";
import { BlinkingEyes } from "./BlinkingEyes";

type AnalysisType = "technical" | "fundamental" | "news";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string;
}

interface ChatInterfaceProps {
  activeCategory: CategoryType;
  activeType: AnalysisType;
}

export function ChatInterface({ activeCategory, activeType }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  // Clear chat when switching modes
  useEffect(() => {
    setMessages([]);
    setInput("");
    setSelectedImage(null);
  }, [activeType, activeCategory]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      image: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsLoading(true);
    
    const currentImage = selectedImage;
    setSelectedImage(null); 

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: activeCategory,
          type: activeType,
          prompt: input,
          image: currentImage ? currentImage.split(",")[1] : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch");

      const botMessage: Message = {
        role: "assistant",
        content: data.result,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setSelectedImage(reader.result as string);
          };
          reader.readAsDataURL(file);
          e.preventDefault(); // Prevent pasting the image filename/binary into text
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getWelcomeMessage = () => {
    if (activeCategory === "ihsg") return "IHSG Analysis coming soon.";

    if (activeCategory === "forex") {
       switch (activeType) {
        case "technical": return "Upload or paste a Forex chart to analyze.";
        case "news": return "Ask about recent Forex news and market impact.";
      }
    }

    // Default Crypto
    switch (activeType) {
      case "technical": return "Upload or paste a chart to analyze.";
      case "fundamental": return "Ask about a coin's long-term potential and tokenomics.";
      case "news": return "Ask about recent crypto news and market impact.";
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto relative">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 pb-32">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full mt-20">
            <BlinkingEyes />
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex gap-4 md:gap-6",
              msg.role === "user" ? "flex-row-reverse" : ""
            )}
          >
            <div
              className={cn(
                "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md",
                msg.role === "user" ? "bg-[#2b2c2d]" : "bg-gradient-to-br from-indigo-500 to-purple-600"
              )}
            >
              {msg.role === "user" ? <User size={18} className="text-gray-300" /> : <Bot size={20} className="text-white" />}
            </div>
            
            <div className={cn("flex flex-col max-w-[85%] md:max-w-[75%]", msg.role === "user" ? "items-end" : "items-start")}>
              {msg.role === "user" && (
                <div className="text-sm text-gray-400 mb-1 font-medium">You</div>
              )}
              {msg.role === "assistant" && (
                <div className="text-sm text-indigo-300 mb-1 font-medium">Goblinns</div>
              )}

              <div
                className={cn(
                  "rounded-2xl px-5 py-3 text-[15px] leading-7 shadow-sm",
                  msg.role === "user"
                    ? "bg-zinc-900 text-gray-100 rounded-tr-sm"
                    : "text-gray-100" // Assistant messages don't need background in Gemini style usually, but let's keep it clean or maybe transparent
                )}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Uploaded analysis"
                    className="max-w-full rounded-xl mb-3 border border-gray-700"
                  />
                )}
                <div className="prose prose-invert prose-p:leading-7 prose-pre:bg-[#1e1f20] prose-pre:border prose-pre:border-[#333] max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      pre: ({...props}) => <pre className="overflow-auto w-full my-3 bg-[#1e1f20] p-4 rounded-xl border border-[#333]" {...props} />,
                      code: ({...props}) => <code className="bg-[#2b2c2d] px-1.5 py-0.5 rounded text-sm font-mono text-indigo-300" {...props} />
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4 md:gap-6">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 animate-pulse">
              <Bot size={20} className="text-white" />
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-black p-4 md:p-6">
        <div className="max-w-4xl mx-auto relative">
          {selectedImage && (
            <div className="absolute -top-20 left-0 bg-[#1e1f20] p-2 rounded-xl border border-[#333] flex items-center gap-2 shadow-lg">
              <img
                src={selectedImage}
                alt="Preview"
                className="h-12 w-12 rounded-lg object-cover"
              />
              <span className="text-xs text-gray-400">Image attached</span>
              <button
                onClick={() => setSelectedImage(null)}
                className="ml-2 p-1 hover:bg-[#2b2c2d] rounded-full text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          )}
          
          <div className="bg-zinc-900 rounded-[2rem] border border-zinc-800 focus-within:border-zinc-700 focus-within:bg-zinc-900 transition-all shadow-lg flex items-end p-2 md:p-3">
            {activeType === "technical" && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 rounded-full text-gray-400 hover:text-white hover:bg-[#333] transition-colors flex-shrink-0 mb-0.5"
                  title="Upload Image"
                >
                  <ImageIcon size={22} />
                </button>
              </>
            )}
            
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Tanyakan apa saja..."
              className="flex-1 bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 resize-none max-h-32 py-3 px-2 text-[15px] scrollbar-thin scrollbar-thumb-gray-600"
              rows={1}
            />
            
            <button
              onClick={() => handleSubmit()}
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className="p-3 rounded-full bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 mb-0.5"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-500 mt-2">
            Goblinns may display inaccurate info, including about people, so double-check its responses.
          </p>
        </div>
      </div>
    </div>
  );
}
