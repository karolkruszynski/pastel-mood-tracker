
import React from "react";
import { useThemes } from "@/contexts/ThemesContext";
import { LucideIcon } from "lucide-react";

interface ThemedIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
}

export const ThemedIcon: React.FC<ThemedIconProps> = ({ 
  icon: Icon, 
  size = 24, 
  className = "" 
}) => {
  const { iconTheme } = useThemes();
  
  // Apply theme-specific styling
  let themedClassName = className;
  let strokeWidth = 1.5; // default
  let fill = "none";
  
  switch (iconTheme) {
    case "minimal":
      strokeWidth = 1;
      break;
    case "colorful":
      // For colorful theme, we'll add fill in the component usage
      fill = "currentColor";
      break;
    case "classic":
      strokeWidth = 2;
      break;
    default: // default theme
      strokeWidth = 1.5;
  }
  
  return (
    <Icon 
      size={size} 
      strokeWidth={strokeWidth} 
      className={themedClassName}
      fill={fill === "currentColor" ? "currentColor" : "none"}
    />
  );
};
