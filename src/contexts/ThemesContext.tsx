
import React, { createContext, useContext, useState, useEffect } from "react";

type IconTheme = "default" | "minimal" | "colorful" | "classic";

interface ThemesContextType {
  iconTheme: IconTheme;
  setIconTheme: (theme: IconTheme) => void;
}

const defaultContext: ThemesContextType = {
  iconTheme: "default",
  setIconTheme: () => {},
};

const ThemesContext = createContext<ThemesContextType>(defaultContext);

export const useThemes = () => useContext(ThemesContext);

export const ThemesProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [iconTheme, setIconTheme] = useState<IconTheme>(() => {
    // Try to get the saved theme from localStorage
    const savedTheme = localStorage.getItem("moodpal-icon-theme");
    return (savedTheme as IconTheme) || "default";
  });

  // Save theme changes to localStorage
  useEffect(() => {
    localStorage.setItem("moodpal-icon-theme", iconTheme);
  }, [iconTheme]);

  return (
    <ThemesContext.Provider value={{ iconTheme, setIconTheme }}>
      {children}
    </ThemesContext.Provider>
  );
};
