import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  TrendingUp, 
  Calendar,
  BarChart3,
  Sparkles,
  Eye,
  Clock,
  Share,
  Archive,
  AlertCircle,
  CheckCircle,
  X,
  Info
} from "lucide-react";

interface ReportsScreenProps {
  onBack: () => void;
}

const ReportsScreen = ({ onBack }: ReportsScreenProps) => {
  const [clickedFeature, setClickedFeature] = useState<string | null>(null);
  const [clickedExport, setClickedExport] = useState<string | null>(null);
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
      case "View Detailed Reports":
        showModal(
          "View Detailed Reports",
          "No scan reports available yet. Complete a posture scan to generate your first detailed report with comprehensive analysis, visual indicators, and improvement recommendations!",
          <Eye className="h-8 w-8" />,
          "from-blue-500 to-purple-600"
        );
        break;
      case "Export Reports":
        showModal(
          "Export Reports",
          "No reports to export. Your scan reports will be available for download once you complete a posture analysis. Export as PDF for sharing with healthcare professionals or keeping records!",
          <Download className="h-8 w-8" />,
          "from-green-500 to-emerald-600"
        );
        break;
      case "Progress Comparison":
        showModal(
          "Progress Comparison",
          "Need at least 2 scans to compare progress. Complete multiple scans to track your improvement over time with side-by-side comparisons and trend analysis!",
          <TrendingUp className="h-8 w-8" />,
          "from-orange-500 to-red-600"
        );
        break;
      case "Historical Data":
        showModal(
          "Historical Data",
          "Your posture scan history will appear here. Start with your first scan to begin building your timeline and track long-term posture improvements!",
          <Calendar className="h-8 w-8" />,
          "from-indigo-500 to-purple-600"
        );
        break;
    }
  };

  const handleExportClick = (title: string, format: string) => {
    setClickedExport(title);
    setTimeout(() => setClickedExport(null), 2000);
    
    switch (title) {
      case "Individual Report":
        showModal(
          `Individual Report (${format})`,
          "No individual reports available. Complete a scan to generate your first exportable report with detailed posture analysis, recommendations, and visual diagrams!",
          <FileText className="h-8 w-8" />,
          "from-blue-500 to-cyan-600"
        );
        break;
      case "Complete History":
        showModal(
          `Complete History (${format})`,
          "No scan history available yet. Your complete posture data will be exportable after multiple scans, including trends, improvements, and comprehensive analytics!",
          <Archive className="h-8 w-8" />,
          "from-purple-500 to-pink-600"
        );
        break;
      case "Progress Summary":
        showModal(
          `Progress Summary (${format})`,
          "No progress data available. Complete regular scans to generate shareable progress summaries with improvement metrics and visual charts!",
          <Share className="h-8 w-8" />,
          "from-green-500 to-teal-600"
        );
        break;
    }
  };

  const handleStatsClick = (statType: string) => {
    switch (statType) {
      case "reports":
        showModal(
          "Total Reports: 0",
          "Complete your first posture scan to start generating detailed analysis reports! Each scan creates a comprehensive report with posture assessment, identified issues, and personalized recommendations.",
          <BarChart3 className="h-8 w-8" />,
          "from-blue-500 to-indigo-600"
        );
        break;
      case "score":
        showModal(
          "Latest Score: Not Available",
          "Your most recent posture score will appear here after your first scan! Scores range from 0-100 and help you track improvement over time with detailed breakdowns by body region.",
          <Clock className="h-8 w-8" />,
          "from-purple-500 to-violet-600"
        );
        break;
    }
  };

  const reportFeatures = [
    {
      icon: <Eye className="h-6 w-6" />,
      title: "View Detailed Reports",
      description: "Access comprehensive posture analysis results",
      onClick: () => handleFeatureClick("View Detailed Reports")
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Export Reports",
      description: "Download reports as PDF for sharing or records",
      onClick: () => handleFeatureClick("Export Reports")
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Progress Comparison",
      description: "Compare results across multiple scans",
      onClick: () => handleFeatureClick("Progress Comparison")
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Historical Data",
      description: "View your complete posture history timeline",
      onClick: () => handleFeatureClick("Historical Data")
    }
  ];

  const exportOptions = [
    {
      icon: <Download className="h-5 w-5" />,
      title: "Individual Report",
      description: "Export single scan results",
      format: "PDF",
      onClick: () => handleExportClick("Individual Report", "PDF")
    },
    {
      icon: <Archive className="h-5 w-5" />,
      title: "Complete History",
      description: "Export all your scan data",
      format: "PDF/CSV",
      onClick: () => handleExportClick("Complete History", "PDF/CSV")
    },
    {
      icon: <Share className="h-5 w-5" />,
      title: "Progress Summary",
      description: "Share improvement trends",
      format: "PDF",
      onClick: () => handleExportClick("Progress Summary", "PDF")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200/50 z-10">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <Button variant="ghost" onClick={onBack} className="hover:bg-blue-100/50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="font-semibold text-gray-800">My Reports</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Empty State Hero Section */}
        <div className="text-center py-8 px-4">
          <div className="relative mb-6">
            {/* Animated Background Circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-blue-100 rounded-full animate-pulse opacity-20"></div>
              <div className="absolute w-24 h-24 bg-purple-100 rounded-full animate-ping opacity-30"></div>
              <div className="absolute w-16 h-16 bg-green-100 rounded-full animate-bounce opacity-40"></div>
            </div>
            
            {/* Main Icon */}
            <div className="relative z-10 w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="h-10 w-10 text-white" />
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-spin" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No Scan Reports Available
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your posture scan reports will appear here. Complete a posture scan to generate detailed analysis reports that you can view and export.
          </p>
        </div>

        {/* Report Features */}
        <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg text-gray-800 flex items-center justify-center">
              <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
              Report Features
            </CardTitle>
            <CardDescription className="text-gray-600">
              What you can do with your scan reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reportFeatures.map((feature, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`flex items-start space-x-3 p-3 rounded-lg hover:bg-blue-50/50 transition-all duration-200 group w-full h-auto justify-start ${
                  clickedFeature === feature.title ? 'bg-blue-100 scale-95' : ''
                }`}
                onClick={feature.onClick}
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-200">
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

        {/* Stats Preview */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
            onClick={() => handleStatsClick("reports")}
          >
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-700 mb-1">0</div>
              <div className="text-xs text-blue-600">Total Reports</div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
            onClick={() => handleStatsClick("score")}
          >
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-700 mb-1">--</div>
              <div className="text-xs text-purple-600">Latest Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Export Options Preview */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 flex items-center">
              <Download className="mr-2 h-5 w-5 text-green-500" />
              Export Options
            </CardTitle>
            <CardDescription className="text-gray-600">
              Available when you have scan reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {exportOptions.map((option, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`flex items-center justify-between p-3 rounded-lg bg-white/50 border border-gray-200/50 w-full h-auto hover:bg-white/80 transition-all duration-200 ${
                  clickedExport === option.title ? 'bg-green-100 scale-95' : ''
                }`}
                onClick={option.onClick}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                    {clickedExport === option.title ? <CheckCircle className="h-5 w-5" /> : option.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-800 text-sm">
                      {option.title}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {option.description}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {option.format}
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200/50">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-indigo-800 mb-2">
              Comprehensive Posture Reports
            </h3>
            <p className="text-sm text-indigo-700 mb-4">
              Get detailed analysis of your posture with visual indicators, improvement suggestions, and progress tracking.
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-indigo-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></div>
                Detailed Analysis
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></div>
                Export Ready
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
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6"
            >
              Got it!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsScreen;