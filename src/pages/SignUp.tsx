import React, { useState } from "react";
import { auth, db } from "../lib/firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ArrowLeft, User, Mail, Lock } from "lucide-react";
import logo from "../assets/logo.png";
import { Button } from "../components/ui/button";

interface SignUpProps {
  onBack: () => void;
  onSignUpSuccess?: (user: any) => void;
}

export default function SignUp({ onBack, onSignUpSuccess }: SignUpProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
      });
      setSuccess("Account created successfully!");
      setName("");
      setEmail("");
      setPassword("");
      
      // Redirect to dashboard after successful signup
      if (onSignUpSuccess) {
        onSignUpSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
        </div>
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="h-16 mb-2" />
          <h2 className="text-2xl font-bold mb-1">Create Account</h2>
          <p className="text-muted-foreground text-sm">Sign up to get started</p>
        </div>
        <form className="space-y-4" onSubmit={handleSignUp}>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              required
              placeholder="Full Name"
              className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring focus:ring-primary"
            />
          </div>
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
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring focus:ring-primary"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
        </form>
      </div>
    </div>
  );
}
