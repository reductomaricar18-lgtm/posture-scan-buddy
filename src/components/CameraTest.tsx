import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CheckCircle, X, Smartphone, Wifi } from 'lucide-react';

const CameraTest = () => {
  const [testResults, setTestResults] = useState({
    https: false,
    mobile: false,
    camera: false,
    backCamera: false,
    highRes: false,
    permissions: false
  });
  const [isTestingCamera, setIsTestingCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [resolution, setResolution] = useState<{width: number, height: number} | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    runInitialTests();
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const runInitialTests = () => {
    // Test HTTPS
    const isHttps = window.location.protocol === 'https:';
    
    // Test mobile device
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    
    setTestResults(prev => ({
      ...prev,
      https: isHttps,
      mobile: isMobile
    }));
  };

  const testCamera = async () => {
    setIsTestingCamera(true);
    
    try {
      // Test basic camera access
      const basicStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setTestResults(prev => ({ ...prev, camera: true, permissions: true }));
      basicStream.getTracks().forEach(track => track.stop());

      // Test back camera with high resolution
      const constraints = {
        video: {
          facingMode: { exact: "environment" },
          width: { ideal: 4000, min: 3000 },
          height: { ideal: 3000, min: 2250 }
        }
      };

      const backStream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(backStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = backStream;
        await videoRef.current.play();
        
        // Get resolution
        const track = backStream.getVideoTracks()[0];
        const settings = track.getSettings();
        const res = {
          width: settings.width || 0,
          height: settings.height || 0
        };
        setResolution(res);
        
        setTestResults(prev => ({
          ...prev,
          backCamera: true,
          highRes: (res.width >= 3000 && res.height >= 2250)
        }));
      }
      
    } catch (error: any) {
      console.error('Camera test failed:', error);
      
      if (error.name === 'NotAllowedError') {
        setTestResults(prev => ({ ...prev, permissions: false }));
      } else if (error.name === 'NotFoundError') {
        setTestResults(prev => ({ ...prev, backCamera: false }));
      } else if (error.name === 'OverconstrainedError') {
        setTestResults(prev => ({ ...prev, highRes: false }));
      }
    }
    
    setIsTestingCamera(false);
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const TestResult = ({ label, passed, description }: { label: string, passed: boolean, description: string }) => (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex-1">
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-gray-600">{description}</div>
      </div>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
        passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
      }`}>
        {passed ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
      </div>
    </div>
  );

  const allTestsPassed = Object.values(testResults).every(result => result);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center">
              <Smartphone className="mr-2 h-5 w-5" />
              Camera Functionality Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TestResult
              label="HTTPS Connection"
              passed={testResults.https}
              description="Required for camera access"
            />
            
            <TestResult
              label="Mobile Device"
              passed={testResults.mobile}
              description="App restricted to mobile devices"
            />
            
            <TestResult
              label="Camera Access"
              passed={testResults.camera}
              description="Basic camera functionality"
            />
            
            <TestResult
              label="Camera Permissions"
              passed={testResults.permissions}
              description="User granted camera access"
            />
            
            <TestResult
              label="Back Camera"
              passed={testResults.backCamera}
              description="Environment-facing camera available"
            />
            
            <TestResult
              label="High Resolution"
              passed={testResults.highRes}
              description="12-20MP equivalent quality"
            />

            {resolution && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-sm font-medium text-blue-800">Camera Resolution</div>
                <div className="text-xs text-blue-700">
                  {resolution.width} x {resolution.height} pixels
                  {resolution.width >= 3000 && resolution.height >= 2250 ? ' ✅' : ' ⚠️'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {!isTestingCamera && !cameraStream && (
            <Button onClick={testCamera} className="w-full" size="lg">
              <Camera className="mr-2 h-5 w-5" />
              Test Camera Functionality
            </Button>
          )}

          {isTestingCamera && (
            <Button disabled className="w-full" size="lg">
              <Camera className="mr-2 h-5 w-5 animate-pulse" />
              Testing Camera...
            </Button>
          )}

          {cameraStream && (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full rounded-lg"
                  playsInline
                  muted
                />
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  Live Camera Test
                </div>
              </div>
              
              <Button onClick={stopCamera} variant="outline" className="w-full">
                Stop Camera Test
              </Button>
            </div>
          )}
        </div>

        {allTestsPassed && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-medium text-green-800">All Tests Passed!</div>
              <div className="text-sm text-green-700">
                Your device is ready for posture scanning
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Wifi className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <div className="font-medium text-sm text-blue-800">Connection Info</div>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>Protocol: {window.location.protocol}</div>
                  <div>Host: {window.location.host}</div>
                  <div>User Agent: {navigator.userAgent.substring(0, 50)}...</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CameraTest;