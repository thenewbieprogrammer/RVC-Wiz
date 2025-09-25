import React, { useState, useEffect, useCallback } from "react";
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
  ExternalLink,
  CheckCircle
} from "lucide-react";
import GlassCard from "~/components/GlassCard";
import { apiClient, type VoiceModel } from "~/utils/api";
import { useAuth } from "~/contexts/AuthContext";
import LoadingSpinner from "~/components/LoadingSpinner";

export default function VoiceLibrary() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // All hooks must be called at the top level
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchMode, setSearchMode] = useState<"all" | "installed">("all");
  const [voiceModels, setVoiceModels] = useState<VoiceModel[]>([]);
  const [featuredModels, setFeaturedModels] = useState<VoiceModel[]>([]);
  const [rickSanchezModels, setRickSanchezModels] = useState<VoiceModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingModels, setDownloadingModels] = useState<Set<number>>(new Set());
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'success' | 'error'}>>([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated, isLoading]);

  const loadVoiceModels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load local models from database
      const localModelsResponse = await apiClient.getLocalVoiceModels(50);
      const models = localModelsResponse.models || [];
      
      setVoiceModels(models);
      setFeaturedModels(models.filter(model => model.tags?.includes('Featured')));
      setRickSanchezModels(models.filter(model => 
        model.character?.toLowerCase().includes('rick') || 
        model.name?.toLowerCase().includes('rick')
      ));

    } catch (error) {
      console.error("Failed to load voice models:", error);
      setError("Failed to load voice models. Please make sure the backend server is running on http://localhost:8000");
      
      // Fallback to mock data if API fails
      const mockModels: VoiceModel[] = [
        {
          id: 1,
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
          id: 2, 
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
  }, []);

  // Load voice models on component mount - only if authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      loadVoiceModels();
    }
  }, [isAuthenticated, isLoading, loadVoiceModels]);

  // Function to add notifications
  const addNotification = useCallback((message: string, type: 'success' | 'error') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 6 seconds for better visibility
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  }, []);

  // Function to poll download status for models that are downloading
  const pollDownloadStatus = useCallback(async (modelId: number) => {
    try {
      const status = await apiClient.getDownloadStatus(modelId);
      
      // Get the model name for notifications
      const model = voiceModels.find(m => m.id === modelId);
      const modelName = model?.name || 'Model';
      
      // Update the model in the state
      setVoiceModels(prev => prev.map(model => 
        model.id === modelId 
          ? { ...model, ...status }
          : model
      ));
      
      // If download is complete or failed, remove from downloading set and show notification
      if (status.is_downloaded) {
        setDownloadingModels(prev => {
          const newSet = new Set(prev);
          newSet.delete(modelId);
          return newSet;
        });
        addNotification(`${modelName} downloaded successfully!`, 'success');
      } else if (status.download_error) {
        setDownloadingModels(prev => {
          const newSet = new Set(prev);
          newSet.delete(modelId);
          return newSet;
        });
        addNotification(`Failed to download ${modelName}`, 'error');
      }
    } catch (error) {
      console.error("Failed to poll download status:", error);
    }
  }, [voiceModels, addNotification]);

  // Poll download status for models that are currently downloading
  useEffect(() => {
    if (downloadingModels.size === 0) return;

    const interval = setInterval(() => {
      downloadingModels.forEach(modelId => {
        pollDownloadStatus(modelId);
      });
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [downloadingModels, pollDownloadStatus]);

  // Load voice models on component mount - only if authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      loadVoiceModels();
    }
  }, [isAuthenticated, isLoading, loadVoiceModels]);

  // Auto-search when search mode changes (if there's a search query)
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    }
  }, [searchMode]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const filters = ["Adult", "Female", "Calm", "Male", "Narration", "Friendly", "Professional", "Young", "English", "Japanese"];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadVoiceModels();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (searchMode === "all") {
        // Search voice-models.com (external API)
        const response = await apiClient.searchVoiceModels(searchQuery, 50);
        setVoiceModels(response.models || []);
      } else {
        // Search installed/downloaded models only
        const response = await apiClient.getDownloadedVoiceModels();
        const downloadedModels = response.models || [];
        
        // Filter downloaded models based on search query
        const filteredModels = downloadedModels.filter(model => 
          model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.character.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (model.tags && model.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
        );
        
        setVoiceModels(filteredModels);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setError(`Search failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
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

      {/* Main Content */}
      <div className="p-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold">Voice Library</h1>
              <p className="text-white/60 mt-2">
                {searchMode === "all" 
                  ? "Search and download voices from voice-models.com" 
                  : "Browse your downloaded voice models"
                }
              </p>
            </div>
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  try {
                    await apiClient.syncVoiceModels(50);
                    alert("Started syncing models from voice-models.com");
                    loadVoiceModels(); // Reload models
                  } catch (error) {
                    console.error("Sync failed:", error);
                    alert("Failed to sync models");
                  }
                }}
                className="glass-button bg-blue-500/20 border-blue-400/50 neon-glow-hover"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Sync Models
              </motion.button>
            </div>
          </div>
          
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
            <div className="flex flex-1 max-w-2xl gap-2">
              {/* Search Mode Dropdown */}
              <div className="relative">
                <select
                  value={searchMode}
                  onChange={(e) => setSearchMode(e.target.value as "all" | "installed")}
                  className="glass-input pr-8 pl-4 py-3 text-sm font-medium appearance-none cursor-pointer min-w-[140px]"
                >
                  <option value="all">All Voices</option>
                  <option value="installed">Installed Voices</option>
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={searchMode === "all" ? "Search voice-models.com..." : "Search installed voices..."}
                  className="glass-input pl-12 w-full"
                />
              </div>
              
              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={loading}
                className="glass-button px-4 py-3 hover:bg-blue-500/20 hover:text-blue-400 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
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
            <div>
              <h2 className="text-2xl font-bold">
                {activeTab === "explore" && (searchQuery.trim() ? "Search Results" : "Top Voice Models")}
                {activeTab === "featured" && "Featured Models"}
                {activeTab === "rick-sanchez" && "Rick Sanchez Models"}
                {activeTab === "favorites" && "Your Favorites"}
              </h2>
              {searchQuery.trim() && (
                <p className="text-white/60 mt-1">
                  {searchMode === "all" 
                    ? `Found ${voiceModels.length} models from voice-models.com for "${searchQuery}"`
                    : `Found ${voiceModels.length} installed models for "${searchQuery}"`
                  }
                </p>
              )}
            </div>
            {loading && (
              <div className="flex items-center space-x-2 text-white/60">
                <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>

          {error && (
            <div className="glass-card p-6 mb-6 border-red-400/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-red-400">
                  <span className="text-sm font-medium">Error</span>
                </div>
                <button
                  onClick={loadVoiceModels}
                  className="px-4 py-2 bg-red-500/20 border border-red-400/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors text-sm"
                >
                  Retry
                </button>
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
                    {/* Download Status */}
                    {model.is_downloaded ? (
                      <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                        <CheckCircle className="w-3 h-3" />
                        <span>Downloaded</span>
                      </div>
                    ) : model.download_error ? (
                      <div className="flex flex-col items-end space-y-1">
                        <div className="flex items-center space-x-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                          <span className="w-3 h-3">⚠</span>
                          <span>Failed</span>
                        </div>
                        <button 
                          className="text-xs text-red-400 hover:text-red-300 underline"
                          onClick={async () => {
                            try {
                              await apiClient.downloadVoiceModel(model.id);
                              
                              // Clear error and start downloading
                              setVoiceModels(prev => prev.map(m => 
                                m.id === model.id 
                                  ? { ...m, download_error: undefined, download_progress: 0.01 }
                                  : m
                              ));
                              
                              setDownloadingModels(prev => new Set(prev).add(model.id));
                              
                            } catch (error) {
                              console.error("Retry download failed:", error);
                              alert("Failed to retry download");
                            }
                          }}
                        >
                          Retry
                        </button>
                      </div>
                    ) : model.download_progress && model.download_progress > 0 ? (
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                          <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                          <span>Downloading {Math.round((model.download_progress || 0) * 100)}%</span>
                        </div>
                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500 ease-out"
                            style={{ width: `${(model.download_progress || 0) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-white/60">
                          {model.download_progress < 0.1 ? 'Starting download...' : 
                           model.download_progress < 0.5 ? 'Downloading...' : 
                           model.download_progress < 0.9 ? 'Almost done...' : 'Finalizing...'}
                        </div>
                      </div>
                    ) : (
                      <button 
                        className={`glass-button p-2 transition-colors ${
                          downloadingModels.has(model.id) 
                            ? 'bg-blue-500/20 text-blue-400 cursor-not-allowed' 
                            : 'hover:bg-green-500/20 hover:text-green-400'
                        }`}
                        onClick={async () => {
                          if (downloadingModels.has(model.id)) return;
                          
                          try {
                            // Immediately show downloading state
                            setDownloadingModels(prev => new Set(prev).add(model.id));
                            setVoiceModels(prev => prev.map(m => 
                              m.id === model.id 
                                ? { ...m, download_progress: 0.01 }
                                : m
                            ));
                            
                            // Add immediate notification
                            addNotification(`Starting download of ${model.name}...`, 'success');
                            
                            await apiClient.downloadVoiceModel(model.id);
                            
                          } catch (error) {
                            console.error("Download failed:", error);
                            
                            // Remove from downloading set on error
                            setDownloadingModels(prev => {
                              const newSet = new Set(prev);
                              newSet.delete(model.id);
                              return newSet;
                            });
                            
                            // Reset progress
                            setVoiceModels(prev => prev.map(m => 
                              m.id === model.id 
                                ? { ...m, download_progress: 0, download_error: 'Download failed' }
                                : m
                            ));
                            
                            addNotification(`Failed to download ${model.name}`, 'error');
                          }
                        }}
                        title={downloadingModels.has(model.id) ? "Downloading..." : "Download Model"}
                        disabled={downloadingModels.has(model.id)}
                      >
                        {downloadingModels.has(model.id) ? (
                          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>
                    )}
                    
                    <button 
                      className="glass-button p-2"
                      onClick={() => window.open(model.huggingface_url, '_blank')}
                      title="View on HuggingFace"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    
                    {model.is_downloaded && (
                      <button 
                        className="glass-button p-2 hover:bg-primary-500/20 hover:text-primary-400 transition-colors"
                        onClick={() => {
                          // Navigate to voice-clone page with this model selected
                          window.location.href = `/voice-clone?model=${encodeURIComponent(model.name)}`;
                        }}
                        title="Use Model"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    
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

      {/* Enhanced Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`glass-card p-4 border-l-4 shadow-lg backdrop-blur-xl ${
              notification.type === 'success' 
                ? 'border-green-400 bg-green-500/20 shadow-green-500/20' 
                : 'border-red-400 bg-red-500/20 shadow-red-500/20'
            }`}
          >
            <div className="flex items-center space-x-3">
              {notification.type === 'success' ? (
                <div className="flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <span className="w-5 h-5 text-red-400 text-lg">⚠</span>
                </div>
              )}
              <div className="flex-1">
                <span className={`text-sm font-semibold ${
                  notification.type === 'success' ? 'text-green-300' : 'text-red-300'
                }`}>
                  {notification.message}
                </span>
                {notification.type === 'success' && notification.message.includes('downloaded successfully') && (
                  <div className="text-xs text-green-400/80 mt-1">
                    🎉 Ready to use in Voice Clone!
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
