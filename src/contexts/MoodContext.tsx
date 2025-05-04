
import { createContext, useContext, useState, useEffect } from "react";
import { MoodEntry } from "@/components/mood/MoodLog";
import { useAuth } from "./AuthContext";

interface MoodContextType {
  moodEntries: MoodEntry[];
  addMoodEntry: (mood: number, note: string) => void;
  isLoading: boolean;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error("useMood must be used within a MoodProvider");
  }
  return context;
};

export const MoodProvider = ({ children }: { children: React.ReactNode }) => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load mood entries from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      const savedEntries = localStorage.getItem(`moodpal_entries_${user.id}`);
      if (savedEntries) {
        try {
          // Parse the saved entries and convert timestamps back to Date objects
          const parsedEntries = JSON.parse(savedEntries).map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
          }));
          setMoodEntries(parsedEntries);
        } catch (error) {
          console.error("Error parsing mood entries:", error);
          setMoodEntries([]);
        }
      } else {
        setMoodEntries([]);
      }
    } else {
      setMoodEntries([]);
    }
    setIsLoading(false);
  }, [user]);

  // Save mood entries to localStorage when they change
  useEffect(() => {
    if (user && !isLoading) {
      localStorage.setItem(`moodpal_entries_${user.id}`, JSON.stringify(moodEntries));
    }
  }, [moodEntries, user, isLoading]);

  const addMoodEntry = (mood: number, note: string) => {
    if (!user) return;

    const newEntry: MoodEntry = {
      id: `mood-${Date.now()}`,
      mood,
      note,
      timestamp: new Date()
    };

    setMoodEntries(prevEntries => [newEntry, ...prevEntries]);
  };

  return (
    <MoodContext.Provider value={{ moodEntries, addMoodEntry, isLoading }}>
      {children}
    </MoodContext.Provider>
  );
};
