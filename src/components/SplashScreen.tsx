import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity, Scan } from "lucide-react";
import logo from "@/assets/logo.png";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-400 to-green-500 flex flex-col items-center justify-center p-6">
      <div className="text-center animate-fade-in">
        <div className="mb-8 relative">
          <img 
            src={logo} 
            alt="PostureScan Buddy" 
            className="w-32 h-32 mx-auto animate-pulse"
          />
          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse delay-500"></div>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">
          PostureScan Buddy
        </h1>
        
        <p className="text-xl text-white/90 mb-12 font-light">
          Scan. Detect. Improve Posture.
        </p>

        {loading ? (
          <div className="space-y-6">
            <div className="relative w-64 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
              <div className="absolute inset-0 bg-white rounded-full animate-pulse"></div>
            </div>
            <p className="text-white/80 text-sm">Initializing scanning system...</p>
          </div>
        ) : (
          <Button 
            onClick={onComplete}
            size="lg"
            className="min-w-48 bg-white text-blue-600 hover:bg-gray-100"
          >
            <Activity className="mr-2" />
            Get Started
          </Button>
        )}
      </div>

      <div className="absolute bottom-8 text-center">
        <p className="text-white/60 text-sm">
          AI-Powered Posture Analysis
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;