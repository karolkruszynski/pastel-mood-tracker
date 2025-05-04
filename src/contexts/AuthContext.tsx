
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
} | null;

interface AuthContextType {
  user: User;
  login: (email: string, password: string) => void;
  register: (email: string, password: string, name: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("moodpal_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock login check
      if (email.includes("@") && password.length >= 6) {
        // Check if we already have this user saved
        const savedUsers = JSON.parse(localStorage.getItem("moodpal_users") || "[]");
        const existingUser = savedUsers.find((u: any) => u.email === email);
        
        if (existingUser) {
          // Simple mock password check
          if (existingUser.password === password) {
            const userData = {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email
            };
            setUser(userData);
            localStorage.setItem("moodpal_user", JSON.stringify(userData));
            toast.success(`Welcome back, ${existingUser.name}!`);
            navigate("/");
          } else {
            toast.error("Invalid credentials");
          }
        } else {
          toast.error("User not found");
        }
      } else {
        toast.error("Invalid email or password");
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const register = (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Check if user already exists
      const savedUsers = JSON.parse(localStorage.getItem("moodpal_users") || "[]");
      const existingUser = savedUsers.find((user: any) => user.email === email);
      
      if (existingUser) {
        toast.error("User already exists with this email");
        setIsLoading(false);
        return;
      }
      
      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password // In a real app, NEVER store passwords in localStorage
      };
      
      // Update users array
      savedUsers.push(newUser);
      localStorage.setItem("moodpal_users", JSON.stringify(savedUsers));
      
      // Log user in
      const userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      };
      
      setUser(userData);
      localStorage.setItem("moodpal_user", JSON.stringify(userData));
      toast.success(`Welcome, ${name}!`);
      navigate("/");
      setIsLoading(false);
    }, 1000);
  };

  const logout = () => {
    localStorage.removeItem("moodpal_user");
    setUser(null);
    toast.info("You've been signed out");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
