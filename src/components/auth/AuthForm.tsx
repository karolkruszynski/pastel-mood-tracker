
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface AuthFormProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string, name: string) => void;
}

export const AuthForm = ({ onLogin, onRegister }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email.trim() === "" || password.trim() === "") {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (isLogin) {
      onLogin(email, password);
    } else {
      if (name.trim() === "") {
        toast({
          title: "Missing information",
          description: "Please provide your name.",
          variant: "destructive",
        });
        return;
      }
      onRegister(email, password, name);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-pastel-pink border">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">
          {isLogin ? "Welcome Back" : "Create Account"}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {isLogin 
            ? "Enter your credentials to access your account" 
            : "Enter your information to create an account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-pastel-pink focus:border-primary"
              />
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-pastel-pink focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-pastel-pink focus:border-primary"
            />
          </div>
          <Button type="submit" className="w-full">
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button 
          variant="ghost" 
          className="w-full text-xs hover:bg-transparent hover:text-primary"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin 
            ? "Don't have an account? Sign up" 
            : "Already have an account? Sign in"}
        </Button>
      </CardFooter>
    </Card>
  );
};
