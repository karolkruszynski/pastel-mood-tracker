import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodEntry } from "../mood/MoodLog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { CalendarDays } from "lucide-react";

interface MoodByWeekdayProps {
  entries: MoodEntry[];
}

export const MoodByWeekday = ({ entries }: MoodByWeekdayProps) => {
  // Process entries by day of week
  const getWeekdayStats = () => {
    if (entries.length === 0) return { data: [], bestDay: null };

    // Initialize weekday data structure
    const weekdays = [
      { name: "Sunday", key: "0", avgMood: 0, count: 0 },
      { name: "Monday", key: "1", avgMood: 0, count: 0 },
      { name: "Tuesday", key: "2", avgMood: 0, count: 0 },
      { name: "Wednesday", key: "3", avgMood: 0, count: 0 },
      { name: "Thursday", key: "4", avgMood: 0, count: 0 },
      { name: "Friday", key: "5", avgMood: 0, count: 0 },
      { name: "Saturday", key: "6", avgMood: 0, count: 0 },
    ];

    // Group entries by weekday
    const weekdayTotals: Record<string, { total: number; count: number }> = {};

    entries.forEach((entry) => {
      const date = new Date(entry.timestamp);
      const weekday = date.getDay().toString();

      if (!weekdayTotals[weekday]) {
        weekdayTotals[weekday] = { total: 0, count: 0 };
      }

      weekdayTotals[weekday].total += entry.mood;
      weekdayTotals[weekday].count += 1;
    });

    // Calculate average mood for each weekday
    let bestDayKey = "";
    let bestMoodAvg = 0;

    weekdays.forEach((day) => {
      const stats = weekdayTotals[day.key];
      if (stats && stats.count > 0) {
        day.avgMood = Math.round((stats.total / stats.count) * 10) / 10;
        day.count = stats.count;

        if (day.avgMood > bestMoodAvg) {
          bestMoodAvg = day.avgMood;
          bestDayKey = day.key;
        }
      }
    });

    // Find the best day
    const bestDay =
      bestDayKey !== "" ? weekdays.find((day) => day.key === bestDayKey) : null;

    // Format data for chart (only include days with entries)
    const chartData = weekdays
      .filter((day) => day.count > 0)
      .map((day) => ({
        name: day.name.substring(0, 3),
        avgMood: day.avgMood,
        fullName: day.name,
        fill: getMoodColor(day.avgMood),
      }));

    return { data: chartData, bestDay };
  };

  const getMoodColor = (mood: number | null) => {
    if (mood === null) return "bg-gray-200";
    if (mood < 1.5) return "#ff7285";
    if (mood < 2.5) return "#ffa59e";
    if (mood < 3.5) return "#ffde7d";
    if (mood < 4.5) return "#a8e6cf";
    return "#b3d0ff";
  };

  // Get mood label based on value
  const getMoodLabel = (mood: number) => {
    if (mood < 1.5) return "Terrible";
    if (mood < 2.5) return "Bad";
    if (mood < 3.5) return "Neutral";
    if (mood < 4.5) return "Good";
    return "Great";
  };

  const { data, bestDay } = getWeekdayStats();

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded shadow border">
          <p className="font-medium">{payload[0].payload.fullName}</p>
          <p>{`Average Mood: ${payload[0].value}`}</p>
          <p>{`Mood Level: ${getMoodLabel(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm border border-pastel-pink mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col space-y-1.5">
          <CardTitle className="text-xl">Mood by Day of Week</CardTitle>
        </div>
        <div className="p-2 bg-secondary/50 rounded-full">
          <CalendarDays className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <>
            <div className="h-[200px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avgMood" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {bestDay && (
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-center font-medium">
                  You are most positive on{" "}
                  <span className="font-bold text-primary">
                    {bestDay.name}s
                  </span>
                  !{" "}
                  <span className="text-sm text-muted-foreground">
                    (Average mood: {bestDay.avgMood} -{" "}
                    {getMoodLabel(bestDay.avgMood)})
                  </span>
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            <p>Not enough data to show mood patterns by day of week</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
