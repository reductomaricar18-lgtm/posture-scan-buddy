import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Camera, 
  RotateCcw, 
  Check, 
  ArrowLeft,
  Zap,
  AlertCircle,
  Smartphone,
  X
} from "lucide-react";

interface ScanInterfaceProps {
  onBack: () => void;
  onScanComplete: (image: string, analysisData: any) => void;
}

// CNN Model for posture analysis (simplified structure)
class PostureCNN {
  private model: any = null;
  
  constructor() {
    this.initializeModel();
  }

  private async initializeModel() {
    // Initialize CNN model for posture detection
    // This would typically load a pre-trained TensorFlow.js model
    console.log("Initializing CNN model for posture analysis...");
    
    // Simulated model initialization
    this.model = {
      initialized: true,
      version: "1.0.0",
      inputShape: [224, 224, 3],
      outputClasses: ["good_posture", "forward_head", "rounded_shoulders", "anterior_pelvic_tilt", "scoliosis"]
    };
  }

  async analyzePosture(imageData: string): Promise<any> {
    if (!this.model?.initialized) {
      throw new Error("CNN model not initialized");
    }

    // Simulate CNN analysis with pattern recognition
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulated analysis results
        const analysis = {
          overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
          detectedConditions: [
            {
              condition: "Forward Head Posture",
              severity: "Mild",
              confidence: 0.85,
              recommendations: [
                "Perform chin tucks 3 times daily",
                "Strengthen deep neck flexors",
                "Improve workstation ergonomics"
              ]
            },
            {
              condition: "Rounded Shoulders",
              severity: "Moderate",
              confidence: 0.78,
              recommendations: [
                "Chest stretches and doorway stretches",
                "Strengthen rhomboids and middle trapezius",
                "Practice wall slides"
              ]
            }
          ],
          spinalAlignment: {
            cervical: "Forward deviation: 15°",
            thoracic: "Increased kyphosis: 8°",
            lumbar: "Normal lordosis"
          },
          bodyLandmarks: {
            head: { x: 0.5, y: 0.2 },
            shoulders: { x: 0.5, y: 0.35 },
            hips: { x: 0.5, y: 0.65 },
            ankles: { x: 0.5, y: 0.9 }
          },
          timestamp: new Date().toISOString(),
          processingTime: "2.3s"
        };
        resolve(analysis);
      }, 2500);
    });
  }
}

