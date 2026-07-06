"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Info, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const { login, resetPassword } = useAuth();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState("");

  // Canvas wave animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Wave parameters
    const waves = [
      { y: 0.5, length: 0.002, amplitude: 50, speed: 0.02, color: "rgba(140, 198, 63, 0.12)" }, // Accent Green
      { y: 0.52, length: 0.003, amplitude: 35, speed: 0.015, color: "rgba(20, 184, 166, 0.08)" }, // Cyan
      { y: 0.48, length: 0.0015, amplitude: 65, speed: 0.01, color: "rgba(140, 198, 63, 0.05)" }, // Light green
    ];

    let increment = 0;

    const animate = () => {
      const isDark = document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? "rgba(0, 0, 0, 0.08)" : "rgba(248, 249, 251, 0.15)"; // Trails
      ctx.fillRect(0, 0, width, height);

      // Draw grid line pattern overlay
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.015)" : "rgba(0, 0, 0, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw sine waves
      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, height * wave.y);

        for (let i = 0; i < width; i++) {
          const yOffset = Math.sin(i * wave.length + increment) * wave.amplitude * Math.sin(increment * 0.2);
          ctx.lineTo(i, height * wave.y + yOffset);
        }

        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      increment += waves[0].speed;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please fill out both email and password.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setForgotPasswordMsg("");

    try {
      const data = await login(email, password);

      if (data.success) {
        if (data.role === "admin" || data.role === "super_admin") {
          router.push("/admin/dashboard");
        } else if (data.role === "hr") {
          router.push("/hr/dashboard");
        } else {
          setErrorMsg("Access Denied: You do not have permissions to access these dashboards.");
        }
      } else {
        setErrorMsg(data.error || "Invalid username or password.");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMsg("Please enter your email address first to reset password.");
      return;
    }
    setErrorMsg("");
    setForgotPasswordMsg("");
    try {
      await resetPassword(email);
      setForgotPasswordMsg(`A password reset link has been dispatched to ${email} via Firebase.`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to trigger password reset email.");
    }
  };

  return (
    <div className="login-page relative min-h-screen bg-bg-primary text-text-primary font-sans overflow-hidden flex items-center justify-center p-4">
      {/* Background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
      
      {/* Blueprint Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none z-0" aria-hidden="true" />
      
      {/* Ambient glowing circles */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-[#8CC63F]/5 blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-[#14B8A6]/5 blur-3xl pointer-events-none z-0" />

      {/* Main Glassmorphic Wrapper */}
      <div className="login-card relative z-10 w-full max-w-5xl bg-bg-primary/60 border border-white/10 rounded-3xl overflow-hidden shadow-premium flex flex-col md:grid md:grid-cols-[1.1fr_1.3fr] min-h-[550px] backdrop-blur-md">
        
        {/* Left Side: Branding / Tagline */}
        <div className="login-brand-panel bg-gradient-to-br from-[#080808] to-[#111111] p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 text-left relative overflow-hidden">
          {/* Subtle circuit decoration background */}
          <div className="absolute right-0 bottom-0 w-48 h-48 opacity-10 bg-radial from-[#8CC63F] to-transparent pointer-events-none" />
          
          <div>
            <Link href="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8CC63F] rounded">
              <Image
                src="/texawave_logo.webp"
                alt="Texawave Logo"
                width={200}
                height={60}
                className="h-12 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          <div className="my-8 md:my-0">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#8CC63F] block mb-2">
              Engineering Excellence
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary leading-tight font-display">
              Empowering Engineering Talent
            </h1>
            <p className="text-text-secondary text-sm leading-relaxed mt-4 max-w-sm">
              Connecting interdisciplinary professionals to shape state-of-the-art products across hardware, software, and supply chains.
            </p>
          </div>

          <div className="text-xs text-text-secondary">
            &copy; {new Date().getFullYear()} Texawave Innovations. All rights reserved.
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="login-form-panel p-8 md:p-12 flex flex-col justify-center text-left">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary font-display">Staff Portal Login</h2>
            <p className="text-text-secondary text-xs mt-1.5">
              Secure administrator and recruitment operations login.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-950/40 border border-red-500/20 rounded-xl text-xs text-red-400 mb-6 flex items-center gap-2">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {forgotPasswordMsg && (
            <div className="p-3.5 bg-green-950/40 border border-[#8CC63F]/20 rounded-xl text-xs text-[#8CC63F] mb-6 flex items-center gap-2">
              <Info size={14} className="flex-shrink-0" />
              <span>{forgotPasswordMsg}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1.5 font-mono">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-4 text-text-secondary" />
                <input
                  type="email"
                  required
                  placeholder="hr@texawave.com or admin@texawave.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input w-full bg-bg-primary/60 border border-white/10 hover:border-white/20 focus:border-[#8CC63F] focus:outline-none rounded-xl pl-11 pr-4 py-3.5 text-sm text-text-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary font-mono">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[10px] font-bold text-[#8CC63F] hover:underline hover:text-white transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-4 text-text-secondary" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input w-full bg-bg-primary/60 border border-white/10 hover:border-white/20 focus:border-[#8CC63F] focus:outline-none rounded-xl pl-11 pr-12 py-3.5 text-sm text-text-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-text-secondary hover:text-text-primary transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-[#8CC63F] text-black py-4 rounded-xl font-bold text-xs tracking-wider uppercase hover:bg-opacity-90 transition-all shadow-crisp flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Quick Info Box for ease of testing */}
          <div className="login-demo-box mt-8 p-3.5 bg-white/5 border border-white/5 rounded-xl text-left">
            <span className="text-[10px] font-bold uppercase text-[#8CC63F] block mb-1 font-mono">
              💡 Demo Credentials:
            </span>
            <div className="text-[10px] text-text-secondary space-y-0.5 leading-relaxed font-mono">
              <p>• <strong className="text-text-primary">Admin:</strong> admin@texawave.com / adminpassword</p>
              <p>• <strong className="text-text-primary">HR:</strong> hr@texawave.com / hrpassword</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/careers"
              className="text-xs text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-1 font-semibold"
            >
              &larr; Return to Careers Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
