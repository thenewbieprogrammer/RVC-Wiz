import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "@remix-run/react";
import { 
  Sparkles, 
  Search, 
  Filter, 
  Plus, 
  Play, 
  Heart, 
  MoreVertical,
  Mic,
  Volume2,
  Star,
  ArrowRight,
  Clock,
  Zap,
  Download,
  ExternalLink
} from "lucide-react";
import GlassCard from "~/components/GlassCard";
import { apiClient, type VoiceModel } from "~/utils/api";

export default function VoiceLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [voiceModels, setVoiceModels] = useState<VoiceModel[]>([]);
  const [featuredModels, setFeaturedModels] = useState<VoiceModel[]>([]);
  const [rickSanchezModels, setRickSanchezModels] = useState<VoiceModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = ["Adult", "Female", "Calm", "Male", "Narration", "Friendly", "Professional", "Young", "English", "Japanese"];

  // Load voice models on component mount
  useEffect(() => {
    loadVoiceModels();
  }, []);

  const loadVoiceModels = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load different types of models in parallel
      const [topModelsResponse, featuredResponse, rickResponse] = await Promise.all([
        apiClient.getTopVoiceModels(20),
        apiClient.getFeaturedVoiceModels(),
        apiClient.getRickSanchezModels()
      ]);

      setVoiceModels(topModelsResponse.models || []);
      setFeaturedModels(featuredResponse.models || []);
      setRickSanchezModels(rickResponse.models || []);

    } catch (error) {
      console.error("Failed to load voice models:", error);
      setError("Failed to load voice models. Please try again later.");
      
      // Fallback to mock data if API fails
      const mockModels: VoiceModel[] = [
        {
          id: "rick-sanchez-1",
          name: "Rick Sanchez (Classic)",
          character: "Rick Sanchez",
          description: "The brilliant but cynical scientist from Rick and Morty",
          download_url: "#",
          huggingface_url: "#",
          model_url: "#",
          size: "245 MB",
          epochs: 500,
          type: "RVCv2",
          tags: ["Male", "Adult", "Scientist", "Cynical", "English"]
        },
        {
          id: "rick-sanchez-2", 
          name: "Rick Sanchez (High Quality)",
          character: "Rick Sanchez",
          description: "High-quality Rick Sanchez voice model with enhanced clarity",
          download_url: "#",
          huggingface_url: "#",
          model_url: "#",
          size: "312 MB",
          epochs: 800,
          type: "RVCv2",
          tags: ["Male", "Adult", "Scientist", "High Quality", "English"]
        }
      ];
      
      setVoiceModels(mockModels);
      setFeaturedModels(mockModels);
      setRickSanchezModels(mockModels);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadVoiceModels();
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.searchVoiceModels(searchQuery, 20);
      setVoiceModels(response.models);
    } catch (error) {
      console.error("Search failed:", error);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getDisplayModels = () => {
    switch (activeTab) {
      case "explore":
        return voiceModels;
      case "featured":
        return featuredModels;
      case "rick-sanchez":
        return rickSanchezModels;
      default:
        return voiceModels;
    }
  };

  const getAvatar = (name: string) => {
    return name.charAt(0).toUpperCase();
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

          {/* Clone Voice Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-button bg-primary-500/20 border-primary-400/50 neon-glow-hover mb-6"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Clone Voice
          </motion.button>

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
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Voice Library</h1>
          
          {/* Tabs */}
          <div className="flex space-x-1 glass p-1 rounded-xl w-fit">
            {[
              { key: "explore", label: "Explore" },
              { key: "featured", label: "Featured" },
              { key: "rick-sanchez", label: "Rick Sanchez" },
              { key: "favorites", label: "Favorites" }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-primary-500/20 text-primary-400"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.header>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search voices..."
                className="glass-input pl-12 w-full"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setSelectedFilters(prev => 
                      prev.includes(filter) 
                        ? prev.filter(f => f !== filter)
                        : [...prev, filter]
                    );
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilters.includes(filter)
                      ? "bg-primary-500/20 text-primary-400 border border-primary-400/50"
                      : "glass-button"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-white/70">Popularity</span>
              <ArrowRight className="w-4 h-4 text-white/50" />
            </div>

            {/* Clone Voice Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-button bg-primary-500/20 border-primary-400/50 neon-glow-hover"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Clone Voice
            </motion.button>
          </div>
        </motion.div>

        {/* Voice Models Display */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {activeTab === "explore" && "Top Voice Models"}
              {activeTab === "featured" && "Featured Models"}
              {activeTab === "rick-sanchez" && "Rick Sanchez Models"}
              {activeTab === "favorites" && "Your Favorites"}
            </h2>
            {loading && (
              <div className="flex items-center space-x-2 text-white/60">
                <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>

          {error && (
            <div className="glass-card p-6 mb-6 border-red-400/20">
              <div className="flex items-center space-x-2 text-red-400">
                <span className="text-sm font-medium">Error</span>
              </div>
              <p className="text-sm text-red-300 mt-2">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {getDisplayModels().map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-400">{getAvatar(model.character)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-xl font-semibold">{model.character}</h3>
                      <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full">
                        {model.epochs} Epochs
                      </span>
                      <span className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded-full">
                        {model.type}
                      </span>
                    </div>
                    <p className="text-white/70 mb-2">{model.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {model.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {model.tags.length > 5 && (
                        <span className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded-full">
                          +{model.tags.length - 5}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-white/50">
                      <span>Size: {model.size}</span>
                      <span>•</span>
                      <span>{model.epochs} Epochs</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="glass-button p-2"
                      onClick={() => window.open(model.download_url, '_blank')}
                      title="Download Model"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      className="glass-button p-2"
                      onClick={() => window.open(model.huggingface_url, '_blank')}
                      title="View on HuggingFace"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="glass-button p-2">
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="glass-button p-2">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {getDisplayModels().length === 0 && !loading && (
            <div className="glass-card p-12 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Volume2 className="w-8 h-8 text-white/40" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No models found</h3>
              <p className="text-white/60">
                {activeTab === "rick-sanchez" 
                  ? "No Rick Sanchez models found. Try searching for other characters."
                  : "Try adjusting your search or filters to find more models."
                }
              </p>
            </div>
          )}
        </motion.section>

      </div>
    </div>
  );
}
