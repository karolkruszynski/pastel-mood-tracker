
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
  CartesianGrid
} from "recharts";
import { format, startOfDay, endOfDay, eachHourOfInterval } from "date-fns";
import { useEffect, useState } from "react";

interface DailyMoodTrendsProps {
  entries: MoodEntry[];
}

export const DailyMoodTrends = ({ entries }: DailyMoodTrendsProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    // Group entries by hour
    const now = new Date();
    const today = startOfDay(now);
    const endOfToday = endOfDay(today);
    
    // Create array with each hour of the day
    const hourIntervals = eachHourOfInterval({
      start: today,
      end: endOfToday
    });
    
    // Initialize hourly data with null mood values
    const initialHourlyData = hourIntervals.map(hour => ({
      hour: format(hour, "h:mm a"),
      mood: null as number | null,
      time: hour,
      emoji: ""
    }));
    
    // Process the entries to calculate average mood per hour
    const hourlyData = initialHourlyData.map(hourData => {
      const hourEntries = entries.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate.getHours() === new Date(hourData.time).getHours() && 
               startOfDay(entryDate).getTime() === today.getTime();
      });
      
      // Calculate average mood for this hour if entries exist
      if (hourEntries.length > 0) {
        const averageMood = hourEntries.reduce((sum, entry) => sum + entry.mood, 0) / hourEntries.length;
        return {
          ...hourData,
          mood: averageMood,
          emoji: getMoodEmoji(averageMood)
        };
      }
      
      // Return original data if no entries for this hour
      return hourData;
    });
    
    // Filter out future hours
    const currentHour = now.getHours();
    const filteredData = hourlyData.filter(data => 
      new Date(data.time).getHours() <= currentHour
    );
    
    setChartData(filteredData);
  }, [entries]);
  
  // Helper function to get emoji based on mood value
  const getMoodEmoji = (mood: number | null) => {
    if (mood === null) return "";
    if (mood < 1.5) return "😭";
    if (mood < 2.5) return "☹️";
    if (mood < 3.5) return "😐";
    if (mood < 4.5) return "🙂";
    return "😄";
  };
  
  // Custom tooltip formatter
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const mood = payload[0].value;
      let moodLabel = "No data";
      
      if (mood !== null) {
        if (mood < 1.5) moodLabel = "Terrible";
        else if (mood < 2.5) moodLabel = "Bad";
        else if (mood < 3.5) moodLabel = "Neutral";
        else if (mood < 4.5) moodLabel = "Good";
        else moodLabel = "Great";
      }
      
      return (
        <div className="custom-tooltip bg-white p-2 rounded shadow border">
          <p className="font-medium">{label}</p>
          <p>{mood !== null ? `${payload[0].payload.emoji} ${moodLabel} (${mood.toFixed(1)})` : 'No data'}</p>
        </div>
      );
    }
    
    return null;
  };
  
  // Color mapping for the mood line
  const moodColors = {
    stroke: "#8884d8",
    strokeWidth: 2,
    activeDot: { r: 8, stroke: "#fff", strokeWidth: 2 }
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
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 12 }} 
                />
                <YAxis 
                  domain={[1, 5]} 
                  ticks={[1, 2, 3, 4, 5]} 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(value) => {
                    switch(value) {
                      case 1: return '😭';
                      case 2: return '☹️';
                      case 3: return '😐';
                      case 4: return '🙂';
                      case 5: return '😄';
                      default: return '';
                    }
                  }}
                />
                <Tooltip content={customTooltip} />
                <ReferenceLine y={3} stroke="#888" strokeDasharray="3 3" label="Neutral" />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#8884d8"
                  strokeWidth={2} 
                  activeDot={{ r: 8, stroke: "#fff", strokeWidth: 2 }}
                  connectNulls={true}
                  dot={{ 
                    stroke: '#8884d8',
                    strokeWidth: 2,
                    r: 4,
                    fill: '#fff'
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
