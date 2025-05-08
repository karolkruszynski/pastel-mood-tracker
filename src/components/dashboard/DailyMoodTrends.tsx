import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodEntry } from "../mood/MoodLog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { format, startOfDay, endOfDay, eachHourOfInterval } from "date-fns";
import { useEffect, useState } from "react";
import { FrownIcon, MehIcon, SmileIcon } from "lucide-react";

interface DailyMoodTrendsProps {
  entries: MoodEntry[];
}

export const DailyMoodTrends = ({ entries }: DailyMoodTrendsProps) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const now = new Date();
    const today = startOfDay(now);
    const endOfToday = endOfDay(today);

    const todaysEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      return startOfDay(entryDate).getTime() === today.getTime();
    });

    const firstEntryTime =
      todaysEntries.length > 0
        ? new Date(
            Math.min(
              ...todaysEntries.map((entry) =>
                new Date(entry.timestamp).getTime()
              )
            )
          )
        : today;

    const hourIntervals = eachHourOfInterval({
      start: firstEntryTime,
      end: endOfToday,
    });

    const initialHourlyData = hourIntervals.map((hour) => ({
      hour: format(hour, "h:mm a"),
      mood: null as number | null,
      time: hour,
      emoji: "",
    }));

    const hourlyData = initialHourlyData.map((hourData) => {
      const hourEntries = todaysEntries.filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        return entryDate.getHours() === new Date(hourData.time).getHours();
      });

      if (hourEntries.length > 0) {
        const averageMood =
          hourEntries.reduce((sum, entry) => sum + entry.mood, 0) /
          hourEntries.length;
        return {
          ...hourData,
          mood: averageMood,
          emoji: getMoodEmoji(averageMood),
        };
      }

      return hourData;
    });

    const currentHour = now.getHours();
    const filteredData = hourlyData.filter(
      (data) => new Date(data.time).getHours() <= currentHour
    );

    setChartData(filteredData);
  }, [entries]);

  // Helper function to get emoji based on mood value
  const getMoodEmoji = (mood: number | null) => {
    if (mood === null) return "";
    if (mood < 1.5) return <FrownIcon className="text-mood-terrible" />;
    if (mood < 2.5) return <FrownIcon className="text-mood-bad" />;
    if (mood < 3.5) return <MehIcon className="text-mood-neutral" />;
    if (mood < 4.5) return <SmileIcon className="text-mood-good" />;
    return <SmileIcon className="text-mood-great" />;
  };

  // Helper function to get mood label
  const getMoodLabel = (mood: number | null) => {
    if (mood === null) return "No data";
    if (mood < 1.5) return "Terrible";
    if (mood < 2.5) return "Bad";
    if (mood < 3.5) return "Neutral";
    if (mood < 4.5) return "Good";
    return "Great";
  };

  // Custom tooltip formatter
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const mood = payload[0].value;

      return (
        <div className="custom-tooltip bg-white p-2 rounded shadow border transform -translate-y-16 min-w-[120px]">
          <p className="font-medium">{label}</p>
          {mood !== null ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center">
                {getMoodEmoji(mood)}
              </div>
              <p>
                {getMoodLabel(mood)} ({mood.toFixed(1)})
              </p>
            </div>
          ) : (
            <p>No data</p>
          )}
        </div>
      );
    }

    return null;
  };

  // Custom tick formatter for Y axis
  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;

    let icon;
    switch (payload.value) {
      case 1:
        icon = <FrownIcon size={16} className="text-mood-terrible" />;
        break;
      case 2:
        icon = <FrownIcon size={16} className="text-mood-bad" />;
        break;
      case 3:
        icon = <MehIcon size={16} className="text-mood-neutral" />;
        break;
      case 4:
        icon = <SmileIcon size={16} className="text-mood-good" />;
        break;
      case 5:
        icon = <SmileIcon size={16} className="text-mood-great" />;
        break;
      default:
        icon = null;
    }

    return (
      <g transform={`translate(${x - 10},${y})`}>
        <foreignObject width={20} height={20} x={-10} y={-10}>
          <div className="flex items-center justify-center h-full">{icon}</div>
        </foreignObject>
      </g>
    );
  };

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm border border-pastel-pink mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Daily Mood Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} dy={10} />
                <YAxis
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tick={<CustomYAxisTick />}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />
                <Tooltip
                  content={customTooltip}
                  cursor={{ strokeDasharray: "3 3" }}
                />
                <ReferenceLine y={3} stroke="#888" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    stroke: "#fff",
                    strokeWidth: 2,
                    fill: "#8884d8",
                  }}
                  connectNulls={true}
                  dot={{
                    stroke: "#8884d8",
                    strokeWidth: 2,
                    r: 4,
                    fill: "#fff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-center">
              <p>No mood entries recorded today yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
