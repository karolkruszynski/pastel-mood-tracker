
import { MoodChart } from "@/components/dashboard/MoodChart";
import { MoodSummary } from "@/components/dashboard/MoodSummary";
import { MoodTrophies } from "@/components/dashboard/MoodTrophies";
import { useMood } from "@/contexts/MoodContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const DashboardPage = () => {
  const { moodEntries } = useMood();

  // Calculate overall average mood
  const averageMood = moodEntries.length > 0
    ? Math.round(moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length * 10) / 10
    : 0;

  // Get label for average mood
  const getMoodLabel = (mood: number) => {
    if (mood < 1.5) return "Terrible";
    if (mood < 2.5) return "Bad";
    if (mood < 3.5) return "Neutral";
    if (mood < 4.5) return "Good";
    return "Great";
  };

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Mood Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Visualize your mood patterns over time
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MoodSummary entries={moodEntries} />
        
        <Card className="md:col-span-2 bg-white/80 backdrop-blur-sm border border-pastel-pink">
          <CardHeader>
            <CardTitle className="text-xl">Mood Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <dt className="text-sm text-muted-foreground">Total Entries</dt>
                <dd className="text-3xl font-bold mt-1">{moodEntries.length}</dd>
              </div>
              
              <div className="bg-secondary/50 rounded-lg p-4">
                <dt className="text-sm text-muted-foreground">Average Mood</dt>
                <dd className="mt-1">
                  {moodEntries.length === 0 ? (
                    <span className="text-lg font-medium">No data</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">{averageMood}</span>
                      <span className="text-sm ml-2">({getMoodLabel(averageMood)})</span>
                    </>
                  )}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
      
      <MoodTrophies />
      
      <Tabs defaultValue="week" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>
        
        <TabsContent value="week">
          <MoodChart entries={moodEntries} days={7} title="Weekly Mood Trends" />
        </TabsContent>
        
        <TabsContent value="month">
          <MoodChart entries={moodEntries} days={30} title="Monthly Mood Trends" />
        </TabsContent>
      </Tabs>
    </div>
  );
};
