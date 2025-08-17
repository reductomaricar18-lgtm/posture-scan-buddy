import React, { useState } from "react";
import { auth, db } from "../lib/firebaseClient";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.png";
import { Button } from "../components/ui/button";

interface AuthScreenProps {
  onLogin: () => void;
  onBack: () => void;
}

const AuthScreen = ({ onLogin, onBack }: AuthScreenProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if email exists in Firestore
  const checkEmailExists = async (email: string) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isSignUp) {
        // Handle Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Store user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
          name,
          email,
          createdAt: new Date().toISOString(),
          totalScans: 0,
          averageScore: 0,
        });

        setSuccess("Account created successfully! Please sign in.");
        // Clear form and switch to login
        setName("");
        setEmail("");
        setPassword("");
        setIsSignUp(false);
      } else {
        // Handle Sign In - First check if email exists
        const emailExists = await checkEmailExists(email);
        if (!emailExists) {
          setError("Email doesn't exist. Please sign up first.");
          setLoading(false);
          return;
        }

        // If email exists, try to authenticate
        await signInWithEmailAndPassword(auth, email, password);
        
        // Log successful login to Firestore
        try {
          const user = auth.currentUser;
          if (user) {
            await setDoc(doc(db, "userActivity", `${user.uid}_${Date.now()}`), {
              userId: user.uid,
              email: user.email,
              action: "login",
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              ipAddress: "client-side", // Note: Real IP would need backend
            });
          }
        } catch (logError) {
          console.error("Error logging login activity:", logError);
          // Don't block login if logging fails
        }
        
        onLogin();
      }
    } catch (err: any) {
      console.error(isSignUp ? "Signup error:" : "Login error:", err);
      
      // Provide user-friendly error messages
      let errorMessage = "An error occurred. Please try again.";
      
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists. Please sign in instead.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters long.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setSuccess("");
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleBack = () => {
    if (isSignUp) {
      // If in signup mode, switch to login mode
      setIsSignUp(false);
      setError("");
      setSuccess("");
      setName("");
      setEmail("");
      setPassword("");
    } else {
      // If in login mode, go back to splash screen
      onBack();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        </div>
        
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="h-16 mb-2" />
          <h2 className="text-2xl font-bold mb-1">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isSignUp ? "Sign up to get started" : "Sign in to your account"}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignUp && (
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                    type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                required={isSignUp}
                    placeholder="Full Name"
                className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring focus:ring-primary"
                  />
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
                  type="email"
                  value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
              placeholder="Email"
              className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring focus:ring-primary"
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
                  value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
              placeholder="Password"
              className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
              </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading 
              ? (isSignUp ? "Creating Account..." : "Signing In...") 
              : (isSignUp ? "Create Account" : "Sign In")
            }
              </Button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-600 text-sm">
              {success}
            </div>
          )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
                <button
              onClick={toggleMode}
              className="ml-1 text-primary hover:underline font-medium"
                >
              {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </p>
            </div>
      </div>
    </div>
  );
};

export default AuthScreen;