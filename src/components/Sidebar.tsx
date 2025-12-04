"use client";

import { BarChart2, Globe, Newspaper, Plus, Menu, ChevronDown, ChevronRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export type AnalysisType = "technical" | "fundamental" | "news";
export type CategoryType = "crypto" | "forex" | "ihsg";

interface SidebarProps {
  activeCategory: CategoryType;
  activeType: AnalysisType;
  onSelect: (category: CategoryType, type: AnalysisType) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ activeCategory, activeType, onSelect, isOpen, setIsOpen }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    crypto: true,
    forex: false,
    ihsg: false,
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const menuStructure = [
    {
      id: "crypto",
      label: "Cryptocurrency",
      icon: TrendingUp,
      items: [
        { id: "technical", label: "Technical Analysis", icon: BarChart2 },
        { id: "fundamental", label: "Fundamental Analysis", icon: Globe },
        { id: "news", label: "News & Policy", icon: Newspaper },
      ]
    },
    {
      id: "forex",
      label: "Forex",
      icon: Globe,
      items: [
        { id: "technical", label: "Technical Analysis", icon: BarChart2 },
        { id: "news", label: "News & Policy", icon: Newspaper },
      ]
    },
    {
      id: "ihsg",
      label: "IHSG",
      icon: BarChart2,
      items: [] // Empty for now
    }
  ] as const;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-black flex flex-col transition-transform duration-300 transform",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-2 text-gray-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 px-2">
            <button className="flex items-center gap-2 bg-zinc-900 text-gray-300 hover:text-white px-4 py-3 rounded-full w-full transition-colors border border-zinc-800">
              <Plus size={18} />
              <span className="text-sm font-medium">New Chat</span>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {menuStructure.map((category) => (
            <div key={category.id} className="mb-2">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-4 py-2 text-gray-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <category.icon size={18} />
                  <span className="font-medium text-sm">{category.label}</span>
                </div>
                {expandedCategories[category.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              {expandedCategories[category.id] && (
                <div className="mt-1 ml-4 space-y-1 border-l border-zinc-800 pl-2">
                  {category.items.length > 0 ? (
                    category.items.map((item) => {
                      const isActive = activeCategory === category.id && activeType === item.id;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onSelect(category.id as CategoryType, item.id as AnalysisType);
                            setIsOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors",
                            isActive
                              ? "bg-[#004a77] text-[#c3e7ff]"
                              : "text-gray-400 hover:text-gray-200 hover:bg-zinc-900"
                          )}
                        >
                          <Icon size={16} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-2 text-xs text-gray-600 italic">
                      Coming Soon
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-900">
          <button className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white transition-colors w-full text-sm">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              G
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-medium text-white">Goblinns</span>
              <span className="text-[10px]">Gemini 2.5 Flash</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
