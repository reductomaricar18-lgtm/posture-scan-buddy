import { useAuth } from "../contexts/AuthContext";
import { useUserData } from "../hooks/useUserData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Camera, 
  FileText, 
  TrendingUp, 
  Brain, 
  Settings, 
  Scan,
  Activity,
  Calendar,
  Award
} from "lucide-react";

interface DashboardProps {
  onStartScan: () => void;
  onViewReports: () => void;
  onSettings: () => void;
  onViewProgress: () => void;
}

const Dashboard = ({ onStartScan, onViewReports, onSettings, onViewProgress }: DashboardProps) => {
  const { currentUser } = useAuth();
  const { userData, scans, loading } = useUserData();
  const recentScans = scans.slice(0, 3); // Show last 3 scans

  // Function to get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return "Good Morning!";
    } else if (hour >= 12 && hour < 17) {
      return "Good Afternoon!";
    } else if (hour >= 17 && hour < 22) {
      return "Good Evening!";
    } else {
      return "Good Night!";
    }
  };

  // Function to get time-based message
  const getTimeBasedMessage = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return "Ready for your posture check?";
    } else if (hour >= 12 && hour < 17) {
      return "Time for a posture break?";
    } else if (hour >= 17 && hour < 22) {
      return "How's your posture today?";
    } else {
      return "Late night posture check?";
    }
  };

  // Function to get time-based health tip
  const getTimeBasedTip = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      // Morning tips - Starting the day right
      const morningTips = [
        "Start your day with gentle neck rolls and shoulder shrugs to wake up your muscles and prepare for good posture.",
        "Set up your workspace ergonomically before you begin work - adjust your monitor to eye level and feet flat on the floor.",
        "Take 5 deep breaths while sitting tall with your shoulders back. This activates your core and improves spinal alignment.",
        "Do a quick posture check in the mirror - are your ears over your shoulders and shoulders over your hips?",
        "Begin your morning with a wall angel exercise: stand against a wall and slide your arms up and down like making snow angels."
      ];
      return morningTips[Math.floor(Math.random() * morningTips.length)];
    } else if (hour >= 12 && hour < 17) {
      // Afternoon tips - Combating midday slouch
      const afternoonTips = [
        "Take micro-breaks every 30 minutes to stretch your neck and shoulders. This helps prevent forward head posture.",
        "Combat afternoon slouch by doing doorway chest stretches - place your forearm on a doorframe and gently lean forward.",
        "Reset your posture: sit back in your chair, engage your core, and imagine a string pulling the top of your head toward the ceiling.",
        "Try the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds while rolling your shoulders back.",
        "Stand up and do 10 gentle backbends by placing your hands on your lower back and arching slightly backward."
      ];
      return afternoonTips[Math.floor(Math.random() * afternoonTips.length)];
    } else if (hour >= 17 && hour < 22) {
      // Evening tips - Unwinding and recovery
      const eveningTips = [
        "End your workday with cat-cow stretches to release tension from your spine and improve flexibility.",
        "Practice chin tucks while watching TV: gently pull your chin back to strengthen deep neck muscles and counter forward head posture.",
        "Do gentle spinal twists while seated - place one hand behind you and slowly rotate your torso to release daily tension.",
        "Try the wall slide exercise: stand with your back against a wall and slowly slide up and down to strengthen your upper back.",
        "Spend 5 minutes doing child's pose or gentle back extensions to decompress your spine after a long day."
      ];
      return eveningTips[Math.floor(Math.random() * eveningTips.length)];
    } else {
      // Night tips - Preparing for rest and recovery
      const nightTips = [
        "Before bed, do gentle neck stretches and shoulder rolls to release the day's tension and prepare for restorative sleep.",
        "Practice deep breathing while lying flat - this helps align your spine and activates your parasympathetic nervous system.",
        "Try sleeping on your back or side with proper pillow support to maintain spinal alignment throughout the night.",
        "Do a quick body scan: consciously relax your jaw, shoulders, and back muscles to release accumulated tension.",
        "Consider gentle yoga poses like legs-up-the-wall to improve circulation and help your body recover from daily postural stress."
      ];
      return nightTips[Math.floor(Math.random() * nightTips.length)];
    }
  };

  // Function to get time-based tip title
  const getTimeBasedTipTitle = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return "Morning Posture Tip";
    } else if (hour >= 12 && hour < 17) {
      return "Afternoon Break Tip";
    } else if (hour >= 17 && hour < 22) {
      return "Evening Recovery Tip";
    } else {
      return "Night Wellness Tip";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{getTimeBasedGreeting()}</h1>
            <p className="text-muted-foreground">{getTimeBasedMessage()}</p>
            {currentUser && (
              <p className="text-sm text-muted-foreground">Welcome, {userData?.name || currentUser.email}</p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onSettings}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Primary Scan Button */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-green-500/10 border-blue-500/20">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto animate-scan-pulse">
                <Scan className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Start Posture Scan</h2>
            <p className="text-muted-foreground mb-4">
              Get instant AI-powered posture analysis
            </p>
            <Button onClick={onStartScan} size="lg" className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90">
              <Camera className="mr-2" />
              Start Scan
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">{userData?.totalScans || 0}</span>
                <span className="text-sm text-muted-foreground">scans</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold">{userData?.averageScore || 0}</span>
                <span className="text-sm text-muted-foreground">avg</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Recent Scans
            </CardTitle>
            <CardDescription>Your latest posture assessments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentScans.length === 0 ? (
              <div className="text-center text-muted-foreground">No scan history yet.</div>
            ) : (
              recentScans.map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{scan.score}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Scan #{scan.id.slice(-4)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{scan.score}/100</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={onViewReports} className="h-16 flex-col">
            <FileText className="h-5 w-5 mb-1" />
            <span className="text-xs">My Reports</span>
          </Button>
          <Button variant="outline" onClick={onViewProgress} className="h-16 flex-col">
            <TrendingUp className="h-5 w-5 mb-1" />
            <span className="text-xs">Progress</span>
          </Button>
        </div>

        {/* Health Tip */}
        <Card className="bg-gradient-to-r from-green-500/10 to-green-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Brain className="mr-2 h-4 w-4 text-green-500" />
              {getTimeBasedTipTitle()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {getTimeBasedTip()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;