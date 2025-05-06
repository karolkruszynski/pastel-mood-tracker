
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { FrownIcon, MehIcon, SmileIcon } from "lucide-react";

interface MoodSelectorProps {
  onMoodSelect: (mood: number, note: string) => void;
}

export const MoodSelector = ({ onMoodSelect }: MoodSelectorProps) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);

  const moods = [
    { value: 1, label: "Terrible", icon: <FrownIcon className="h-8 w-8 text-mood-terrible" />, color: "bg-mood-terrible" },
    { value: 2, label: "Bad", icon: <FrownIcon className="h-8 w-8 text-mood-bad" />, color: "bg-mood-bad" },
    { value: 3, label: "Neutral", icon: <MehIcon className="h-8 w-8 text-mood-neutral" />, color: "bg-mood-neutral" },
    { value: 4, label: "Good", icon: <SmileIcon className="h-8 w-8 text-mood-good" />, color: "bg-mood-good" },
    { value: 5, label: "Great", icon: <SmileIcon className="h-8 w-8 text-mood-great" />, color: "bg-mood-great" },
  ];

  const handleSelectMood = (mood: number) => {
    setSelectedMood(mood);
    setShowNote(true);
  };

  const handleSubmit = () => {
    if (selectedMood === null) {
      toast.error("Please select a mood", {
        duration: 1500,
        closeButton: true,
      });
      return;
    }

    onMoodSelect(selectedMood, note);
    setSelectedMood(null);
    setNote("");
    setShowNote(false);
    
    toast.success("Mood logged successfully!", {
      duration: 1500,
      closeButton: true,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-4">
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, MMM d • h:mm a")}
        </p>
      </div>

      <div className="flex justify-between items-end mb-6 relative py-4">
        <div className="absolute bottom-10 w-full h-1 mood-gradient rounded-full"></div>
        {moods.map((mood) => {
          const isSelected = selectedMood === mood.value;
          return (
            <div 
              key={mood.value} 
              className="flex flex-col items-center"
            >
              <button
                className={`rounded-full p-3 mb-2 transition-all duration-300 hover:scale-110 ${
                  isSelected 
                    ? `ring-4 ring-offset-2 ring-offset-pastel-background ring-${mood.color.split('-')[1]}` 
                    : "hover:ring-2 hover:ring-offset-2 hover:ring-offset-pastel-background hover:ring-gray-200"
                }`}
                onClick={() => handleSelectMood(mood.value)}
                aria-label={`Select ${mood.label} mood`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 
                  ${isSelected ? `border-${mood.color.split('-')[1]} ${mood.color}` : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center justify-center">
                    {mood.icon}
                  </div>
                </div>
              </button>
              <span className={`text-xs font-medium ${
                isSelected ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {mood.label}
              </span>
            </div>
          );
        })}
      </div>
      
      {showNote && (
        <div className="mb-6 animate-fade-in">
          <label className="block text-sm font-medium mb-2">
            Add a note (optional)
          </label>
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
            placeholder="What's on your mind?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      )}

      <Button 
        onClick={handleSubmit}
        disabled={selectedMood === null}
        className="w-full"
      >
        Save mood
      </Button>
    </div>
  );
};
