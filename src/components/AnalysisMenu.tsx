"use client";

import { BarChart2, Globe, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

type AnalysisType = "technical" | "fundamental" | "news";

interface AnalysisMenuProps {
  activeType: AnalysisType;
  onSelect: (type: AnalysisType) => void;
}

export function AnalysisMenu({ activeType, onSelect }: AnalysisMenuProps) {
  const menuItems = [
    {
      id: "technical",
      label: "Technical Analysis",
      icon: BarChart2,
      description: "Chart patterns, indicators & signals",
    },
    {
      id: "fundamental",
      label: "Fundamental Analysis",
      icon: Globe,
      description: "Project viability & long-term value",
    },
    {
      id: "news",
      label: "News & Policy",
      icon: Newspaper,
      description: "Market sentiment & regulations",
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeType === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              "flex flex-col items-center p-6 rounded-xl transition-all duration-300 border",
              isActive
                ? "bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/20"
                : "bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-800/50"
            )}
          >
            <div
              className={cn(
                "p-3 rounded-full mb-3 transition-colors",
                isActive ? "bg-indigo-500/20 text-indigo-400" : "bg-gray-800 text-gray-400"
              )}
            >
              <Icon size={24} />
            </div>
            <h3 className={cn("font-semibold mb-1", isActive ? "text-white" : "text-gray-300")}>
              {item.label}
            </h3>
            <p className="text-xs text-gray-500 text-center">{item.description}</p>
          </button>
        );
      })}
    </div>
  );
}
