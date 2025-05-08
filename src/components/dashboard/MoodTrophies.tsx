
import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMood } from "@/contexts/MoodContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface TrophyData {
  id: string;
  title: string;
  description: string;
  threshold: number;
  icon: React.ReactNode;
}

interface MoodTrophiesProps {
  showUnlocked?: boolean;
}

export const MoodTrophies = ({ showUnlocked = true }: MoodTrophiesProps) => {
  const { moodEntries } = useMood();
  const entryCount = moodEntries.length;
  
  const allTrophies: TrophyData[] = [
    {
      id: "first-mood",
      title: "First Mood",
      description: "Submitted your first mood entry",
      threshold: 1,
      icon: <Trophy className="h-10 w-10" />
    },
    {
      id: "fifty-moods",
      title: "Mood Tracker",
      description: "Tracked 50 mood entries",
      threshold: 50,
      icon: <Trophy className="h-10 w-10" />
    },
    {
      id: "hundred-moods",
      title: "Mood Master",
      description: "Reached 100 mood entries",
      threshold: 100,
      icon: <Trophy className="h-10 w-10" />
    },
  ];

  // Filter trophies based on whether they are unlocked or not
  const filteredTrophies = allTrophies.filter(trophy => {
    const achieved = entryCount >= trophy.threshold;
    return showUnlocked ? achieved : !achieved;
  });

  if (filteredTrophies.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border border-pastel-pink">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground py-8">
            {showUnlocked 
              ? "You haven't unlocked any achievements yet. Keep tracking your moods!" 
              : "You've unlocked all available achievements. Congratulations!"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-pastel-pink">
      <CardContent className="pt-6">
        <div className="flex flex-wrap justify-center gap-8 py-2">
          {filteredTrophies.map((trophy) => {
            const achieved = entryCount >= trophy.threshold;
            const progressPercentage = Math.min(Math.round((entryCount / trophy.threshold) * 100), 100);
            
            return (
              <TooltipProvider key={trophy.id}>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center max-w-[120px]">
                      <div className={`p-4 rounded-full ${achieved ? 'bg-primary/20' : 'bg-gray-200/50'} mb-2`}>
                        <div className={achieved ? 'text-amber-500' : 'text-gray-400'}>
                          {trophy.icon}
                        </div>
                      </div>
                      <span className={`text-sm font-medium text-center ${achieved ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {trophy.title}
                      </span>
                      
                      {!achieved && (
                        <div className="w-full mt-2">
                          <Progress value={progressPercentage} className="h-2" />
                          <p className="text-xs text-center text-muted-foreground mt-1">
                            {entryCount}/{trophy.threshold}
                          </p>
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[200px]">
                    <div className="text-center">
                      <p className="font-semibold">{trophy.description}</p>
                      {achieved ? (
                        <p className="text-xs text-green-600">Achieved!</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Progress: {progressPercentage}%
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
