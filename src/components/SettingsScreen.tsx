import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { db, rtdb } from "../lib/firebaseClient";
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, set, update, push, onValue, off, serverTimestamp as rtdbServerTimestamp } from "firebase/database";
import { updateProfile } from "firebase/auth";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  LogOut, 
  Bell, 
  Globe, 
  Shield, 
  FileText, 
  HelpCircle, 
  MessageCircle, 
  Send,
  Edit,
  Info,
  ExternalLink,
  Loader2
} from "lucide-react";

interface SettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

const SettingsScreen = ({ onBack, onLogout }: SettingsScreenProps) => {
  const { currentUser } = useAuth();
  
  // State management
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    scanResults: true,
    weeklyHealthTips: false,
    monthlyProgress: true
  });

  const [profileData, setProfileData] = useState({
    displayName: currentUser?.displayName || "User",
    email: currentUser?.email || ""
  });

  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [feedbackText, setFeedbackText] = useState("");
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(
    localStorage.getItem('posturescan_terms_agreed') === 'true'
  );
  const [termsAgreementDate, setTermsAgreementDate] = useState(
    localStorage.getItem('posturescan_terms_date') || null
  );

  // Dialog states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showTermsAgreement, setShowTermsAgreement] = useState(false);

  // Loading states
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [isLoadingLanguage, setIsLoadingLanguage] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // Set up real-time listeners for user settings
  useEffect(() => {
    if (!currentUser?.uid) return;

    const userRef = ref(rtdb, `users/${currentUser.uid}`);
    
    // Set up real-time listener
    const unsubscribe = onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      
      if (userData) {
        // Load profile data
        if (userData.profile) {
          setProfileData({
            displayName: userData.profile.displayName || currentUser.displayName || "User",
            email: userData.profile.email || currentUser.email || ""
          });
        }

        // Load notification settings
        if (userData.notifications) {
          setNotifications(userData.notifications);
        }

        // Load language preference
        if (userData.language) {
          setSelectedLanguage(userData.language);
        }

        // Load terms agreement from database (fallback to localStorage)
        if (userData.termsAgreement) {
          setHasAgreedToTerms(userData.termsAgreement.agreed);
          setTermsAgreementDate(userData.termsAgreement.date);
          // Sync with localStorage
          localStorage.setItem('posturescan_terms_agreed', userData.termsAgreement.agreed.toString());
          localStorage.setItem('posturescan_terms_date', userData.termsAgreement.date);
        }
      } else {
        // Create initial user document if it doesn't exist
        const initialData = {
          profile: {
            displayName: currentUser.displayName || "User",
            email: currentUser.email || "",
            createdAt: rtdbServerTimestamp()
          },
          notifications: {
            dailyReminders: true,
            scanResults: true,
            weeklyHealthTips: false,
            monthlyProgress: true
          },
          language: "en-US",
          termsAgreement: {
            agreed: hasAgreedToTerms,
            date: termsAgreementDate
          },
          updatedAt: rtdbServerTimestamp()
        };
        
        set(userRef, initialData).catch(error => {
          console.error('Error creating initial user data:', error);
        });
      }
      
      setIsLoadingSettings(false);
    }, (error) => {
      console.error('Error listening to user settings:', error);
      setIsLoadingSettings(false);
    });

    // Cleanup listener on unmount
    return () => {
      off(userRef, 'value', unsubscribe);
    };
  }, [currentUser?.uid, hasAgreedToTerms, termsAgreementDate]);

  const handleLogout = async () => {
    try {
      onLogout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleNotificationToggle = async (key: keyof typeof notifications) => {
    if (!currentUser?.uid) return;

    const newValue = !notifications[key];
    const updatedNotifications = {
      ...notifications,
      [key]: newValue
    };

    // Optimistically update UI
    setNotifications(updatedNotifications);
    setIsLoadingNotifications(true);

    try {
      // Update in Realtime Database
      const userRef = ref(rtdb, `users/${currentUser.uid}`);
      await update(userRef, {
        notifications: updatedNotifications,
        updatedAt: rtdbServerTimestamp()
      });
      
      console.log(`${key} toggled to:`, newValue);
    } catch (error) {
      console.error('Error updating notifications:', error);
      // Revert on error
      setNotifications(notifications);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const handleProfileSave = async () => {
    if (!currentUser?.uid) return;

    setIsLoadingProfile(true);

    try {
      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: profileData.displayName
      });

      // Update Realtime Database user document
      const userRef = ref(rtdb, `users/${currentUser.uid}`);
      await update(userRef, {
        'profile/displayName': profileData.displayName,
        'profile/email': profileData.email,
        updatedAt: rtdbServerTimestamp()
      });

      console.log('Profile updated successfully:', profileData);
      setIsEditProfileOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleLanguageChange = async (language: string) => {
    if (!currentUser?.uid) return;

    setSelectedLanguage(language);
    setIsLoadingLanguage(true);

    try {
      // Update in Realtime Database
      const userRef = ref(rtdb, `users/${currentUser.uid}`);
      await update(userRef, {
        language: language,
        updatedAt: rtdbServerTimestamp()
      });

      console.log('Language changed to:', language);
      setIsLanguageOpen(false);
    } catch (error) {
      console.error('Error updating language:', error);
      // Revert on error
      setSelectedLanguage(selectedLanguage);
    } finally {
      setIsLoadingLanguage(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim() || !currentUser?.uid) return;

    setIsSubmittingFeedback(true);

    try {
      // Save feedback to Realtime Database
      const feedbackRef = ref(rtdb, 'feedback');
      await push(feedbackRef, {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        feedback: feedbackText.trim(),
        timestamp: rtdbServerTimestamp(),
        status: 'new'
      });

      console.log('Feedback submitted successfully');
      setFeedbackText("");
      setIsFeedbackOpen(false);
      
      // Show success message
      alert('Thank you for your feedback! We appreciate your input.');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const openExternalLink = (url: string) => {
    window.open(url, '_blank');
  };

  const handleAgreeToTerms = async () => {
    if (!currentUser?.uid) return;

    const currentDate = new Date().toISOString();
    setHasAgreedToTerms(true);
    setTermsAgreementDate(currentDate);
    
    // Save to localStorage
    localStorage.setItem('posturescan_terms_agreed', 'true');
    localStorage.setItem('posturescan_terms_date', currentDate);
    
    try {
      // Save to Realtime Database
      const userRef = ref(rtdb, `users/${currentUser.uid}`);
      await update(userRef, {
        'termsAgreement/agreed': true,
        'termsAgreement/date': currentDate,
        updatedAt: rtdbServerTimestamp()
      });
      
      console.log('Terms agreement saved to database');
    } catch (error) {
      console.error('Error saving terms agreement:', error);
    }
    
    // Close dialogs
    setShowTermsAgreement(false);
    setIsTermsOpen(false);
    
    console.log('User agreed to terms on:', currentDate);
  };

  const handleDisagreeToTerms = () => {
    setShowTermsAgreement(false);
    setIsTermsOpen(false);
    
    console.log('User disagreed to terms');
    
    alert('You must agree to the Terms & Conditions to continue using PostureScan Buddy. You will be logged out.');
    handleLogout();
  };

  const handleRevokeTermsAgreement = async () => {
    if (!currentUser?.uid) return;

    setHasAgreedToTerms(false);
    setTermsAgreementDate(null);
    
    // Remove from localStorage
    localStorage.removeItem('posturescan_terms_agreed');
    localStorage.removeItem('posturescan_terms_date');
    
    try {
      // Update Realtime Database
      const userRef = ref(rtdb, `users/${currentUser.uid}`);
      await update(userRef, {
        'termsAgreement/agreed': false,
        'termsAgreement/date': null,
        updatedAt: rtdbServerTimestamp()
      });
      
      console.log('Terms agreement revoked in database');
    } catch (error) {
      console.error('Error revoking terms agreement:', error);
    }
    
    console.log('Terms agreement revoked');
    
    // Show the agreement dialog again
    setShowTermsAgreement(true);
  };

  const openTermsDialog = () => {
    if (hasAgreedToTerms) {
      // If already agreed, just show the terms for review
      setIsTermsOpen(true);
    } else {
      // If not agreed, show the agreement flow
      setShowTermsAgreement(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Profile & Account Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <User className="mr-2 h-5 w-5" />
                Profile & Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{profileData.displayName}</p>
                    <p className="text-sm text-muted-foreground">{profileData.email}</p>
                  </div>
                </div>
                <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your profile information
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Display Name</label>
                        <Input
                          value={profileData.displayName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter your email"
                          type="email"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleProfileSave} disabled={isLoadingProfile}>
                        {isLoadingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Bell className="mr-2 h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Reminders</p>
                  <p className="text-sm text-muted-foreground">Get reminded to check your posture</p>
                </div>
                <Switch
                  checked={notifications.dailyReminders}
                  onCheckedChange={() => handleNotificationToggle('dailyReminders')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Scan Results</p>
                  <p className="text-sm text-muted-foreground">Notifications for completed scans</p>
                </div>
                <Switch
                  checked={notifications.scanResults}
                  onCheckedChange={() => handleNotificationToggle('scanResults')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Health Tips</p>
                  <p className="text-sm text-muted-foreground">Receive posture improvement tips</p>
                </div>
                <Switch
                  checked={notifications.weeklyHealthTips}
                  onCheckedChange={() => handleNotificationToggle('weeklyHealthTips')}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Monthly Progress</p>
                  <p className="text-sm text-muted-foreground">Monthly progress summaries</p>
                </div>
                <Switch
                  checked={notifications.monthlyProgress}
                  onCheckedChange={() => handleNotificationToggle('monthlyProgress')}
                />
              </div>
            </CardContent>
          </Card>

          {/* App Preferences Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Globe className="mr-2 h-5 w-5" />
                App Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Dialog open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start h-auto p-3">
                    <Globe className="mr-3 h-4 w-4" />
                    <div className="text-left">
                      <p className="font-medium">Language</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedLanguage === "en-US" ? "English (US)" : 
                         selectedLanguage === "es" ? "Español" :
                         selectedLanguage === "fr" ? "Français" :
                         selectedLanguage === "de" ? "Deutsch" : "English (US)"}
                      </p>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select Language</DialogTitle>
                    <DialogDescription>
                      Choose your preferred language for the app
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsLanguageOpen(false)}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Support & Feedback Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <HelpCircle className="mr-2 h-5 w-5" />
                Support & Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Data Privacy Dialog */}
              <Dialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start h-auto p-3">
                    <Shield className="mr-3 h-4 w-4" />
                    <div className="text-left">
                      <p className="font-medium">Data Privacy</p>
                      <p className="text-sm text-muted-foreground">Learn how we protect your data</p>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Data Privacy Policy</DialogTitle>
                    <DialogDescription>
                      How PostureScan Buddy protects your personal information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Data Collection</h4>
                      <p className="text-muted-foreground">
                        We collect only the data necessary to provide our posture analysis services, including photos for analysis and user account information.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Data Security</h4>
                      <p className="text-muted-foreground">
                        All data is encrypted in transit and at rest. We use industry-standard security measures to protect your information.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Data Usage</h4>
                      <p className="text-muted-foreground">
                        Your data is used solely for providing posture analysis and improving our services. We never sell or share your personal data with third parties.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setIsPrivacyOpen(false)}>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Terms & Conditions Button */}
              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto p-3"
                onClick={openTermsDialog}
              >
                <FileText className="mr-3 h-4 w-4" />
                <div className="text-left flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Terms & Conditions</p>
                      <p className="text-sm text-muted-foreground">
                        {hasAgreedToTerms ? 'Review our terms of service' : 'You must agree to continue'}
                      </p>
                    </div>
                    {hasAgreedToTerms && (
                      <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        ✓ Agreed
                      </div>
                    )}
                  </div>
                </div>
              </Button>

              {/* Terms Agreement Dialog */}
              <Dialog open={showTermsAgreement} onOpenChange={setShowTermsAgreement}>
                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Terms & Conditions Agreement</DialogTitle>
                    <DialogDescription>
                      Please read and agree to our terms of service to continue using PostureScan Buddy
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 text-sm max-h-60 overflow-y-auto border rounded p-3">
                    <div>
                      <h4 className="font-semibold mb-2">1. Acceptance of Terms</h4>
                      <p className="text-muted-foreground mb-3">
                        By using PostureScan Buddy, you agree to these terms and conditions. If you do not agree, you may not use our service.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">2. Service Description</h4>
                      <p className="text-muted-foreground mb-3">
                        PostureScan Buddy provides AI-powered posture analysis and recommendations for educational and informational purposes only. This is not medical advice.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">3. User Responsibilities</h4>
                      <p className="text-muted-foreground mb-3">
                        Users are responsible for providing accurate information, using the service appropriately, and consulting healthcare professionals for medical concerns.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">4. Privacy & Data</h4>
                      <p className="text-muted-foreground mb-3">
                        We collect and process data as described in our Privacy Policy. Your data is used solely for providing our services.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">5. Limitation of Liability</h4>
                      <p className="text-muted-foreground mb-3">
                        PostureScan Buddy is provided "as is" without warranties. We are not liable for any damages arising from use of our service.
                      </p>
                    </div>
                  </div>
                  <DialogFooter className="flex-col space-y-2">
                    <div className="flex space-x-2 w-full">
                      <Button 
                        variant="outline" 
                        onClick={handleDisagreeToTerms}
                        className="flex-1"
                      >
                        I Disagree
                      </Button>
                      <Button 
                        onClick={handleAgreeToTerms}
                        className="flex-1"
                      >
                        I Agree
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      By clicking "I Agree", you accept these terms and conditions
                    </p>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Terms Review Dialog (for users who already agreed) */}
              <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Terms & Conditions</DialogTitle>
                    <DialogDescription>
                      Terms of service for using PostureScan Buddy
                      {hasAgreedToTerms && termsAgreementDate && (
                        <span className="block text-green-600 text-xs mt-1">
                          ✓ You agreed to these terms on {new Date(termsAgreementDate).toLocaleDateString()}
                        </span>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">1. Acceptance of Terms</h4>
                      <p className="text-muted-foreground">
                        By using PostureScan Buddy, you agree to these terms and conditions.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">2. Service Description</h4>
                      <p className="text-muted-foreground">
                        PostureScan Buddy provides AI-powered posture analysis and recommendations for educational purposes only.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">3. User Responsibilities</h4>
                      <p className="text-muted-foreground">
                        Users are responsible for providing accurate information and using the service appropriately.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">4. Privacy & Data</h4>
                      <p className="text-muted-foreground">
                        We collect and process data as described in our Privacy Policy.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">5. Limitation of Liability</h4>
                      <p className="text-muted-foreground">
                        PostureScan Buddy is provided "as is" without warranties.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <div className="flex space-x-2 w-full">
                      {hasAgreedToTerms && (
                        <Button 
                          variant="outline" 
                          onClick={handleRevokeTermsAgreement}
                          className="flex-1"
                        >
                          Revoke Agreement
                        </Button>
                      )}
                      <Button 
                        onClick={() => setIsTermsOpen(false)}
                        className="flex-1"
                      >
                        Close
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Help Center Dialog */}
              <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start h-auto p-3">
                    <HelpCircle className="mr-3 h-4 w-4" />
                    <div className="text-left">
                      <p className="font-medium">Help Center</p>
                      <p className="text-sm text-muted-foreground">Find answers to common questions</p>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Help Center</DialogTitle>
                    <DialogDescription>
                      Frequently asked questions and help topics
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">How do I take a posture scan?</h4>
                      <p className="text-muted-foreground">
                        Navigate to the Scan tab, position yourself in front of the camera, and follow the on-screen instructions.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">How accurate are the results?</h4>
                      <p className="text-muted-foreground">
                        Our AI provides general posture analysis. For medical concerns, please consult a healthcare professional.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Can I delete my data?</h4>
                      <p className="text-muted-foreground">
                        Yes, you can delete your account and all associated data from the profile settings.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setIsHelpOpen(false)}>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Contact Support Dialog */}
              <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start h-auto p-3">
                    <MessageCircle className="mr-3 h-4 w-4" />
                    <div className="text-left">
                      <p className="font-medium">Contact Support</p>
                      <p className="text-sm text-muted-foreground">Get help from our team</p>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Contact Support</DialogTitle>
                    <DialogDescription>
                      Get in touch with our support team
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="text-center space-y-2">
                      <MessageCircle className="h-12 w-12 mx-auto text-primary" />
                      <h3 className="font-semibold">We're here to help!</h3>
                      <p className="text-sm text-muted-foreground">
                        Our support team typically responds within 24 hours.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        className="w-full" 
                        onClick={() => openExternalLink('mailto:support@posturescanbuddy.com')}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Email Support
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => openExternalLink('https://posturescanbuddy.com/support')}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit Support Portal
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsContactOpen(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Send Feedback Dialog */}
              <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start h-auto p-3">
                    <Send className="mr-3 h-4 w-4" />
                    <div className="text-left">
                      <p className="font-medium">Send Feedback</p>
                      <p className="text-sm text-muted-foreground">Help us improve the app</p>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Feedback</DialogTitle>
                    <DialogDescription>
                      Share your thoughts and help us improve PostureScan Buddy
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Tell us what you think about the app, report bugs, or suggest new features..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsFeedbackOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleFeedbackSubmit}
                      disabled={!feedbackText.trim() || isSubmittingFeedback}
                    >
                      {isSubmittingFeedback ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      {isSubmittingFeedback ? 'Sending...' : 'Send Feedback'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* About PostureScan Buddy Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Info className="mr-2 h-5 w-5" />
                About PostureScan Buddy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">PostureScan Buddy</h3>
                <p className="text-sm text-muted-foreground">
                  Your personal posture analysis companion. Track, analyze, and improve your posture with AI-powered insights and personalized recommendations.
                </p>
              </div>
              <Separator />
              <div className="space-y-2 text-center">
                <p className="text-sm text-muted-foreground">Version 1.0.0</p>
                <p className="text-xs text-muted-foreground">
                  © 2024 PostureScan Buddy. All rights reserved.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sign Out Button */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6">
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Bottom spacing */}
          <div className="h-6" />
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;