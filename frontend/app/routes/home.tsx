import { motion } from "framer-motion";
import { 
  Mic, 
  Sparkles, 
  Zap, 
  Users, 
  Shield, 
  ArrowRight,
  Play,
  Star,
  CheckCircle,
  FileText,
  Bot,
  Headphones,
  ChevronDown
} from "lucide-react";
import { Link } from "@remix-run/react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl floating"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-600/8 rounded-full blur-2xl floating" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="p-2 bg-primary-500/20 rounded-xl neon-glow">
              <Sparkles className="w-8 h-8 text-primary-400" />
            </div>
            <span className="text-2xl font-bold gradient-text">RVC-Wiz</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-6"
          >
            <Link to="/features" className="text-white/70 hover:text-white transition-colors">Text to Speech</Link>
            <div className="flex items-center space-x-1 text-white/70 hover:text-white transition-colors cursor-pointer">
              <span>Voice Changer</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <Link to="/voice-agents" className="text-white/70 hover:text-white transition-colors">Voice Agents</Link>
            <Link to="/enterprise" className="text-white/70 hover:text-white transition-colors">Enterprise</Link>
            <Link to="/audio-tools" className="text-white/70 hover:text-white transition-colors">Audio Tools</Link>
            <Link to="/signup" className="glass-button bg-primary-500/20 border-primary-400/50 neon-glow-hover">Start for Free</Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Free Real Time</span>
              <br />
              <span className="text-white">Voice Changer and AI Voice Platform</span>
            </h1>
            <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto">
              Explore voice agents, text to speech, voice cloning, and more.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link 
              to="/signup" 
              className="glass-button bg-primary-500/20 border-primary-400/50 neon-glow-hover px-8 py-4 text-lg font-semibold"
            >
              Start for Free
            </Link>
            <Link 
              to="/contact" 
              className="glass-button px-8 py-4 text-lg font-semibold"
            >
              Contact Sales
            </Link>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-16"
          >
            {[
              { icon: FileText, label: "Text to Speech", active: true },
              { icon: Bot, label: "Voice Agents", active: false },
              { icon: Mic, label: "Voice Changer", active: false },
              { icon: Sparkles, label: "Voice Cloning", active: false },
              { icon: Headphones, label: "Noise Remover", active: false }
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className={`glass-card p-4 flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform ${
                  feature.active ? 'bg-primary-500/20 border-primary-400/50' : ''
                }`}
              >
                <feature.icon className={`w-5 h-5 ${feature.active ? 'text-primary-400' : 'text-white/70'}`} />
                <span className={`font-medium ${feature.active ? 'text-primary-400' : 'text-white/70'}`}>{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="relative z-10 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="glass-card p-8"
          >
            <div className="max-w-4xl mx-auto">
              <div className="glass-input min-h-[120px] mb-6 text-left">
                In autumn's chill, Mia watched the last leaf cling to the old oak. She whispered her dreams to it daily. One stormy night, it didn't fall. Inspired, Mia pursued her passion, knowing some things, like hope, endure.
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="glass-button flex items-center space-x-2">
                    <span>Brian</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <div className="flex space-x-2">
                    <button className="glass-button text-sm">Tell a story</button>
                    <button className="glass-button text-sm">Tell me a joke</button>
                    <button className="glass-button text-sm">Create a voiceover</button>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-white/60 text-sm">213/250</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Play className="w-6 h-6 text-black ml-1" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose RVC-Wiz?</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Advanced AI technology meets beautiful design. Create professional voice content with ease.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Voice Cloning",
                description: "Create lifelike voice replicas using advanced RVC technology with just a few seconds of audio.",
                features: ["High-quality voice synthesis", "Fast processing", "Multiple voice models"]
              },
              {
                icon: Zap,
                title: "Real-Time Voice Changer",
                description: "Transform your voice in real-time with our advanced voice modification technology.",
                features: ["Live voice changing", "Multiple effects", "Low latency"]
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Your data is protected with enterprise-grade security and privacy controls.",
                features: ["End-to-end encryption", "GDPR compliant", "Secure processing"]
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.2 }}
                className="glass-card p-8"
              >
                <div className="p-3 bg-primary-500/20 rounded-2xl w-fit mb-6">
                  <feature.icon className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-white/70 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary-400" />
                      <span className="text-white/80 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="glass-card p-12"
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-white/70 mb-8">
              Join thousands of creators using RVC-Wiz to bring their content to life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/signup" 
                className="glass-button bg-primary-500/20 border-primary-400/50 neon-glow-hover px-8 py-4 text-lg font-semibold"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free Trial
              </Link>
              <Link 
                to="/demo" 
                className="glass-button px-8 py-4 text-lg font-semibold"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary-500/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-primary-400" />
                </div>
                <span className="text-xl font-bold gradient-text">RVC-Wiz</span>
              </div>
              <p className="text-white/60">
                The most advanced AI voice platform for creators and businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-white/60">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/api" className="hover:text-white transition-colors">API</Link></li>
                <li><Link to="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-white/60">
                <li><Link to="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/tutorials" className="hover:text-white transition-colors">Tutorials</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/60">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 RVC-Wiz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
