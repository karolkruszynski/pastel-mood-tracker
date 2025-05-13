import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { FrownIcon, MehIcon, SmileIcon } from "lucide-react";
import { ThemedIcon } from "@/components/ui/themed-icon";

export interface MoodEntry {
  id: string;
  mood: number;
  note: string;
  timestamp: Date;
}

interface MoodLogProps {
  entries: MoodEntry[];
}

export const MoodLog = ({ entries }: MoodLogProps) => {
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  const getMoodIcon = (mood: number) => {
    if (mood <= 2) {
      return <ThemedIcon 
        icon={FrownIcon} 
        className={`h-5 w-5 ${mood === 1 ? 'text-mood-terrible' : 'text-mood-bad'}`} 
      />;
    }
    if (mood === 3) {
      return <ThemedIcon icon={MehIcon} className="h-5 w-5 text-mood-neutral" />;
    }
    return <ThemedIcon 
      icon={SmileIcon} 
      className={`h-5 w-5 ${mood === 4 ? 'text-mood-good' : 'text-mood-great'}`} 
    />;
  };

  const getMoodLabel = (mood: number) => {
    switch (mood) {
      case 1: return "Terrible";
      case 2: return "Bad";
      case 3: return "Neutral";
      case 4: return "Good";
      case 5: return "Great";
      default: return "Unknown";
    }
  };

  const getMoodColor = (mood: number) => {
    switch (mood) {
      case 1: return "bg-mood-terrible";
      case 2: return "bg-mood-bad";
      case 3: return "bg-mood-neutral";
      case 4: return "bg-mood-good";
      case 5: return "bg-mood-great";
      default: return "bg-gray-200";
    }
  };

  const toggleExpand = (id: string) => {
    if (expandedEntryId === id) {
      setExpandedEntryId(null);
    } else {
      setExpandedEntryId(id);
    }
  };

  const getSortedEntries = () => {
    return [...entries].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  if (entries.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border border-pastel-pink">
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground">No mood entries yet. Start tracking your mood!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-pastel-pink">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Mood History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
        {getSortedEntries().map((entry) => (
          <div 
            key={entry.id} 
            className="rounded-lg border border-gray-100 p-3 hover:border-gray-200 transition-all cursor-pointer"
            onClick={() => toggleExpand(entry.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-8 rounded-full ${getMoodColor(entry.mood)}`} />
                <div>
                  <p className="text-sm font-medium flex items-center gap-1">
                    {getMoodIcon(entry.mood)} {getMoodLabel(entry.mood)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(entry.timestamp, "MMM d, h:mm a")}
                  </p>
                </div>
              </div>
            </div>
            
            {entry.note && expandedEntryId === entry.id && (
              <div className="mt-3 pt-3 border-t text-sm text-gray-600 animate-accordion-down">
                {entry.note}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
