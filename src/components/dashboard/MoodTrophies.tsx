
import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMood } from "@/contexts/MoodContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TrophyData {
  id: string;
  title: string;
  description: string;
  threshold: number;
  icon: React.ReactNode;
}

export const MoodTrophies = () => {
  const { moodEntries } = useMood();
  const entryCount = moodEntries.length;
  
  const trophies: TrophyData[] = [
    {
      id: "first-mood",
      title: "First Mood",
      description: "Submitted your first mood entry",
      threshold: 1,
      icon: <Trophy className="h-10 w-10 text-amber-400" />
    },
    {
      id: "fifty-moods",
      title: "Mood Tracker",
      description: "Tracked 50 mood entries",
      threshold: 50,
      icon: <Trophy className="h-10 w-10 text-slate-400" />
    },
    {
      id: "hundred-moods",
      title: "Mood Master",
      description: "Reached 100 mood entries",
      threshold: 100,
      icon: <Trophy className="h-10 w-10 text-amber-600" />
    },
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-pastel-pink mb-8">
      <CardHeader>
        <CardTitle className="text-xl">Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-center gap-6 py-2">
          {trophies.map((trophy) => {
            const achieved = entryCount >= trophy.threshold;
            
            return (
              <TooltipProvider key={trophy.id}>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center">
                      <div className={`p-4 rounded-full ${achieved ? 'bg-secondary/70' : 'bg-gray-200/50'} mb-2`}>
                        {trophy.icon}
                      </div>
                      <span className={`text-sm font-medium ${achieved ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {trophy.title}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <div className="text-center">
                      <p className="font-semibold">{trophy.description}</p>
                      {achieved ? (
                        <p className="text-xs text-green-600">Achieved!</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Progress: {entryCount}/{trophy.threshold}
                        </p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
