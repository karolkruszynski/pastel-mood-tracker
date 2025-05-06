
import { MoodSelector } from "@/components/mood/MoodSelector";
import { MoodSummary } from "@/components/dashboard/MoodSummary";
import { DailyMoodTrends } from "@/components/dashboard/DailyMoodTrends";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMood } from "@/contexts/MoodContext";
import { useAuth } from "@/contexts/AuthContext";
import { startOfToday } from "date-fns";
import { FrownIcon, MehIcon, SmileIcon } from "lucide-react";

export const HomePage = () => {
  const { moodEntries, addMoodEntry } = useMood();
  const { user } = useAuth();
  
  const todayEntries = moodEntries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    const today = startOfToday();
    return entryDate >= today;
  });

  // Get display name from user metadata or email
  const displayName = user ? 
    (user.user_metadata?.username || 
     user.user_metadata?.name || 
     user.email?.split('@')[0] ||
     'User') : 'Guest';

  // Get only the 3 most recent entries for today
  const recentTodayEntries = todayEntries.slice(0, 3);

  // Helper function to get mood icon
  const getMoodIcon = (mood: number) => {
    if (mood === 1) return <FrownIcon className="w-5 h-5 text-mood-terrible" />;
    if (mood === 2) return <FrownIcon className="w-5 h-5 text-mood-bad" />;
    if (mood === 3) return <MehIcon className="w-5 h-5 text-mood-neutral" />;
    if (mood === 4) return <SmileIcon className="w-5 h-5 text-mood-good" />;
    return <SmileIcon className="w-5 h-5 text-mood-great" />;
  };

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {user ? `Hello, ${displayName}` : 'Welcome to MoodPal'}
        </h1>
        <p className="text-muted-foreground">
          Track and visualize your emotions to better understand your mental health
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border border-pastel-pink">
          <CardContent className="pt-6">
            <MoodSelector onMoodSelect={addMoodEntry} />
          </CardContent>
        </Card>

        <MoodSummary entries={moodEntries} />
      </div>

      {recentTodayEntries.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Today's Entries {todayEntries.length > 3 && 
            <span className="text-sm font-normal text-muted-foreground ml-2">(showing most recent 3)</span>}
          </h2>
          <div className="space-y-4">
            {recentTodayEntries.map((entry) => (
              <div key={entry.id} className="p-4 border rounded-lg bg-white/80">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-8 rounded-full ${
                    entry.mood === 1 ? "bg-mood-terrible" :
                    entry.mood === 2 ? "bg-mood-bad" :
                    entry.mood === 3 ? "bg-mood-neutral" :
                    entry.mood === 4 ? "bg-mood-good" :
                    "bg-mood-great"
                  }`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center">
                        {getMoodIcon(entry.mood)}
                      </div>
                      <p className="font-medium">
                        {entry.mood === 1 ? "Terrible" :
                         entry.mood === 2 ? "Bad" :
                         entry.mood === 3 ? "Neutral" :
                         entry.mood === 4 ? "Good" :
                         "Great"}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                {entry.note && (
                  <p className="mt-2 text-sm text-gray-600 pl-5">{entry.note}</p>
                )}
              </div>
            ))}
            {todayEntries.length > 3 && (
              <p className="text-sm text-center text-muted-foreground">
                {todayEntries.length - 3} more {todayEntries.length - 3 === 1 ? 'entry' : 'entries'} not shown
              </p>
            )}
          </div>
        </div>
      )}

      <DailyMoodTrends entries={moodEntries} />
    </div>
  );
};
