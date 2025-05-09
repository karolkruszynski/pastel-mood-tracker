import { MoodChart } from "@/components/dashboard/MoodChart";
import { MoodSummary } from "@/components/dashboard/MoodSummary";
import { OtherMoodStats } from "@/components/dashboard/OtherMoodStats";
import { MoodByWeekday } from "@/components/dashboard/MoodByWeekday";
import { useMood } from "@/contexts/MoodContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FrownIcon, MehIcon, SmileIcon } from "lucide-react";

export const DashboardPage = () => {
  const { moodEntries } = useMood();

  // Calculate overall average mood
  const averageMood =
    moodEntries.length > 0
      ? Math.round(
          (moodEntries.reduce((sum, entry) => sum + entry.mood, 0) /
            moodEntries.length) *
            10
        ) / 10
      : 0;

  const getMoodEmoji = (mood: number | null) => {
    if (mood === null)
      return (
        <div className="w-12 h-12 flex items-center justify-center text-gray-400">
          ?
        </div>
      );
    if (mood < 1.5)
      return <FrownIcon size={35} className="text-mood-terrible" />;
    if (mood < 2.5) return <FrownIcon size={35} className="text-mood-bad" />;
    if (mood < 3.5) return <MehIcon size={35} className="text-mood-neutral" />;
    if (mood < 4.5) return <SmileIcon size={35} className="text-mood-good" />;
    return <SmileIcon size={35} className="text-mood-great" />;
  };
  // Get label for average mood
  const getMoodLabel = (mood: number) => {
    if (mood < 1.5) return "Terrible";
    if (mood < 2.5) return "Bad";
    if (mood < 3.5) return "Neutral";
    if (mood < 4.5) return "Good";
    return "Great";
  };

  // Calculate most frequent mood
  const getMostFrequentMood = () => {
    if (moodEntries.length === 0) return null;

    const moodCounts: Record<string, number> = {};

    moodEntries.forEach((entry) => {
      const label = getMoodLabel(entry.mood);
      moodCounts[label] = (moodCounts[label] || 0) + 1;
    });

    let mostFrequentMood = "";
    let highestCount = 0;

    for (const mood in moodCounts) {
      if (moodCounts[mood] > highestCount) {
        mostFrequentMood = mood;
        highestCount = moodCounts[mood];
      }
    }

    return { mood: mostFrequentMood, count: highestCount };
  };

  const mostTrackedMood = getMostFrequentMood();

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Mood Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Visualize your mood patterns over time
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MoodSummary entries={moodEntries} />

        <Card className="md:col-span-2 bg-white/80 backdrop-blur-sm border border-pastel-pink flex flex-col justify-between">
          <CardHeader className="flex-2">
            <CardTitle className="text-xl">Mood Stats</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
              <div className="bg-secondary/50 rounded-lg p-4 shadow-lg  flex flex-col justify-around  md:min-h-[250px] ">
                <dt className="text-sm text-muted-foreground uppercase font-semibold h-10 ">
                  Total Entries
                </dt>
                <dd className="text-3xl md:text-5xl font-bold mt-1">
                  {moodEntries.length}
                </dd>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4  shadow-lg  flex flex-col justify-around">
                <dt className="text-sm text-muted-foreground uppercase font-semibold h-10 ">
                  Average Mood
                </dt>
                <dd className="mt-1">
                  {moodEntries.length === 0 ? (
                    <span className="text-lg font-medium ">No data</span>
                  ) : (
                    <div className=" gap-2 relative flex items-center">
                      <span className="text-3xl font-bold md:text-5xl ">
                        {averageMood}
                      </span>
                      <div className="md:absolute -bottom-10">
                        {getMoodEmoji(averageMood)}
                      </div>
                    </div>
                  )}
                </dd>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4  shadow-lg flex flex-col justify-around font-semibold">
                <dt className="text-sm text-muted-foreground uppercase h-10">
                  Most Tracked Mood
                </dt>
                <dd className="mt-1">
                  {!mostTrackedMood ? (
                    <span className="text-lg font-medium">No data</span>
                  ) : (
                    <>
                      <span className="text-3xl md:text-4xl font-bold">
                        {mostTrackedMood.mood}
                      </span>
                      <span className="text-sm block mt-1 md:absolute text-zinc-500">
                        Logged {mostTrackedMood.count}{" "}
                        {mostTrackedMood.count === 1 ? "time" : "times"}
                      </span>
                    </>
                  )}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="week" className="w-full mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="week">
          <MoodChart
            entries={moodEntries}
            days={7}
            title="Weekly Mood Trends"
          />
        </TabsContent>

        <TabsContent value="month">
          <MoodChart
            entries={moodEntries}
            days={30}
            title="Monthly Mood Trends"
          />
        </TabsContent>
      </Tabs>

      <OtherMoodStats entries={moodEntries} />

      <MoodByWeekday entries={moodEntries} />
    </div>
  );
};
