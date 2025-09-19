import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "@remix-run/react";
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight
} from "lucide-react";
import { useAuth } from "~/contexts/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate("/home");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl floating"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md"
          >
            {/* Logo */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center space-x-3">
                <div className="p-2 bg-primary-500/20 rounded-xl neon-glow">
                  <Sparkles className="w-8 h-8 text-primary-400" />
                </div>
                <span className="text-2xl font-bold gradient-text">RVC-Wiz</span>
              </Link>
            </div>

            {/* Login Form */}
            <div className="glass-card p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
                <p className="text-white/70">Sign in to your account to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="glass-input pl-12 w-full"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="glass-input pl-12 pr-12 w-full"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-white/70">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full glass-button bg-primary-500/20 border-primary-400/50 neon-glow-hover py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </form>

              {/* Test Credentials Section */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-xl">
                <div className="text-center mb-3">
                  <h3 className="text-sm font-medium text-blue-300 mb-2">Test Credentials</h3>
                  <p className="text-xs text-blue-200/70">For development testing</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-200/80">Email:</span>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-black/20 px-2 py-1 rounded text-blue-100">test@rvcwiz.com</code>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText('test@rvcwiz.com')}
                        className="text-xs text-blue-300 hover:text-blue-200 transition-colors"
                        title="Copy email"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, email: 'test@rvcwiz.com' }))}
                        className="text-xs text-blue-300 hover:text-blue-200 transition-colors"
                        title="Autofill email"
                      >
                        Fill
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-200/80">Password:</span>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-black/20 px-2 py-1 rounded text-blue-100">password123</code>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText('password123')}
                        className="text-xs text-blue-300 hover:text-blue-200 transition-colors"
                        title="Copy password"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, password: 'password123' }))}
                        className="text-xs text-blue-300 hover:text-blue-200 transition-colors"
                        title="Autofill password"
                      >
                        Fill
                      </button>
                    </div>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setFormData({ email: 'test@rvcwiz.com', password: 'password123' })}
                  className="w-full mt-3 text-xs bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-200 py-2 rounded-lg transition-colors"
                >
                  Autofill All
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-dark-800 text-white/70">Or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full glass-button flex items-center justify-center space-x-2 py-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </motion.button>

              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-white/70">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary-400 hover:text-primary-300 transition-colors font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Preview/Demo */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-modal p-8 max-w-lg w-full"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Experience RVC-Wiz</h2>
              <p className="text-white/70">See what you can create with our AI voice platform</p>
            </div>

            {/* Demo Features */}
            <div className="space-y-6">
              <div className="glass p-4 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Voice Cloning</h3>
                    <p className="text-sm text-white/60">Create lifelike voice replicas</p>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-primary-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="glass p-4 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Text to Speech</h3>
                    <p className="text-sm text-white/60">Convert text to natural speech</p>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-primary-400 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>

              <div className="glass p-4 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Secure & Private</h3>
                    <p className="text-sm text-white/60">Your data is always protected</p>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-primary-400 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-white/60 text-sm">
                Join thousands of creators using RVC-Wiz
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
