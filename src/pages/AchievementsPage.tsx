
import { MoodTrophies } from "@/components/dashboard/MoodTrophies";

export const AchievementsPage = () => {
  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Achievements</h1>
      <p className="text-muted-foreground mb-6">
        Track your mood tracking milestones
      </p>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Achievements</h2>
          <MoodTrophies showUnlocked={true} />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Achievements to Unlock</h2>
          <MoodTrophies showUnlocked={false} />
        </div>
      </div>
    </div>
  );
};
