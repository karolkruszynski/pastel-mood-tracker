
import { useEffect } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const { user, login, register, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pastel-pink to-pastel-blue flex items-center justify-center">
            <h1 className="text-3xl font-bold text-white">M</h1>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          MoodPal
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Track your daily moods with ease
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <AuthForm 
          onLogin={login} 
          onRegister={register} 
        />
      </div>
    </div>
  );
};
