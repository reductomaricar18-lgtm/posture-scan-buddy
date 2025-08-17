import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  Calendar,
  Activity,
  Sparkles,
  CheckCircle,
  Clock,
  Trophy,
  Heart,
  BarChart3,
  AlertCircle,
  Repeat,
  Timer,
  Play,
  Pause,
  Zap
} from "lucide-react";

interface ProgressTrackerProps {
  onBack: () => void;
}

const ProgressTracker = ({ onBack }: ProgressTrackerProps) => {
  const [clickedFeature, setClickedFeature] = useState<string | null>(null);
  const [clickedCondition, setClickedCondition] = useState<string | null>(null);
  const [clickedStep, setClickedStep] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  } | null>(null);

  const showModal = (title: string, description: string, icon: React.ReactNode, color: string) => {
    setModalContent({ title, description, icon, color });
    setModalOpen(true);
  };

  const handleFeatureClick = (title: string) => {
    setClickedFeature(title);
    setTimeout(() => setClickedFeature(null), 2000);
    
    switch (title) {
      case "Exercise Routines":
        showModal(
          "Exercise Routines",
          "No active routines yet. Complete a posture scan to receive personalized exercise recommendations based on your detected conditions! Each routine is tailored to address specific posture issues with step-by-step instructions.",
          <Activity className="h-8 w-8" />,
          "from-emerald-500 to-green-600"
        );
        break;
      case "Daily Check-ins":
        showModal(
          "Daily Check-ins",
          "No activities to track yet. After your scan, you'll be able to mark completed exercises and monitor your consistency! Build healthy habits with our easy-to-use daily tracking system.",
          <CheckCircle className="h-8 w-8" />,
          "from-blue-500 to-cyan-600"
        );
        break;
      case "Progress Analytics":
        showModal(
          "Progress Analytics",
          "No progress data available. Complete exercises regularly to see visual charts of your improvement over time! Track trends, consistency, and measure your posture health improvements.",
          <TrendingUp className="h-8 w-8" />,
          "from-purple-500 to-pink-600"
        );
        break;
      case "Milestone Rewards":
        showModal(
          "Milestone Rewards",
          "No achievements unlocked yet. Start tracking your recommended actions to earn badges and rewards for consistency! Celebrate your progress with our gamified achievement system.",
          <Trophy className="h-8 w-8" />,
          "from-orange-500 to-red-600"
        );
        break;
    }
  };

  const handleConditionClick = (condition: string) => {
    setClickedCondition(condition);
    setTimeout(() => setClickedCondition(null), 2000);
    
    const conditionDetails = {
      "Forward Head Posture": "This common condition occurs when your head extends forward beyond your shoulders. After your posture scan, you'll receive specific exercises like neck stretches, chin tucks, and upper trap stretches to address this issue.",
      "Rounded Shoulders": "This condition involves shoulders rolling forward, often from prolonged sitting or poor posture habits. Your personalized routine will include chest stretches, shoulder blade squeezes, and wall slides to correct this alignment.",
      "Anterior Pelvic Tilt": "This involves the pelvis tilting forward, creating an exaggerated lower back curve. Targeted exercises include hip flexor stretches, core strengthening, and glute activation to restore proper pelvic alignment."
    };
    
    showModal(
      condition,
      `${conditionDetails[condition as keyof typeof conditionDetails]} This is an example condition - your actual scan will detect your specific posture issues!`,
      <Target className="h-8 w-8" />,
      "from-indigo-500 to-purple-600"
    );
  };

  const handleStepClick = (step: string, title: string) => {
    setClickedStep(step);
    setTimeout(() => setClickedStep(null), 2000);
    
    const stepDetails = {
      "1": {
        title: "Scan Analysis",
        description: "Complete a posture scan to let our AI analyze your posture and detect any conditions that need attention! Our advanced algorithms identify misalignments, muscle imbalances, and postural deviations with high accuracy.",
        icon: <Play className="h-8 w-8" />,
        color: "from-blue-500 to-indigo-600"
      },
      "2": {
        title: "Get Recommendations",
        description: "Based on your scan results, receive personalized exercise routines tailored to your specific conditions! Each recommendation is evidence-based and designed to address your unique posture challenges.",
        icon: <Target className="h-8 w-8" />,
        color: "from-green-500 to-emerald-600"
      },
      "3": {
        title: "Daily Tracking",
        description: "Mark completed exercises daily and build healthy habits with our easy-to-use tracking system! Set reminders, track streaks, and monitor your consistency with intuitive progress indicators.",
        icon: <Calendar className="h-8 w-8" />,
        color: "from-purple-500 to-pink-600"
      },
      "4": {
        title: "Monitor Progress",
        description: "View detailed metrics and trends showing your improvement over time with visual charts and analytics! Track your posture scores, exercise completion rates, and overall health improvements.",
        icon: <TrendingUp className="h-8 w-8" />,
        color: "from-orange-500 to-red-600"
      }
    };
    
    const details = stepDetails[step as keyof typeof stepDetails];
    showModal(details.title, details.description, details.icon, details.color);
  };

  const handleStatsClick = (statType: string) => {
    const statsDetails = {
      "conditions": {
        title: "Active Conditions: 0 Detected",
        description: "Complete a posture scan to identify conditions that need attention and start tracking! Our AI will analyze your posture and detect issues like forward head posture, rounded shoulders, or pelvic tilts.",
        icon: <AlertCircle className="h-8 w-8" />,
        color: "from-red-500 to-pink-600"
      },
      "actions": {
        title: "Completed Actions: 0 Exercises",
        description: "After receiving recommendations, track your daily exercises and activities here! Each completed action brings you closer to better posture and improved health.",
        icon: <CheckCircle className="h-8 w-8" />,
        color: "from-blue-500 to-cyan-600"
      },
      "streak": {
        title: "Current Streak: 0 Days",
        description: "Build consistency by completing your recommended actions daily to maintain your streak! Consistency is key to seeing lasting improvements in your posture health.",
        icon: <Zap className="h-8 w-8" />,
        color: "from-green-500 to-emerald-600"
      },
      "score": {
        title: "Progress Score: Not Available",
        description: "Your improvement percentage will be calculated based on completed actions and consistency! Track your overall progress with a comprehensive score that reflects your posture health journey.",
        icon: <BarChart3 className="h-8 w-8" />,
        color: "from-purple-500 to-violet-600"
      }
    };
    
    const details = statsDetails[statType as keyof typeof statsDetails];
    showModal(details.title, details.description, details.icon, details.color);
  };

  const trackingFeatures = [
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Exercise Routines",
      description: "Track daily exercises based on detected conditions",
      onClick: () => handleFeatureClick("Exercise Routines")
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Daily Check-ins",
      description: "Mark completed activities and monitor consistency",
      onClick: () => handleFeatureClick("Daily Check-ins")
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Progress Analytics",
      description: "Visual progress tracking and improvement metrics",
      onClick: () => handleFeatureClick("Progress Analytics")
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Milestone Rewards",
      description: "Earn achievements for completing recommended actions",
      onClick: () => handleFeatureClick("Milestone Rewards")
    }
  ];

  const sampleConditions = [
    {
      condition: "Forward Head Posture",
      actions: ["Neck stretches", "Chin tucks", "Upper trap stretches"],
      duration: "7-14 days",
      color: "from-red-400 to-pink-500",
      onClick: () => handleConditionClick("Forward Head Posture")
    },
    {
      condition: "Rounded Shoulders",
      actions: ["Chest stretches", "Shoulder blade squeezes", "Wall slides"],
      duration: "10-21 days",
      color: "from-blue-400 to-indigo-500",
      onClick: () => handleConditionClick("Rounded Shoulders")
    },
    {
      condition: "Anterior Pelvic Tilt",
      actions: ["Hip flexor stretches", "Core strengthening", "Glute activation"],
      duration: "14-28 days",
      color: "from-green-400 to-emerald-500",
      onClick: () => handleConditionClick("Anterior Pelvic Tilt")
    }
  ];

  const mockStats = [
    { label: "Active Conditions", value: "0", unit: "detected", color: "from-orange-400 to-red-500", type: "conditions" },
    { label: "Completed Actions", value: "0", unit: "exercises", color: "from-blue-400 to-purple-500", type: "actions" },
    { label: "Current Streak", value: "0", unit: "days", color: "from-green-400 to-emerald-500", type: "streak" },
    { label: "Progress Score", value: "--", unit: "%", color: "from-pink-400 to-rose-500", type: "score" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200/50 z-10">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <Button variant="ghost" onClick={onBack} className="hover:bg-emerald-100/50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="font-semibold text-gray-800">Progress Tracker</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Empty State Hero Section */}
        <div className="text-center py-8 px-4">
          <div className="relative mb-6">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-emerald-100 rounded-full animate-pulse opacity-20"></div>
              <div className="absolute w-24 h-24 bg-blue-100 rounded-full animate-ping opacity-30"></div>
              <div className="absolute w-16 h-16 bg-purple-100 rounded-full animate-bounce opacity-40"></div>
            </div>
            
            {/* Main Icon */}
            <div className="relative z-10 w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="h-10 w-10 text-white" />
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-spin" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No Active Tracking
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Complete a posture scan to receive personalized recommendations and start tracking your progress with targeted exercises and activities.
          </p>
        </div>

        {/* Progress Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {mockStats.map((stat, index) => (
            <Card 
              key={index} 
              className="bg-white/70 backdrop-blur-sm border-gray-200/50 hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer"
              onClick={() => handleStatsClick(stat.type)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-700 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
                {stat.unit && (
                  <div className="text-xs text-gray-500 mt-1">{stat.unit}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tracking Features */}
        <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg text-gray-800 flex items-center justify-center">
              <Target className="mr-2 h-5 w-5 text-emerald-500" />
              Progress Tracking Features
            </CardTitle>
            <CardDescription className="text-gray-600">
              Available after your first posture scan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {trackingFeatures.map((feature, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`flex items-start space-x-3 p-3 rounded-lg hover:bg-emerald-50/50 transition-all duration-200 group w-full h-auto justify-start ${
                  clickedFeature === feature.title ? 'bg-emerald-100 scale-95' : ''
                }`}
                onClick={feature.onClick}
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-lg flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-200">
                  {clickedFeature === feature.title ? <CheckCircle className="h-6 w-6" /> : feature.icon}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="font-medium text-gray-800 text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {feature.description}
                  </p>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Sample Conditions & Actions */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-blue-500" />
              Common Conditions & Actions
            </CardTitle>
            <CardDescription className="text-gray-600">
              Examples of what you might track
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sampleConditions.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`p-4 rounded-lg bg-white/50 border border-gray-200/50 w-full h-auto hover:bg-white/80 transition-all duration-200 ${
                  clickedCondition === item.condition ? 'bg-blue-100 scale-95' : ''
                }`}
                onClick={item.onClick}
              >
                <div className="w-full">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-800 text-sm text-left">{item.condition}</h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <Timer className="h-3 w-3 mr-1" />
                      {item.duration}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {item.actions.map((action, actionIndex) => (
                      <div key={actionIndex} className="flex items-center space-x-2 text-xs text-gray-600 text-left">
                        <div className={`w-2 h-2 bg-gradient-to-r ${item.color} rounded-full`}></div>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200/50">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 flex items-center">
              <Repeat className="mr-2 h-5 w-5 text-indigo-500" />
              How Progress Tracking Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { step: "1", title: "Scan Analysis", description: "AI detects posture conditions from your scan" },
                { step: "2", title: "Get Recommendations", description: "Receive personalized exercise routines" },
                { step: "3", title: "Daily Tracking", description: "Mark completed exercises and activities" },
                { step: "4", title: "Monitor Progress", description: "View improvement metrics and trends" }
              ].map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={`flex items-start space-x-3 p-3 rounded-lg bg-white/50 w-full h-auto justify-start hover:bg-white/80 transition-all duration-200 ${
                    clickedStep === item.step ? 'bg-indigo-100 scale-95' : ''
                  }`}
                  onClick={() => handleStepClick(item.step, item.title)}
                >
                  <div className={`w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold ${
                    clickedStep === item.step ? 'bg-indigo-600' : ''
                  }`}>
                    {clickedStep === item.step ? <CheckCircle className="h-4 w-4" /> : item.step}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm text-gray-800">{item.title}</div>
                    <div className="text-xs text-gray-600">{item.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Motivational Section */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200/50">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-purple-800 mb-2">
              Consistent Progress Leads to Results
            </h3>
            <p className="text-sm text-purple-700 mb-4">
              Track your recommended actions daily and see measurable improvements in your posture health over time.
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-purple-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                Daily Habits
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                Progress Metrics
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Spacing */}
        <div className="h-6"></div>
      </div>

      {/* Modal Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className={`w-16 h-16 bg-gradient-to-r ${modalContent?.color} rounded-full flex items-center justify-center text-white shadow-lg`}>
                {modalContent?.icon}
              </div>
            </div>
            <DialogTitle className="text-center text-xl font-bold text-gray-800">
              {modalContent?.title}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 leading-relaxed">
              {modalContent?.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center">
            <Button 
              onClick={() => setModalOpen(false)}
              className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-6"
            >
              Got it!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgressTracker;