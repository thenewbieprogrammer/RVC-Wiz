import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@remix-run/react";
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  User,
  CheckCircle
} from "lucide-react";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("Signup attempt:", formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
        {/* Left Side - Signup Form */}
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

            {/* Signup Form */}
            <div className="glass-card p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Create your account</h1>
                <p className="text-white/70">Start your journey with RVC-Wiz today</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="glass-input pl-12 w-full"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

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
                      placeholder="Create a password"
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

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="glass-input pl-12 pr-12 w-full"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-1 rounded"
                    required
                  />
                  <label className="text-sm text-white/70">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary-400 hover:text-primary-300 transition-colors">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary-400 hover:text-primary-300 transition-colors">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full glass-button bg-primary-500/20 border-primary-400/50 neon-glow-hover py-3 text-lg font-semibold"
                >
                  Create Account
                </motion.button>
              </form>

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

              {/* Sign In Link */}
              <div className="text-center mt-6">
                <p className="text-white/70">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary-400 hover:text-primary-300 transition-colors font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Benefits */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-modal p-8 max-w-lg w-full"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Why Join RVC-Wiz?</h2>
              <p className="text-white/70">Unlock the power of AI voice technology</p>
            </div>

            {/* Benefits List */}
            <div className="space-y-6">
              {[
                {
                  icon: CheckCircle,
                  title: "Free Trial",
                  description: "Start with 1,000 free characters to test our platform"
                },
                {
                  icon: CheckCircle,
                  title: "High-Quality Voices",
                  description: "Access premium AI voices with natural-sounding speech"
                },
                {
                  icon: CheckCircle,
                  title: "Real-Time Processing",
                  description: "Generate voice content in seconds, not minutes"
                },
                {
                  icon: CheckCircle,
                  title: "Secure & Private",
                  description: "Your data is encrypted and never shared with third parties"
                },
                {
                  icon: CheckCircle,
                  title: "Easy Integration",
                  description: "Simple API and SDK for developers"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="p-1 bg-primary-500/20 rounded-full">
                    <benefit.icon className="w-4 h-4 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{benefit.title}</h3>
                    <p className="text-sm text-white/60">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <div className="glass p-4 rounded-xl">
                <p className="text-sm text-white/70 mb-2">Join thousands of creators</p>
                <div className="flex items-center justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="w-4 h-4 text-primary-400" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
