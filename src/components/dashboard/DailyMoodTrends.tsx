
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodEntry } from "../mood/MoodLog";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid
} from "recharts";
import { format, startOfDay, endOfDay, eachHourOfInterval } from "date-fns";

interface DailyMoodTrendsProps {
  entries: MoodEntry[];
}

export const DailyMoodTrends = ({ entries }: DailyMoodTrendsProps) => {
  // Group entries by hour
  const now = new Date();
  const today = startOfDay(now);
  const endOfToday = endOfDay(today);
  
  // Create array with each hour of the day
  const hourIntervals = eachHourOfInterval({
    start: today,
    end: endOfToday
  });
  
  // Create the data structure for the chart
  const hourlyData = hourIntervals.map(hour => {
    // Filter entries for this hour
    const hourEntries = entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate.getHours() === hour.getHours() && 
             startOfDay(entryDate).getTime() === today.getTime();
    });
    
    // Calculate average mood for this hour
    const averageMood = hourlyData.length > 0
      ? hourEntries.reduce((sum, entry) => sum + entry.mood, 0) / hourEntries.length
      : null;
    
    return {
      hour: format(hour, "ha"),
      mood: averageMood || null,
      time: hour
    };
  });
  
  // Fill in the data with actual entries
  entries.forEach(entry => {
    const entryDate = new Date(entry.timestamp);
    if (startOfDay(entryDate).getTime() === today.getTime()) {
      const hour = entryDate.getHours();
      const hourIndex = hourlyData.findIndex(data => 
        new Date(data.time).getHours() === hour
      );
      
      if (hourIndex !== -1) {
        // If we already have entries for this hour, update the average
        const existingEntries = entries.filter(e => {
          const eDate = new Date(e.timestamp);
          return eDate.getHours() === hour && 
                 startOfDay(eDate).getTime() === today.getTime();
        });
        
        hourlyData[hourIndex].mood = existingEntries.reduce((sum, e) => sum + e.mood, 0) / existingEntries.length;
      }
    }
  });
  
  // Filter out future hours
  const currentHour = now.getHours();
  const filteredHourlyData = hourlyData.filter(data => 
    new Date(data.time).getHours() <= currentHour
  );
  
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
          <p>{mood !== null ? `Mood: ${moodLabel} (${mood.toFixed(1)})` : 'No data'}</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm border border-pastel-pink mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Daily Mood Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          {filteredHourlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={filteredHourlyData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B3D0FF" stopOpacity={0.8} /> {/* Great */}
                    <stop offset="25%" stopColor="#A8E6CF" stopOpacity={0.8} /> {/* Good */}
                    <stop offset="50%" stopColor="#FFDE7D" stopOpacity={0.8} /> {/* Neutral */}
                    <stop offset="75%" stopColor="#FFA59E" stopOpacity={0.8} /> {/* Bad */}
                    <stop offset="100%" stopColor="#FF7285" stopOpacity={0.8} /> {/* Terrible */}
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 12 }} 
                />
                <YAxis 
                  domain={[1, 5]} 
                  ticks={[1, 2, 3, 4, 5]} 
                  tick={{ fontSize: 12 }} 
                />
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <Tooltip content={customTooltip} />
                <ReferenceLine y={3} stroke="#888" strokeDasharray="3 3" />
                <Area 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#8884d8" 
                  fill="url(#moodGradient)"
                  connectNulls={true}
                />
              </AreaChart>
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
