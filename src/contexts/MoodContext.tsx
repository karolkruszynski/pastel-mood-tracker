
import { createContext, useContext, useState, useEffect } from "react";
import { MoodEntry } from "@/components/mood/MoodLog";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  // Load mood entries from Supabase when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchMoodEntries();
    } else {
      setMoodEntries([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchMoodEntries = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      const formattedEntries = data.map(entry => ({
        id: entry.id,
        mood: entry.mood,
        note: entry.note || '',
        timestamp: new Date(entry.timestamp)
      }));
      
      setMoodEntries(formattedEntries);
    } catch (error) {
      console.error("Error fetching mood entries:", error);
      toast.error("Failed to load mood entries");
    } finally {
      setIsLoading(false);
    }
  };

  const addMoodEntry = async (mood: number, note: string) => {
    if (!user) return;

    try {
      // Create new entry object
      const newEntry = {
        user_id: user.id,
        mood,
        note,
        timestamp: new Date().toISOString()
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('mood_entries')
        .insert(newEntry)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Format and add to local state
      const formattedEntry: MoodEntry = {
        id: data.id,
        mood: data.mood,
        note: data.note || '',
        timestamp: new Date(data.timestamp)
      };
      
      setMoodEntries(prev => [formattedEntry, ...prev]);
      
    } catch (error) {
      console.error("Error adding mood entry:", error);
      toast.error("Failed to save mood entry");
    }
  };

  return (
    <MoodContext.Provider value={{ moodEntries, addMoodEntry, isLoading }}>
      {children}
    </MoodContext.Provider>
  );
};
