
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodEntry } from "../mood/MoodLog";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { format, startOfDay, subDays, eachDayOfInterval } from "date-fns";
import { FrownIcon, MehIcon, SmileIcon } from "lucide-react";

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

  const getMoodLabel = (mood: number) => {
    switch (mood) {
      case 1: return "Terrible";
      case 2: return "Bad";
      case 3: return "Neutral";
      case 4: return "Good";
      case 5: return "Great";
      default: return "";
    }
  };

  // Custom tooltip to display mood label
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const mood = payload[0].value;
      
      return (
        <div className="custom-tooltip bg-white p-2 rounded shadow border transform -translate-y-16">
          <p className="font-medium">{label}</p>
          <p>
            {mood !== null ? (
              <div className="flex items-center gap-2">
                {renderMoodIcon(mood)}
                <span>{getMoodLabel(Math.round(mood))} ({mood.toFixed(1)})</span>
              </div>
            ) : (
              'No data'
            )}
          </p>
        </div>
      );
    }
  
    return null;
  };

  // Helper function to render the appropriate icon based on mood value
  const renderMoodIcon = (mood: number | null) => {
    if (mood === null) return null;
    if (mood < 1.5) return <FrownIcon size={16} className="text-mood-terrible" />;
    if (mood < 2.5) return <FrownIcon size={16} className="text-mood-bad" />;
    if (mood < 3.5) return <MehIcon size={16} className="text-mood-neutral" />;
    if (mood < 4.5) return <SmileIcon size={16} className="text-mood-good" />;
    return <SmileIcon size={16} className="text-mood-great" />;
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
      const IconComponent = getIconComponent(payload.averageMood);
      const colorClass = getIconColorClass(payload.averageMood);
      
      return (
        <foreignObject 
          x={cx - 12} 
          y={cy - 12} 
          width={24} 
          height={24}
        >
          <div className="flex items-center justify-center h-full">
            <IconComponent className={`h-6 w-6 ${colorClass}`} />
          </div>
        </foreignObject>
      );
    }
    
    // Return null for other points to hide the default dots
    return null;
  };

  const getIconComponent = (mood: number) => {
    if (mood < 1.5) return FrownIcon;
    if (mood < 2.5) return FrownIcon;
    if (mood < 3.5) return MehIcon;
    if (mood < 4.5) return SmileIcon;
    return SmileIcon;
  };

  const getIconColorClass = (mood: number) => {
    if (mood < 1.5) return "text-mood-terrible";
    if (mood < 2.5) return "text-mood-bad";
    if (mood < 3.5) return "text-mood-neutral";
    if (mood < 4.5) return "text-mood-good";
    return "text-mood-great";
  };

  // Custom tick formatter for Y axis
  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    
    let icon;
    switch(payload.value) {
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
          <div className="flex items-center justify-center h-full">
            {icon}
          </div>
        </foreignObject>
      </g>
    );
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
                tick={<CustomYAxisTick />}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              
              {/* Reference lines for different moods with their respective colors */}
              <ReferenceLine y={1} stroke="#FF7285" strokeWidth={1} strokeDasharray="3 3" />
              <ReferenceLine y={2} stroke="#FFA59E" strokeWidth={1} strokeDasharray="3 3" />
              <ReferenceLine y={3} stroke="#FFDE7D" strokeWidth={1} strokeDasharray="3 3" />
              <ReferenceLine y={4} stroke="#A8E6CF" strokeWidth={1} strokeDasharray="3 3" />
              <ReferenceLine y={5} stroke="#B3D0FF" strokeWidth={1} strokeDasharray="3 3" />
              
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
