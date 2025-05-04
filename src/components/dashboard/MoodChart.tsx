
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodEntry } from "../mood/MoodLog";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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

  const getMoodLabel = (value: number) => {
    switch (value) {
      case 1: return "Terrible";
      case 2: return "Bad";
      case 3: return "Neutral";
      case 4: return "Good";
      case 5: return "Great";
      default: return "";
    }
  };

  // Function to determine color from mood value
  const getMoodColor = (value: number | null) => {
    if (value === null) return "#ccc";
    if (value < 1.5) return "#FF7285"; // Terrible
    if (value < 2.5) return "#FFA59E"; // Bad
    if (value < 3.5) return "#FFDE7D"; // Neutral
    if (value < 4.5) return "#A8E6CF"; // Good
    return "#B3D0FF"; // Great
  };

  // Custom tooltip to display mood label
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const mood = payload[0].value;
      
      return (
        <div className="custom-tooltip bg-white p-2 rounded shadow border">
          <p className="font-medium">{label}</p>
          <p>{mood !== null ? `Mood: ${getMoodLabel(Math.round(mood))} (${mood.toFixed(1)})` : 'No data'}</p>
        </div>
      );
    }
  
    return null;
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
                  <stop offset="5%" stopColor="#B3D0FF" stopOpacity={0.8} /> {/* Great */}
                  <stop offset="25%" stopColor="#A8E6CF" stopOpacity={0.8} /> {/* Good */}
                  <stop offset="50%" stopColor="#FFDE7D" stopOpacity={0.8} /> {/* Neutral */}
                  <stop offset="75%" stopColor="#FFA59E" stopOpacity={0.8} /> {/* Bad */}
                  <stop offset="95%" stopColor="#FF7285" stopOpacity={0.8} /> {/* Terrible */}
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
                tickFormatter={getMoodLabel} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="averageMood"
                stroke="#8884d8"
                fill="url(#moodGradient)"
                activeDot={{ r: 8 }}
                isAnimationActive={true}
                animationDuration={1000}
                connectNulls={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
