
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useThemes } from "@/contexts/ThemesContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Heart, Circle, Star, Bookmark, Smartphone } from "lucide-react";
import { toast } from "sonner";

interface ThemeOptionProps {
  name: string;
  description: string;
  id: "default" | "minimal" | "colorful" | "classic";
  isActive: boolean;
  onSelect: () => void;
  icons: React.ReactNode;
}

const ThemeOption = ({ name, description, isActive, onSelect, icons }: ThemeOptionProps) => {
  return (
    <div 
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isActive 
          ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
          : "border-border hover:border-primary/50"
      }`}
      onClick={onSelect}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{name}</h3>
          {isActive && (
            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        
        <div className="flex items-center gap-4 mt-2">
          {icons}
        </div>
        
        <Button 
          variant={isActive ? "secondary" : "default"} 
          size="sm" 
          className="mt-2"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {isActive ? "Current Theme" : "Select Theme"}
        </Button>
      </div>
    </div>
  );
};

export const ThemesPage = () => {
  const { iconTheme, setIconTheme } = useThemes();
  const [activeTab, setActiveTab] = useState("icons");

  const handleThemeSelect = (theme: "default" | "minimal" | "colorful" | "classic") => {
    setIconTheme(theme);
    toast.success(`Theme changed to ${theme}`, {
      duration: 2000,
    });
  };

  // Define the icon styles for each theme
  const getIconsByTheme = (theme: string) => {
    switch(theme) {
      case "minimal":
        return (
          <>
            <Heart className="h-6 w-6 stroke-1" />
            <Circle className="h-6 w-6 stroke-1" />
            <Star className="h-6 w-6 stroke-1" />
            <Bookmark className="h-6 w-6 stroke-1" />
            <Smartphone className="h-6 w-6 stroke-1" />
          </>
        );
      case "colorful":
        return (
          <>
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            <Circle className="h-6 w-6 text-blue-500 fill-blue-500" />
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            <Bookmark className="h-6 w-6 text-green-500 fill-green-500" />
            <Smartphone className="h-6 w-6 text-purple-500 fill-purple-500" />
          </>
        );
      case "classic":
        return (
          <>
            <Heart className="h-6 w-6 stroke-2" />
            <Circle className="h-6 w-6 stroke-2" />
            <Star className="h-6 w-6 stroke-2" />
            <Bookmark className="h-6 w-6 stroke-2" />
            <Smartphone className="h-6 w-6 stroke-2" />
          </>
        );
      default: // default theme
        return (
          <>
            <Heart className="h-6 w-6" />
            <Circle className="h-6 w-6" />
            <Star className="h-6 w-6" />
            <Bookmark className="h-6 w-6" />
            <Smartphone className="h-6 w-6" />
          </>
        );
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Appearance</h1>
          <p className="text-muted-foreground">
            Customize how MoodPal looks and feels
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="icons">Icons</TabsTrigger>
          </TabsList>
          
          <TabsContent value="icons">
            <Card>
              <CardHeader>
                <CardTitle>Icon Style</CardTitle>
                <CardDescription>
                  Choose how icons appear throughout the app
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <ThemeOption 
                    name="Default"
                    description="Standard icon style with medium stroke"
                    id="default"
                    isActive={iconTheme === "default"}
                    onSelect={() => handleThemeSelect("default")}
                    icons={getIconsByTheme("default")}
                  />
                  
                  <ThemeOption 
                    name="Minimal"
                    description="Thin stroke icons with a lighter appearance"
                    id="minimal"
                    isActive={iconTheme === "minimal"}
                    onSelect={() => handleThemeSelect("minimal")}
                    icons={getIconsByTheme("minimal")}
                  />
                  
                  <ThemeOption 
                    name="Colorful"
                    description="Filled icons with vibrant colors"
                    id="colorful"
                    isActive={iconTheme === "colorful"}
                    onSelect={() => handleThemeSelect("colorful")}
                    icons={getIconsByTheme("colorful")}
                  />
                  
                  <ThemeOption 
                    name="Classic"
                    description="Bold stroke icons with a traditional look"
                    id="classic"
                    isActive={iconTheme === "classic"}
                    onSelect={() => handleThemeSelect("classic")}
                    icons={getIconsByTheme("classic")}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ThemesPage;
