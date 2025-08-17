import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Brain,
  Activity,
  Lightbulb,
  FileText,
  Share2
} from "lucide-react";

interface ResultsScreenProps {
  image: string;
  onBack: () => void;
  onViewRecommendations: () => void;
  onSaveReport: () => void;
}

const SCAN_HISTORY_KEY = 'posture_scan_history';

const ResultsScreen = ({ image, onBack, onViewRecommendations, onSaveReport }: ResultsScreenProps) => {
  const [selectedCondition, setSelectedCondition] = useState(0);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const conditions = [
    {
      name: "Forward Head Posture",
      severity: "Mild",
      confidence: 78,
      status: "warning",
      description: "Slight forward positioning of the head relative to the shoulders",
      icon: AlertTriangle,
      color: "text-warning"
    },
    {
      name: "Shoulder Alignment",
      severity: "Normal",
      confidence: 92,
      status: "good",
      description: "Shoulders are properly aligned and level",
      icon: CheckCircle,
      color: "text-medical-green"
    },
    {
      name: "Spinal Curvature",
      severity: "Normal",
      confidence: 85,
      status: "good",
      description: "Natural spinal curves within healthy range",
      icon: CheckCircle,
      color: "text-medical-green"
    },
    {
      name: "Pelvic Tilt",
      severity: "Slight Anterior",
      confidence: 72,
      status: "warning",
      description: "Minor forward tilting of the pelvis detected",
      icon: AlertTriangle,
      color: "text-warning"
    }
  ];

  // Record scan in localStorage
  useEffect(() => {
    const scan = {
      date: new Date().toISOString(),
      image,
      conditions,
      overallScore: Math.round(conditions.reduce((acc, c) => acc + c.confidence, 0) / conditions.length)
    };
    const history = JSON.parse(localStorage.getItem(SCAN_HISTORY_KEY) || '[]');
    history.push(scan);
    localStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(history));
  }, [image]);

  const overallScore = Math.round(conditions.reduce((acc, c) => acc + c.confidence, 0) / conditions.length);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="font-semibold">Scan Results</h1>
        <Button variant="ghost" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-6">
        {/* Image with Overlay */}
        <Card>
          <CardContent className="p-4">
            <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-medical-blue/5 to-medical-green/5">
              <img 
                src={image} 
                alt="Analyzed posture" 
                className="w-full h-64 object-cover"
              />
              {/* Analysis Overlay */}
              <div className="absolute inset-0">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Head indicator */}
                  <circle cx="48" cy="18" r="2" fill="rgba(251, 191, 36, 0.8)" stroke="white" strokeWidth="0.5"/>
                  {/* Shoulder indicators */}
                  <circle cx="52" cy="32" r="1.5" fill="rgba(34, 197, 94, 0.8)" stroke="white" strokeWidth="0.5"/>
                  <circle cx="44" cy="32" r="1.5" fill="rgba(34, 197, 94, 0.8)" stroke="white" strokeWidth="0.5"/>
                  {/* Spine line */}
                  <path d="M 48 18 Q 50 35 49 55 Q 48 75 50 85" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="0.5" fill="none"/>
                  {/* Pelvis indicator */}
                  <circle cx="50" cy="75" r="1.5" fill="rgba(251, 191, 36, 0.8)" stroke="white" strokeWidth="0.5"/>
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Score */}
        <Card className="bg-gradient-to-r from-medical-blue/10 to-medical-green/10">
          <CardHeader className="text-center pb-2">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Brain className="h-5 w-5 text-medical-blue" />
              <span>Overall Posture Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-medical-blue mb-2">{overallScore}%</div>
            <p className="text-sm text-muted-foreground mb-4">
              {overallScore >= 85 ? "Excellent posture!" : 
               overallScore >= 70 ? "Good with room for improvement" : 
               "Needs attention"}
            </p>
            <Progress value={overallScore} className="w-full" />
          </CardContent>
        </Card>

        {/* Detected Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Detected Conditions
            </CardTitle>
            <CardDescription>AI-powered analysis results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {conditions.map((condition, index) => {
              const Icon = condition.icon;
              return (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedCondition === index ? 'bg-medical-blue/10 border-medical-blue/30' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedCondition(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${condition.color}`} />
                      <div>
                        <h4 className="font-medium text-sm">{condition.name}</h4>
                        <p className="text-xs text-muted-foreground">{condition.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs font-medium">{condition.severity}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{condition.confidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-4 w-4 text-medical-green" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <div className="flex items-start space-x-2 mb-2">
                <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                <p>Forward head posture may be caused by prolonged computer use</p>
              </div>
              <div className="flex items-start space-x-2 mb-2">
                <div className="w-2 h-2 bg-medical-green rounded-full mt-2"></div>
                <p>Good shoulder alignment indicates strong upper back muscles</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                <p>Slight pelvic tilt can be improved with core strengthening</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={() => setShowRecommendations(true)} variant="health" size="lg" className="w-full">
            <Brain className="mr-2" />
            View Recommendations
          </Button>
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={() => setShowShareModal(true)}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Results
            </Button>
          </div>
        </div>
      </div>

      {/* Recommendations Modal */}
      {showRecommendations && !showChatbot && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative flex flex-col">
            <Button variant="ghost" className="absolute left-4 top-4" onClick={() => setShowRecommendations(false)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h2 className="text-xl font-bold mb-4 text-center">Recommendations</h2>
            <div className="mb-6">
              {/* Realtime recommendations based on selected condition */}
              <div className="font-medium mb-2">{conditions[selectedCondition].name}</div>
              <div className="text-sm mb-2">{conditions[selectedCondition].description}</div>
              <ul className="list-disc ml-6 text-sm">
                {conditions[selectedCondition].severity === 'Mild' && (
                  <li>Try neck stretches and posture reminders throughout the day.</li>
                )}
                {conditions[selectedCondition].name === 'Shoulder Alignment' && (
                  <li>Maintain good ergonomics and do upper back exercises.</li>
                )}
                {conditions[selectedCondition].name === 'Spinal Curvature' && (
                  <li>Continue regular movement and core strengthening.</li>
                )}
                {conditions[selectedCondition].name === 'Pelvic Tilt' && (
                  <li>Incorporate core and hip flexor stretches.</li>
                )}
              </ul>
            </div>
            <div className="flex flex-col items-center relative">
              <Button onClick={() => setShowSaveConfirm(true)} variant="outline" className="mb-2 w-2/3">
                <FileText className="mr-2 h-4 w-4" />
                Save Report
              </Button>
            </div>
            {/* Save Report Confirmation Modal - do not hide recommendations modal */}
            {showSaveConfirm && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full">
                  <h3 className="text-lg font-bold mb-2">Confirm Save</h3>
                  <p className="mb-4 text-sm">Are you sure you want to save this report?</p>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowSaveConfirm(false)}>No</Button>
                    <Button variant="medical" onClick={() => { setShowSaveConfirm(false); onSaveReport(); }}>Yes</Button>
                  </div>
                </div>
              </div>
            )}
            {/* Floating chatbot button inside recommendations modal */}
            <div className="absolute bottom-4 right-4">
              <Button variant="medical" size="icon" className="rounded-full shadow-lg" onClick={() => { setShowChatbot(true); }}>
                <Brain className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* AI Chatbot UI, only one visible at a time */}
      {showRecommendations && showChatbot && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">AI Health Chatbot</span>
              <Button variant="ghost" size="icon" onClick={() => setShowChatbot(false)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="mb-2 text-sm">Ask for recommendations, nearby hospitals, or doctors for postural imbalances.</div>
            <div className="bg-muted/30 p-2 rounded mb-2">How can I help you today?</div>
            <div className="flex gap-2 mt-2">
              <input type="text" className="flex-1 border rounded px-2 py-1" placeholder="Type your question..." />
              <Button variant="medical">Send</Button>
            </div>
          </div>
        </div>
      )}
      {/* Save Report Confirmation Modal */}
      {showSaveConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full">
            <h3 className="text-lg font-bold mb-2">Confirm Save</h3>
            <p className="mb-4 text-sm">Are you sure you want to save this report?</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowSaveConfirm(false)}>No</Button>
              <Button variant="medical" onClick={() => { setShowSaveConfirm(false); onSaveReport(); }}>Yes</Button>
            </div>
          </div>
        </div>
      )}
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full">
            <h3 className="text-lg font-bold mb-2">Share Report</h3>
            <p className="mb-4 text-sm">Choose a method to share your report:</p>
            <div className="flex flex-col gap-2">
              <Button variant="outline">Bluetooth</Button>
              <Button variant="outline">Google Drive</Button>
              <Button variant="outline">Email</Button>
              <Button variant="outline">Messenger</Button>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" onClick={() => setShowShareModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsScreen;