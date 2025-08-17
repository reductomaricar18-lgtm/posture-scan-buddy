import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebaseClient";
import SplashScreen from "@/components/SplashScreen";
import AuthScreen from "@/components/AuthScreen";
import Dashboard from "@/components/Dashboard";
import ScanInterface from "@/components/ScanInterface";
import ResultsScreen from "@/components/ResultsScreen";
import ReportsScreen from "@/components/ReportsScreen";
import SettingsScreen from "@/components/SettingsScreen";
import ProgressTracker from "@/components/ProgressTracker";
import CameraTest from "@/components/CameraTest";

type Screen = 'splash' | 'auth' | 'dashboard' | 'scan' | 'results' | 'reports' | 'settings' | 'progress' | 'camera-test';

const NAV_KEY = 'posture_nav';

const Index = () => {
  const { currentUser, logout } = useAuth();
  
  // Check for camera test URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const isCameraTest = urlParams.get('test') === 'camera';
  
  const getInitialScreen = () => {
    // If camera test is requested, go directly to camera test
    if (isCameraTest) {
      return 'camera-test';
    }
    
    const saved = localStorage.getItem(NAV_KEY);
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    
    // If user was authenticated and has a saved screen, use it
    // Otherwise, always start with splash
    if (saved && isAuth) {
      return saved as Screen;
    }
    return 'splash';
  };

  const [currentScreen, setCurrentScreen] = useState<Screen>(getInitialScreen());
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  useEffect(() => {
    // Don't save camera-test screen to localStorage
    if (currentScreen !== 'camera-test') {
      localStorage.setItem(NAV_KEY, currentScreen);
    }
  }, [currentScreen]);

  // Save authentication state to localStorage
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);

  // Check authentication status when user changes
  useEffect(() => {
    if (currentUser) {
      setIsAuthenticated(true);
      // Don't auto-redirect to dashboard, let user go through proper flow
      // User must click "Get Started" from splash or go through auth flow
    } else {
      setIsAuthenticated(false);
      // If user is not authenticated and not on splash/auth/camera-test, go to auth
      if (currentScreen !== 'splash' && currentScreen !== 'auth' && currentScreen !== 'camera-test') {
        setCurrentScreen('auth');
      }
    }
  }, [currentUser, currentScreen]);

  const handleSplashComplete = () => {
    // Always go to auth screen first, regardless of authentication status
    // User must explicitly sign in to access the dashboard
    setCurrentScreen('auth');
  };

  const handleBackToSplash = () => {
    setCurrentScreen('splash');
  };

  const handleLogin = () => {
    // User has successfully logged in, now they can access the dashboard
    setIsAuthenticated(true);
    setCurrentScreen('dashboard');
    setSessionStartTime(new Date());
  };

  const handleLogout = async () => {
    try {
      // Log logout activity to Firestore before logging out
      if (currentUser) {
        try {
          const sessionDuration = sessionStartTime 
            ? Math.round((new Date().getTime() - sessionStartTime.getTime()) / 1000) // Duration in seconds
            : null;
            
          await setDoc(doc(db, "userActivity", `${currentUser.uid}_${Date.now()}`), {
            userId: currentUser.uid,
            email: currentUser.email,
            action: "logout",
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ipAddress: "client-side", // Note: Real IP would need backend
            lastScreen: currentScreen, // Track which screen user was on
            sessionDuration: sessionDuration, // How long user was logged in (in seconds)
          });
        } catch (logError) {
          console.error("Error logging logout activity:", logError);
          // Don't block logout if logging fails
        }
      }
      
      await logout();
      setIsAuthenticated(false);
      setCurrentScreen('splash');
      setSessionStartTime(null);
      // Clear localStorage on logout
      localStorage.removeItem(NAV_KEY);
      localStorage.removeItem('isAuthenticated');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleStartScan = () => {
    setCurrentScreen('scan');
  };

  const handleScanComplete = (image: string, analysisData: any) => {
    setCapturedImage(image);
    setCurrentScreen('results');
  };

  const handleViewReports = () => {
    setCurrentScreen('reports');
  };

  const handleSettings = () => {
    setCurrentScreen('settings');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  const handleViewRecommendations = () => {
    handleBackToDashboard();
  };

  const handleSaveReport = () => {
    handleBackToDashboard();
  };

  const handleViewProgress = () => {
    setCurrentScreen('progress');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'camera-test':
        return <CameraTest />;
      case 'splash':
        return <SplashScreen onComplete={handleSplashComplete} />;
      case 'auth':
        return (
          <AuthScreen 
            onLogin={handleLogin} 
            onBack={handleBackToSplash}
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            onStartScan={handleStartScan}
            onViewReports={handleViewReports}
            onSettings={handleSettings}
            onViewProgress={handleViewProgress}
          />
        );
      case 'progress':
        return (
          <ProgressTracker onBack={handleBackToDashboard} />
        );
      case 'scan':
        return (
          <ScanInterface 
            onBack={handleBackToDashboard}
            onScanComplete={handleScanComplete}
          />
        );
      case 'results':
        return (
          <ResultsScreen 
            image={capturedImage || ''}
            onBack={handleBackToDashboard}
            onViewRecommendations={handleViewRecommendations}
            onSaveReport={handleSaveReport}
          />
        );
      case 'reports':
        return (
          <ReportsScreen 
            onBack={handleBackToDashboard}
          />
        );
      case 'settings':
        return (
          <SettingsScreen 
            onBack={handleBackToDashboard}
            onLogout={handleLogout}
          />
        );
      default:
        return <SplashScreen onComplete={handleSplashComplete} />;
    }
  };

  return (
    <div className="font-sans antialiased">
      {renderScreen()}
    </div>
  );
};

export default Index;