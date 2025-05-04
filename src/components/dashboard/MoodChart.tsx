
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodEntry } from "../mood/MoodLog";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";
import { format, startOfDay, subDays, eachDayOfInterval } from "date-fns";

interface MoodChartProps {
  entries: MoodEntry[];
  days?: number;
  title: string;
}

export const MoodChart = ({ entries, days = 7, title }: MoodChartProps) => {
  const data = useMemo(() => {
    const endDate = startOfDay(new Date());
    const startDate = startOfDay(subDays(endDate, days - 1));
    
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    
    return dateRange.map(date => {
      const dayEntries = entries.filter(entry => 
        startOfDay(new Date(entry.timestamp)).getTime() === date.getTime()
      );
      
      const averageMood = dayEntries.length 
        ? dayEntries.reduce((sum, entry) => sum + entry.mood, 0) / dayEntries.length
        : null;
      
      return {
        date,
        averageMood,
        formattedDate: format(date, "MMM d")
      };
    });
  }, [entries, days]);

  const gradientColors = [
    { offset: "0%", color: "#FF7285" },   // Terrible (1)
    { offset: "25%", color: "#FFA59E" },  // Bad (2)
    { offset: "50%", color: "#FFDE7D" },  // Neutral (3)
    { offset: "75%", color: "#A8E6CF" },  // Good (4)
    { offset: "100%", color: "#B3D0FF" }, // Great (5)
  ];

  const renderLabel = (value: number) => {
    switch (value) {
      case 1: return "Terrible";
      case 2: return "Bad";
      case 3: return "Neutral";
      case 4: return "Good";
      case 5: return "Great";
      default: return "";
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-pastel-pink h-full">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {entries.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-center">
            <p>No mood data available yet.<br />Start tracking your moods!</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  {gradientColors.map(({ offset, color }) => (
                    <stop key={offset} offset={offset} stopColor={color} />
                  ))}
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }} 
              />
              <YAxis 
                domain={[1, 5]} 
                ticks={[1, 2, 3, 4, 5]} 
                tick={{ fontSize: 12 }}
                tickFormatter={renderLabel} 
              />
              <Tooltip 
                formatter={(value: number) => [renderLabel(value), "Mood"]}
                labelFormatter={(value) => `Date: ${value}`}
              />
              <Area 
                type="monotone" 
                dataKey="averageMood"
                stroke="#8884d8"
                fill="url(#moodGradient)"
                activeDot={{ r: 8 }}
                isAnimationActive={true}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
