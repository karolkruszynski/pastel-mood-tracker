
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodEntry } from "../mood/MoodLog";
import { format } from "date-fns";
import { CalendarCheck, CalendarX } from "lucide-react";

interface OtherMoodStatsProps {
  entries: MoodEntry[];
}

export const OtherMoodStats = ({ entries }: OtherMoodStatsProps) => {
  // Find the best day - day with highest average mood
  const getBestDay = () => {
    if (entries.length === 0) return null;
    
    // Group entries by day
    const entriesByDay: Record<string, MoodEntry[]> = {};
    entries.forEach((entry) => {
      const day = format(new Date(entry.timestamp), "yyyy-MM-dd");
      if (!entriesByDay[day]) {
        entriesByDay[day] = [];
      }
      entriesByDay[day].push(entry);
    });
    
    // Calculate average mood for each day
    let bestDayKey = "";
    let bestMood = 0;
    
    Object.entries(entriesByDay).forEach(([day, dayEntries]) => {
      if (dayEntries.length === 0) return;
      
      const avgMood = dayEntries.reduce((sum, entry) => sum + entry.mood, 0) / dayEntries.length;
      if (avgMood > bestMood) {
        bestMood = avgMood;
        bestDayKey = day;
      }
    });
    
    if (bestDayKey === "") return null;
    
    return {
      date: new Date(bestDayKey),
      mood: Math.round(bestMood * 10) / 10
    };
  };
  
  // Find the worst day - day with lowest average mood
  const getWorstDay = () => {
    if (entries.length === 0) return null;
    
    // Group entries by day
    const entriesByDay: Record<string, MoodEntry[]> = {};
    entries.forEach((entry) => {
      const day = format(new Date(entry.timestamp), "yyyy-MM-dd");
      if (!entriesByDay[day]) {
        entriesByDay[day] = [];
      }
      entriesByDay[day].push(entry);
    });
    
    // Calculate average mood for each day
    let worstDayKey = "";
    let worstMood = 6; // Higher than the maximum possible mood (5)
    
    Object.entries(entriesByDay).forEach(([day, dayEntries]) => {
      if (dayEntries.length === 0) return;
      
      const avgMood = dayEntries.reduce((sum, entry) => sum + entry.mood, 0) / dayEntries.length;
      if (avgMood < worstMood) {
        worstMood = avgMood;
        worstDayKey = day;
      }
    });
    
    if (worstDayKey === "") return null;
    
    return {
      date: new Date(worstDayKey),
      mood: Math.round(worstMood * 10) / 10
    };
  };

  // Get mood label based on value
  const getMoodLabel = (mood: number) => {
    if (mood < 1.5) return "Terrible";
    if (mood < 2.5) return "Bad";
    if (mood < 3.5) return "Neutral";
    if (mood < 4.5) return "Good";
    return "Great";
  };

  const bestDay = getBestDay();
  const worstDay = getWorstDay();

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm border border-pastel-pink">
      <CardHeader>
        <CardTitle className="text-xl">Other Mood Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-secondary/50 rounded-lg p-4 shadow-lg flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CalendarCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground uppercase font-semibold">Best Day</h3>
              {bestDay ? (
                <div className="mt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">{bestDay.mood}</span>
                    <span className="text-sm text-green-600 font-medium">({getMoodLabel(bestDay.mood)})</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(bestDay.date, "d MMM")}
                  </p>
                </div>
              ) : (
                <p className="text-sm">Not enough data</p>
              )}
            </div>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4 shadow-lg flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-full">
              <CalendarX className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground uppercase font-semibold">Worst Day</h3>
              {worstDay ? (
                <div className="mt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">{worstDay.mood}</span>
                    <span className="text-sm text-red-600 font-medium">({getMoodLabel(worstDay.mood)})</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(worstDay.date, "d MMM")}
                  </p>
                </div>
              ) : (
                <p className="text-sm">Not enough data</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
