
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { Menu, Heart } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  isLoading: boolean;
}

export const Header = ({ user, onLogout, isLoading }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "History", path: "/history" },
    { name: "Achievements", path: "/achievements" },
  ];

  const closeDrawer = () => setIsOpen(false);

  // Get display name from user metadata or email
  const displayName = user
    ? user.user_metadata?.username ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User"
    : null;

  return (
    <header className="py-4 px-4 md:px-6 border-b border-pastel-pink bg-white/60 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl">MoodPal</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {user &&
            navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Hi, {displayName}</span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                Sign Out
              </Button>
            </div>
          )}
          {!isLoading && !user && (
            <Link to="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </nav>

        {/* Mobile navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[250px] bg-white">
            <SheetHeader className="mb-4">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-3">
              {user &&
                navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`text-sm font-medium py-2 px-3 rounded-md hover:bg-secondary transition-colors ${
                      location.pathname === item.path
                        ? "bg-secondary text-primary"
                        : ""
                    }`}
                    onClick={closeDrawer}
                  >
                    {item.name}
                  </Link>
                ))}
              <div className="mt-4 pt-4 border-t border-gray-100">
                {user ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-3">
                      Signed in as {displayName}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        closeDrawer();
                        onLogout();
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link to="/login" onClick={closeDrawer}>
                    <Button className="w-full">Sign In</Button>
                  </Link>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