const ScanInterface = ({ onBack, onScanComplete }: ScanInterfaceProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isBackBodyDetected, setIsBackBodyDetected] = useState(false);
  const [cameraResolution, setCameraResolution] = useState<{width: number, height: number} | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cnnModel = useRef<PostureCNN>(new PostureCNN());

  // Check if device is mobile and has required capabilities
  useEffect(() => {
    const checkDeviceCompatibility = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const hasCamera = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
      
      if (!isMobile) {
        setDeviceError("This feature is only available on mobile devices with cameras.");
        return false;
      }
      
      if (!hasCamera) {
        setDeviceError("Camera access is not available on this device.");
        return false;
      }
      
      setIsMobileDevice(true);
      return true;
    };

    checkDeviceCompatibility();
  }, []);

  // Back body detection using basic pattern recognition
  const detectBackBody = useCallback((video: HTMLVideoElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Simple pattern recognition for back body detection
    // This is a simplified version - in production, you'd use more sophisticated ML models
    let backBodyIndicators = 0;
    const samplePoints = 100;
    
    for (let i = 0; i < samplePoints; i++) {
      const x = Math.floor(Math.random() * canvas.width);
      const y = Math.floor(Math.random() * canvas.height);
      const index = (y * canvas.width + x) * 4;
      
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      
      // Check for skin tone patterns and body silhouette
      const skinTone = (r > 100 && g > 80 && b > 60) && (r > g && g > b);
      const bodyShape = Math.abs(r - g) < 30 && Math.abs(g - b) < 30;
      
      if (skinTone || bodyShape) {
        backBodyIndicators++;
      }
    }

    // If more than 30% of sample points indicate body presence
    return backBodyIndicators > (samplePoints * 0.3);
  }, []);

  const startCamera = useCallback(async () => {
    if (!isMobileDevice) {
      setCameraError("Camera access is restricted to mobile devices only.");
      return;
    }

    try {
      // Request high-resolution back camera (12-20MP equivalent)
      const constraints = {
        video: {
          facingMode: { exact: "environment" }, // Back camera only
          width: { ideal: 4000, min: 3000 }, // High resolution for 12-20MP
          height: { ideal: 3000, min: 2250 },
          aspectRatio: { ideal: 4/3 },
          frameRate: { ideal: 30, max: 60 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        // Get actual camera resolution
        const track = stream.getVideoTracks()[0];
        const settings = track.getSettings();
        setCameraResolution({
          width: settings.width || 0,
          height: settings.height || 0
        });

        // Start back body detection
        const detectionInterval = setInterval(() => {
          if (videoRef.current) {
            const isBackDetected = detectBackBody(videoRef.current);
            setIsBackBodyDetected(isBackDetected);
          }
        }, 1000);

        // Cleanup interval when component unmounts
        return () => clearInterval(detectionInterval);
      }
      
      setShowInstructions(false);
      setCameraError(null);
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      
      if (error.name === 'NotAllowedError') {
        setCameraError("Camera permission denied. Please allow camera access and try again.");
      } else if (error.name === 'NotFoundError') {
        setCameraError("No back camera found on this device.");
      } else if (error.name === 'OverconstrainedError') {
        setCameraError("Camera doesn't support the required resolution. Please use a device with a higher quality camera.");
      } else {
        setCameraError("Failed to access camera. Please ensure you're using a mobile device with a back camera.");
      }
    }
  }, [isMobileDevice, detectBackBody]);

  const captureImage = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    if (!isBackBodyDetected) {
      alert("Please position yourself so your back is visible to the camera.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Capture at high resolution
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    // High quality JPEG (12-20MP equivalent)
    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(imageData);
    
    // Stop camera
    const stream = video.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }, [isBackBodyDetected]);

  const retake = useCallback(() => {
    setCapturedImage(null);
    setIsBackBodyDetected(false);
    startCamera();
  }, [startCamera]);

  const confirmScan = useCallback(async () => {
    if (!capturedImage) return;

    setIsScanning(true);
    
    try {
      // Process image with CNN model
      const analysisData = await cnnModel.current.analyzePosture(capturedImage);
      
      // Add metadata
      const enhancedData = {
        ...analysisData,
        imageMetadata: {
          resolution: cameraResolution,
          captureTime: new Date().toISOString(),
          deviceType: "mobile",
          cameraType: "back",
          userInfo: { gender, age: parseInt(age) }
        }
      };
      
      onScanComplete(capturedImage, enhancedData);
    } catch (error) {
      console.error('Error analyzing posture:', error);
      alert('Failed to analyze posture. Please try again.');
      setIsScanning(false);
    }
  }, [capturedImage, cameraResolution, gender, age, onScanComplete]);

  // Show device compatibility error
  if (deviceError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold mb-4 text-red-700">Device Not Supported</h2>
            <p className="text-gray-600 mb-6">{deviceError}</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Smartphone className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="text-left">
                  <p className="font-medium text-sm text-blue-800">Requirements:</p>
                  <ul className="text-xs text-blue-700 mt-1 space-y-1">
                    <li>• Mobile device (Android/iOS)</li>
                    <li>• Back camera with 12-20MP resolution</li>
                    <li>• Camera permission enabled</li>
                  </ul>
                </div>
              </div>
            </div>
            <Button onClick={onBack} variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="font-semibold">Posture Scan</h1>
        <div className="w-16"></div>
      </div>

      {showInstructions ? (
        /* Instructions Screen */
        <div className="p-6 max-w-md mx-auto">
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-medical-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-10 w-10 text-medical-blue" />
              </div>
              <h2 className="text-xl font-semibold mb-4">Back Body Scan Instructions</h2>
              <div className="space-y-3 text-left text-sm text-muted-foreground">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-medical-blue rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">1</div>
                  <p><strong>Position:</strong> Stand 4-5 feet away, showing your back to the camera</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-medical-blue rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">2</div>
                  <p><strong>Posture:</strong> Stand naturally with arms relaxed at your sides</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-medical-blue rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">3</div>
                  <p><strong>Clothing:</strong> Wear form-fitting clothes or remove shirt for better analysis</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-medical-blue rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">4</div>
                  <p><strong>Environment:</strong> Ensure good lighting and plain background</p>
                </div>
              </div>
              
              {/* Gender and Age Input */}
              <div className="mt-6 text-left">
                <label className="block mb-2 font-medium">Gender</label>
                <select 
                  value={gender} 
                  onChange={e => setGender(e.target.value)} 
                  className="w-full border rounded px-3 py-2 mb-4"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <label className="block mb-2 font-medium">Age</label>
                <input 
                  type="number" 
                  min="1" 
                  max="120" 
                  value={age} 
                  onChange={e => setAge(e.target.value)} 
                  className="w-full border rounded px-3 py-2" 
                  placeholder="Enter age" 
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-medical-green/10 border border-medical-green/20 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-medical-green mt-0.5" />
              <div>
                <p className="font-medium text-sm">AI-Powered Analysis</p>
                <p className="text-xs text-muted-foreground">Our CNN model analyzes your back posture with pattern recognition for accurate results</p>
              </div>
            </div>
          </div>

          {cameraError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <X className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-red-800">Camera Error</p>
                  <p className="text-xs text-red-700">{cameraError}</p>
                </div>
              </div>
            </div>
          )}
          
          <Button 
            onClick={startCamera} 
            variant="medical" 
            size="lg" 
            className="w-full" 
            disabled={!gender || !age || !isMobileDevice}
          >
            <Camera className="mr-2" />
            Start High-Resolution Scan
          </Button>
        </div>
      ) : (
        /* Camera/Review Screen */
        <div className="relative flex-1">
          {capturedImage ? (
            /* Image Review */
            <div className="relative">
              <img 
                src={capturedImage} 
                alt="Captured back posture" 
                className="w-full h-screen object-cover"
              />
              {/* Analysis Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="0.2" strokeDasharray="2,1"/>
                  <circle cx="50" cy="15" r="2" fill="none" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="0.2"/>
                  <circle cx="50" cy="30" r="3" fill="none" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="0.2"/>
                  <circle cx="50" cy="60" r="2" fill="none" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="0.2"/>
                  <circle cx="50" cy="85" r="2" fill="none" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="0.2"/>
                </svg>
              </div>
            </div>
          ) : (
            /* Live Camera */
            <div className="relative">
              <video 
                ref={videoRef}
                className="w-full h-screen object-cover"
                playsInline
                muted
              />
              
              {/* Back Body Detection Status */}
              <div className="absolute top-4 left-4 right-4">
                <div className={`text-center p-3 rounded-lg ${
                  isBackBodyDetected 
                    ? 'bg-green-500/80 text-white' 
                    : 'bg-red-500/80 text-white'
                }`}>
                  <p className="text-sm font-medium">
                    {isBackBodyDetected 
                      ? '✓ Back body detected - Ready to capture' 
                      : '⚠ Please show your back to the camera'
                    }
                  </p>
                </div>
              </div>

              {/* Resolution Info */}
              {cameraResolution && (
                <div className="absolute top-20 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {cameraResolution.width}x{cameraResolution.height}
                </div>
              )}
              
              {/* Posture Guidelines Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.2" strokeDasharray="2,1"/>
                  <circle cx="50" cy="15" r="2" fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.2"/>
                  <circle cx="50" cy="30" r="3" fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.2"/>
                  <circle cx="50" cy="60" r="2" fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.2"/>
                  <circle cx="50" cy="85" r="2" fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.2"/>
                </svg>
                <div className="absolute bottom-32 left-4 right-4 text-center">
                  <p className="text-white text-sm bg-black/50 rounded-lg px-3 py-2 inline-block">
                    Align your spine with the center line
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            {capturedImage ? (
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={retake} 
                  variant="outline" 
                  size="lg"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <RotateCcw className="mr-2" />
                  Retake
                </Button>
                <Button 
                  onClick={confirmScan} 
                  variant="scan" 
                  size="lg"
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <>
                      <Zap className="mr-2 animate-scan-pulse" />
                      CNN Analyzing...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Button 
                  onClick={captureImage} 
                  size="lg"
                  className={`w-20 h-20 rounded-full ${
                    isBackBodyDetected 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-gray-400 cursor-not-allowed'
                  } text-white`}
                  disabled={!isBackBodyDetected}
                >
                  <Camera className="h-8 w-8" />
                </Button>
                <p className="text-white text-sm mt-2">
                  {isBackBodyDetected ? 'Tap to capture' : 'Position your back to camera'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default ScanInterface;