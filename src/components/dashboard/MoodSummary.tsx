
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodEntry } from "../mood/MoodLog";
import { startOfToday, startOfDay, subDays } from "date-fns";

interface MoodSummaryProps {
  entries: MoodEntry[];
}

export const MoodSummary = ({ entries }: MoodSummaryProps) => {
  const today = startOfToday();
  const yesterday = startOfDay(subDays(today, 1));
  
  const todayEntries = entries.filter(entry => 
    startOfDay(new Date(entry.timestamp)).getTime() === today.getTime()
  );
  
  const yesterdayEntries = entries.filter(entry => 
    startOfDay(new Date(entry.timestamp)).getTime() === yesterday.getTime()
  );
  
  const averageTodayMood = todayEntries.length 
    ? Math.round(todayEntries.reduce((sum, entry) => sum + entry.mood, 0) / todayEntries.length * 10) / 10
    : null;
  
  const averageYesterdayMood = yesterdayEntries.length 
    ? Math.round(yesterdayEntries.reduce((sum, entry) => sum + entry.mood, 0) / yesterdayEntries.length * 10) / 10
    : null;
  
  const getTrend = () => {
    if (averageTodayMood === null || averageYesterdayMood === null) return "neutral";
    if (averageTodayMood > averageYesterdayMood) return "positive";
    if (averageTodayMood < averageYesterdayMood) return "negative";
    return "neutral";
  };
  
  const getMoodLabel = (mood: number | null) => {
    if (mood === null) return "No data";
    if (mood < 1.5) return "Terrible";
    if (mood < 2.5) return "Bad";
    if (mood < 3.5) return "Neutral";
    if (mood < 4.5) return "Good";
    return "Great";
  };

  const getMoodEmoji = (mood: number | null) => {
    if (mood === null) return "❓";
    if (mood < 1.5) return "😭";
    if (mood < 2.5) return "☹️";
    if (mood < 3.5) return "😐";
    if (mood < 4.5) return "🙂";
    return "😄";
  };

  const getMoodColor = (mood: number | null) => {
    if (mood === null) return "bg-gray-200";
    if (mood < 1.5) return "bg-mood-terrible";
    if (mood < 2.5) return "bg-mood-bad";
    if (mood < 3.5) return "bg-mood-neutral";
    if (mood < 4.5) return "bg-mood-good";
    return "bg-mood-great";
  };
  
  // Calculate the percentage for the gauge
  const gaugePercentage = averageTodayMood !== null 
    ? ((averageTodayMood - 1) / 4) * 100 
    : 0;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-pastel-pink">
      <CardHeader>
        <CardTitle className="text-xl">Today's Mood</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {averageTodayMood === null ? (
          <div className="text-center text-muted-foreground my-4">
            <p>No mood entries today</p>
            <p className="text-sm">Log your first mood of the day!</p>
          </div>
        ) : (
          <>
            <div className="relative w-48 h-24 overflow-hidden mb-4">
              <div className="absolute w-full h-full mood-gradient rounded-t-full"></div>
              <div className="absolute bottom-0 left-1/2 w-1 h-12 bg-black -ml-0.5" 
                   style={{ transform: `rotate(${gaugePercentage * 1.8 - 90}deg)`, transformOrigin: 'bottom center' }}>
                <div className="w-3 h-3 rounded-full bg-black -mt-3 -ml-1"></div>
              </div>
            </div>
            
            <div className="flex flex-col items-center mb-4 text-center">
              <div className="text-6xl mb-2">{getMoodEmoji(averageTodayMood)}</div>
              <div className={`px-4 py-2 rounded-full font-medium ${getMoodColor(averageTodayMood)} text-white`}>
                {getMoodLabel(averageTodayMood)}
              </div>
            </div>
            
            <div className="text-sm text-center text-muted-foreground">
              {todayEntries.length} {todayEntries.length === 1 ? 'entry' : 'entries'} today
            </div>
            
            {averageYesterdayMood !== null && (
              <div className={`mt-2 text-sm text-center ${
                getTrend() === "positive" 
                  ? "text-green-600"
                  : getTrend() === "negative" 
                    ? "text-red-600" 
                    : "text-yellow-600"
              }`}>
                {getTrend() === "positive" 
                  ? "↑ Better than yesterday"
                  : getTrend() === "negative" 
                    ? "↓ Worse than yesterday"
                    : "→ Same as yesterday"
                }
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
