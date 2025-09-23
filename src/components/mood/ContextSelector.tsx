import React from "react";
import { contextOptions, ContextOption } from "./ContextBadge";
import { ThemedIcon } from "@/components/ui/themed-icon";

interface ContextSelectorProps {
  selectedContexts: string[];
  onContextChange: (contexts: string[]) => void;
  className?: string;
}

export const ContextSelector: React.FC<ContextSelectorProps> = ({
  selectedContexts,
  onContextChange,
  className = ""
}) => {
  const handleContextToggle = (contextId: string) => {
    if (selectedContexts.includes(contextId)) {
      onContextChange(selectedContexts.filter(id => id !== contextId));
    } else if (selectedContexts.length < 5) {
      onContextChange([...selectedContexts, contextId]);
    }
  };

  const getContextClasses = (context: ContextOption, isSelected: boolean) => {
    const baseClasses = "flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all duration-200 cursor-pointer select-none";
    
    const colorClasses = {
      blue: isSelected 
        ? "bg-blue-500 text-white border-blue-500 shadow-md"
        : "bg-transparent text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400",
      pink: isSelected
        ? "bg-pink-500 text-white border-pink-500 shadow-md"
        : "bg-transparent text-pink-600 border-pink-300 hover:bg-pink-50 hover:border-pink-400",
      sky: isSelected
        ? "bg-sky-500 text-white border-sky-500 shadow-md" 
        : "bg-transparent text-sky-600 border-sky-300 hover:bg-sky-50 hover:border-sky-400",
      purple: isSelected
        ? "bg-purple-500 text-white border-purple-500 shadow-md"
        : "bg-transparent text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400",
      green: isSelected
        ? "bg-green-500 text-white border-green-500 shadow-md"
        : "bg-transparent text-green-600 border-green-300 hover:bg-green-50 hover:border-green-400"
    };

    return `${baseClasses} ${colorClasses[context.color as keyof typeof colorClasses]}`;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          What's influencing your mood?
        </h3>
        <span className="text-xs text-gray-500">
          {selectedContexts.length}/5 selected
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {contextOptions.map((context) => {
          const isSelected = selectedContexts.includes(context.id);
          const isDisabled = !isSelected && selectedContexts.length >= 5;
          
          return (
            <button
              key={context.id}
              onClick={() => !isDisabled && handleContextToggle(context.id)}
              disabled={isDisabled}
              className={`
                ${getContextClasses(context, isSelected)}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <ThemedIcon icon={context.icon} size={16} />
              <span className="text-sm font-medium">{context.label}</span>
            </button>
          );
        })}
      </div>
      
      {selectedContexts.length > 0 && (
        <p className="text-xs text-gray-600 mt-2">
          Selected: {selectedContexts.map(id => 
            contextOptions.find(c => c.id === id)?.label
          ).join(", ")}
        </p>
      )}
    </div>
  );
};