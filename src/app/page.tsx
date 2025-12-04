"use client";

import { useState } from "react";
import { Sidebar, AnalysisType, CategoryType } from "@/components/Sidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { Menu } from "lucide-react";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("crypto");
  const [activeType, setActiveType] = useState<AnalysisType>("technical");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSelect = (category: CategoryType, type: AnalysisType) => {
    setActiveCategory(category);
    setActiveType(type);
  };

  return (
    <main className="flex h-screen bg-black text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar 
        activeCategory={activeCategory}
        activeType={activeType} 
        onSelect={handleSelect} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Header with Hamburger */}
        <div className="fixed top-4 left-4 z-50">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-white bg-black/50 rounded-full hover:bg-zinc-900 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Chat Interface */}
        <ChatInterface activeCategory={activeCategory} activeType={activeType} />
      </div>
    </main>
  );
}
