
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodEntry } from "../mood/MoodLog";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from "recharts";
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

  const getMoodEmoji = (mood: number | null) => {
    if (mood === null) return "";
    if (mood < 1.5) return "😭";
    if (mood < 2.5) return "☹️";
    if (mood < 3.5) return "😐";
    if (mood < 4.5) return "🙂";
    return "😄";
  };

  // Custom tooltip to display mood label
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const mood = payload[0].value;
      
      return (
        <div className="custom-tooltip bg-white p-2 rounded shadow border">
          <p className="font-medium">{label}</p>
          <p>
            {mood !== null ? (
              <>
                Mood: {getMoodLabel(Math.round(mood))} {getMoodEmoji(mood)} ({mood.toFixed(1)})
              </>
            ) : (
              'No data'
            )}
          </p>
        </div>
      );
    }
  
    return null;
  };

  // Find the last non-null data point
  const lastDataPoint = useMemo(() => {
    const reversedData = [...data].reverse();
    return reversedData.find(point => point.averageMood !== null);
  }, [data]);

  // Custom dot component to show emoji for the last point
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    
    // Check if this is the last data point with a valid mood
    if (lastDataPoint && payload.date.getTime() === lastDataPoint.date.getTime() && payload.averageMood !== null) {
      return (
        <text 
          x={cx} 
          y={cy} 
          textAnchor="middle" 
          dominantBaseline="central"
          fontSize="22"
        >
          {getMoodEmoji(payload.averageMood)}
        </text>
      );
    }
    
    // Return null for other points to hide the default dots
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
                {/* Define gradient for each mood level */}
                <linearGradient id="colorMood1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF7285" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FF7285" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorMood2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFA59E" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FFA59E" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorMood3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFDE7D" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FFDE7D" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorMood4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A8E6CF" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#A8E6CF" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorMood5" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B3D0FF" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#B3D0FF" stopOpacity={0.2} />
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
              
              {/* Reference lines for different moods with their respective colors */}
              <ReferenceLine y={1} stroke="#FF7285" strokeWidth={1} strokeDasharray="3 3">
                <Label value="Terrible" position="right" fill="#FF7285" />
              </ReferenceLine>
              <ReferenceLine y={2} stroke="#FFA59E" strokeWidth={1} strokeDasharray="3 3">
                <Label value="Bad" position="right" fill="#FFA59E" />
              </ReferenceLine>
              <ReferenceLine y={3} stroke="#FFDE7D" strokeWidth={1} strokeDasharray="3 3">
                <Label value="Neutral" position="right" fill="#FFDE7D" />
              </ReferenceLine>
              <ReferenceLine y={4} stroke="#A8E6CF" strokeWidth={1} strokeDasharray="3 3">
                <Label value="Good" position="right" fill="#A8E6CF" />
              </ReferenceLine>
              <ReferenceLine y={5} stroke="#B3D0FF" strokeWidth={1} strokeDasharray="3 3">
                <Label value="Great" position="right" fill="#B3D0FF" />
              </ReferenceLine>
              
              {/* Color-coded areas for different mood ranges */}
              <Area 
                type="monotone" 
                dataKey="averageMood"
                stroke="#8884d8"
                strokeWidth={2}
                isAnimationActive={true}
                animationDuration={1000}
                connectNulls={true}
                dot={<CustomDot />}
                activeDot={{ r: 8, fill: "#8884d8" }}
                fill="url(#colorMood3)" // Default fill
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
