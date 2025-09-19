import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@remix-run/react";
import { 
  Sparkles, 
  Mic, 
  Upload, 
  Play, 
  Pause, 
  Download, 
  Settings, 
  Volume2,
  FileAudio,
  Zap,
  Search,
  Filter,
  Plus,
  Clock,
  Star,
  MoreVertical,
  Bell,
  User,
  LogOut,
  ArrowRight
} from "lucide-react";
import GlassCard from "~/components/GlassCard";
import AudioPlayer from "~/components/AudioPlayer";
import LoadingSpinner from "~/components/LoadingSpinner";
import { apiClient, type Model, type ProcessingRequest, type ProcessingStatus } from "~/utils/api";

export default function Dashboard() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null);
  const [originalAudioUrl, setOriginalAudioUrl] = useState<string | null>(null);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("text-to-speech");

  // Load models on component mount
  React.useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const response = await apiClient.getModels();
      setModels(response.models);
      if (response.models.length > 0) {
        setSelectedModel(response.models[0].name);
      }
    } catch (error) {
      console.error("Failed to load models:", error);
      setError("Failed to load voice models");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setError(null);
      
      try {
        const response = await apiClient.uploadAudio(file);
        setUploadedFile(response.filename);
        
        const audioUrl = URL.createObjectURL(file);
        setOriginalAudioUrl(audioUrl);
        
      } catch (error) {
        console.error("Upload failed:", error);
        setError("Failed to upload audio file");
      }
    }
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
  };

  const handleProcess = async () => {
    if (!uploadedFile || !selectedModel) {
      setError("Please upload an audio file and select a model");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const request: ProcessingRequest = {
        model_name: selectedModel,
        enhance_quality: true,
        noise_reduction: true,
        pitch_shift: 0
      };

      const response = await apiClient.processAudio(uploadedFile, request);
      
      const pollStatus = async () => {
        try {
          const status = await apiClient.getProcessingStatus(response.task_id);
          setProcessingStatus(status);
          
          if (status.status === "completed" && status.result_file) {
            const blob = await apiClient.downloadResult(status.result_file);
            const audioUrl = URL.createObjectURL(blob);
            setGeneratedAudioUrl(audioUrl);
            setIsProcessing(false);
          } else if (status.status === "failed") {
            setError(status.message);
            setIsProcessing(false);
          } else {
            setTimeout(pollStatus, 1000);
          }
        } catch (error) {
          console.error("Status check failed:", error);
          setError("Failed to check processing status");
          setIsProcessing(false);
        }
      };

      pollStatus();
      
    } catch (error) {
      console.error("Processing failed:", error);
      setError("Failed to start processing");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl floating"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed left-0 top-0 h-full w-80 glass-sidebar z-20"
      >
        <div className="p-6 h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-primary-500/20 rounded-xl neon-glow">
              <Sparkles className="w-6 h-6 text-primary-400" />
            </div>
            <span className="text-xl font-bold gradient-text">RVC-Wiz</span>
          </div>

          {/* Clone Voice Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-button bg-primary-500/20 border-primary-400/50 neon-glow-hover mb-6"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Clone Voice
          </motion.button>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              <Mic className="w-5 h-5 text-white/70" />
              <span>Clone Voice</span>
            </Link>
            <Link
              to="/voice-library"
              className="flex items-center space-x-3 p-3 rounded-xl bg-primary-500/20 text-primary-400"
            >
              <Volume2 className="w-5 h-5" />
              <span>Voice Library</span>
            </Link>
            <Link
              to="/history"
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              <Clock className="w-5 h-5 text-white/70" />
              <span>History</span>
            </Link>
          </nav>

          {/* Product Section */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">PRODUCT</h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("text-to-speech")}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                  activeTab === "text-to-speech" 
                    ? "bg-primary-500/20 text-primary-400" 
                    : "hover:bg-white/10 text-white/70"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FileAudio className="w-5 h-5" />
                  <span>Text To Speech</span>
                </div>
                <Plus className="w-4 h-4" />
              </button>
              <Link
                to="/voice-agent"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-colors text-white/70"
              >
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5" />
                  <span>Voice Agent</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/voice-changer"
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-white/70"
              >
                <Mic className="w-5 h-5" />
                <span>Voice Changer App</span>
              </Link>
            </div>
          </div>

          {/* Usage Meter */}
          <div className="glass-card p-4 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium">Usage</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold">114</span>
              <span className="text-sm text-white/60">/ 1,000</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mb-2">
              <div className="bg-primary-400 h-2 rounded-full" style={{ width: '11%' }}></div>
            </div>
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Characters used</span>
              <Link to="/reset" className="hover:text-white transition-colors">Resets</Link>
            </div>
          </div>

          {/* Upgrade Banner */}
          <div className="glass-card p-4 mb-6 bg-orange-500/10 border-orange-400/20">
            <div className="text-center">
              <h4 className="font-semibold mb-2">Upgrade to PRO</h4>
              <p className="text-sm text-white/70 mb-3">50% OFF</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full glass-button bg-primary-500/20 border-primary-400/50 neon-glow-hover"
              >
                <Zap className="w-4 h-4 mr-2" />
                Upgrade now
              </motion.button>
            </div>
          </div>

          {/* User Account */}
          <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-400">BI</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Free Plan</p>
              <p className="text-xs text-white/60">Bilaaln101@gmail...</p>
            </div>
            <MoreVertical className="w-4 h-4 text-white/60" />
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="ml-80 p-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center space-x-2 text-white/70 mb-2">
              <span>All Projects</span>
              <span>&gt;</span>
              <span>Project with Rick Sanchez</span>
              <button className="p-1 hover:bg-white/10 rounded">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="glass-button">Generate All</button>
            <button className="glass-button">Export All</button>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Text to Speech */}
          <div className="xl:col-span-2 space-y-6">
            {/* Voice Selection */}
            <div className="glass p-4 rounded-xl flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold">Rick Sanchez</h3>
                <p className="text-sm text-white/60">Male, Adult, English</p>
              </div>
            </div>

            {/* Text Input */}
            <div className="space-y-4">
              <div className="glass-input min-h-[200px] text-left">
                Start typing here or paste any text you want to turn into lifelike speech.
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Press enter or click here to create a new paragraph</span>
                <span className="text-sm text-white/60">0/500</span>
              </div>
            </div>

            {/* Generate Section */}
            <div className="flex items-start space-x-6">
              <div className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-button bg-primary-500/20 border-primary-400/50 neon-glow-hover px-6 py-3 text-lg font-semibold mb-4"
                >
                  Generate Speech
                </motion.button>
                <div className="glass p-4 rounded-xl">
                  <p className="text-white/70">
                    This paragraph does not have any audio samples yet. Click on the button above to generate the first sample.
                  </p>
                </div>
                <button className="glass-button text-sm mt-4">
                  Get Faster Generations
                </button>
              </div>
            </div>

            {/* Example Prompts */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Try an example to get started</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { icon: FileAudio, label: "Tell a story" },
                  { icon: Sparkles, label: "Listen to a joke" },
                  { icon: Mic, label: "Narrate an ad" },
                  { icon: Play, label: "Play dramatic movie dialog" },
                  { icon: Volume2, label: "Hear from a video game character" }
                ].map((prompt, index) => (
                  <motion.button
                    key={prompt.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-button flex items-center space-x-2 p-3"
                  >
                    <prompt.icon className="w-4 h-4" />
                    <span className="text-sm">{prompt.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            {/* Settings Tabs */}
            <div className="flex space-x-1 glass p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "settings" 
                    ? "bg-primary-500/20 text-primary-400" 
                    : "text-white/70 hover:text-white"
                }`}
              >
                Settings
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "history" 
                    ? "bg-primary-500/20 text-primary-400" 
                    : "text-white/70 hover:text-white"
                }`}
              >
                History
              </button>
            </div>

            {/* Clone Voice Card */}
            <GlassCard>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Clone a voice in seconds!</h3>
                <p className="text-sm text-white/70 mb-4">Create a digital replica of any voice!</p>
                <button className="glass-button w-full">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Clone Voice
                </button>
              </div>
            </GlassCard>

            {/* Selected Voice */}
            <GlassCard>
              <h3 className="font-semibold mb-4">Selected Voice</h3>
              <div className="glass p-4 rounded-xl flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Rick Sanchez</h4>
                  <p className="text-sm text-white/60">Male, Adult, English</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/60" />
              </div>
            </GlassCard>

            {/* Enhanced Mode */}
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Enhanced Mode</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            </GlassCard>

            {/* Sliders */}
            <GlassCard>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Creativity</span>
                    <span className="text-sm text-white/60">Low</span>
                  </div>
                  <input type="range" className="glass-slider w-full" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Guidance</span>
                    <span className="text-sm text-white/60">Low</span>
                  </div>
                  <input type="range" className="glass-slider w-full" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Link to="/more-settings" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                  More settings v
                </Link>
                <Link to="/reset" className="text-sm text-white/60 hover:text-white transition-colors">
                  Reset Values
                </Link>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
