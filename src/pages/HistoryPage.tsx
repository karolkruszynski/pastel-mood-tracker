
import { MoodLog } from "@/components/mood/MoodLog";
import { useMood } from "@/contexts/MoodContext";

export const HistoryPage = () => {
  const { moodEntries } = useMood();

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Mood History</h1>
      <p className="text-muted-foreground mb-6">
        View a complete record of your mood entries
      </p>

      <MoodLog entries={moodEntries} />
    </div>
  );
};
