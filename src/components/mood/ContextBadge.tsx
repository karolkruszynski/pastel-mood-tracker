import React from "react";
import { Briefcase, Heart, Cloud, Moon, Utensils, LucideIcon } from "lucide-react";
import { ThemedIcon } from "@/components/ui/themed-icon";

export interface ContextOption {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

export const contextOptions: ContextOption[] = [
  { id: "work", label: "Work", icon: Briefcase, color: "blue" },
  { id: "relationships", label: "Relationships", icon: Heart, color: "pink" },
  { id: "weather", label: "Weather", icon: Cloud, color: "sky" },
  { id: "sleep", label: "Sleep", icon: Moon, color: "purple" },
  { id: "food", label: "Food", icon: Utensils, color: "green" },
];

interface ContextBadgeProps {
  contextId: string;
  size?: "sm" | "md";
  className?: string;
}

export const ContextBadge: React.FC<ContextBadgeProps> = ({ 
  contextId, 
  size = "md",
  className = "" 
}) => {
  const context = contextOptions.find(c => c.id === contextId);
  
  if (!context) return null;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5"
  };

  const iconSize = size === "sm" ? 12 : 14;

  const colorClasses = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    pink: "bg-pink-100 text-pink-700 border-pink-200", 
    sky: "bg-sky-100 text-sky-700 border-sky-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    green: "bg-green-100 text-green-700 border-green-200"
  };

  return (
    <span 
      className={`
        inline-flex items-center rounded-full border font-medium
        ${sizeClasses[size]}
        ${colorClasses[context.color as keyof typeof colorClasses]}
        ${className}
      `}
    >
      <ThemedIcon icon={context.icon} size={iconSize} />
      <span>{context.label}</span>
    </span>
  );
};