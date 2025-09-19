import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { redirect } from "@remix-run/node";
import { 
  Mic, 
  Upload, 
  Play, 
  Pause, 
  Download, 
  Settings, 
  Sparkles,
  Volume2,
  FileAudio,
  Zap,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import GlassCard from "~/components/GlassCard";
import AudioPlayer from "~/components/AudioPlayer";
import LoadingSpinner from "~/components/LoadingSpinner";
import CustomDropdown from "~/components/CustomDropdown";
import { apiClient, type Model, type ProcessingRequest, type ProcessingStatus } from "~/utils/api";
import { useAuth } from "~/contexts/AuthContext";

export default function VoiceClone() {
  const { isAuthenticated, isLoading } = useAuth();

  // All hooks must be called at the top level
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
  const [textToSpeech, setTextToSpeech] = useState<string>("");
  const [isTextMode, setIsTextMode] = useState<boolean>(false);

  const loadModels = useCallback(async () => {
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
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated, isLoading]);

  // Load models on component mount - only if authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      loadModels();
    }
  }, [isAuthenticated, isLoading, loadModels]);

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
    if (isTextMode) {
      // Handle text-to-speech
      if (!textToSpeech.trim() || !selectedModel) {
        setError("Please enter text and select a model");
        return;
      }
      
      setIsProcessing(true);
      setError(null);
      
      try {
        // For now, we'll simulate text-to-speech processing
        // In a real implementation, you'd call your TTS API
        const response = await apiClient.processTextToSpeech(textToSpeech, selectedModel);
        
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
        console.error("Text-to-speech processing failed:", error);
        setError("Failed to start text-to-speech processing");
        setIsProcessing(false);
      }
    } else {
      // Handle audio file processing
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      {/* Main Layout */}
      <div className="max-w-8xl mx-auto px-8 py-12">
        <div className="grid grid-cols-12 gap-8">
          
          {/* Left Sidebar - Voice Library & Usage */}
          <aside className="col-span-3 space-y-8">
            {/* Voice Library */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-2">Voice Library</h2>
                <p className="text-slate-400 text-sm">Choose from premium voices</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-6 bg-blue-500/10 border border-blue-400/30 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Mic className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Female Voice v1.0</h3>
                      <p className="text-slate-400 text-sm">Professional, Clear</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <Volume2 className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Male Voice v1.0</h3>
                      <p className="text-slate-400 text-sm">Deep, Authoritative</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Usage</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-4xl font-bold text-white">114</span>
                    <span className="text-slate-400">/ 1000</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full" style={{ width: '11%' }}></div>
                  </div>
                  <p className="text-slate-400 text-sm mt-2">Characters used this month</p>
                </div>
                
                <button className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-400/50 rounded-xl text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25">
                  <Zap className="w-5 h-5 mr-2 inline" />
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="col-span-6 space-y-8">
            {/* Voice Cloning Studio */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Mic className="w-8 h-8 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Voice Cloning Studio</h2>
                </div>
                
                {/* Mode Toggle */}
                <div className="flex bg-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setIsTextMode(false)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      !isTextMode 
                        ? "bg-blue-500/20 text-blue-400 border border-blue-400/30" 
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    Audio Upload
                  </button>
                  <button
                    onClick={() => setIsTextMode(true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isTextMode 
                        ? "bg-blue-500/20 text-blue-400 border border-blue-400/30" 
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    Text to Speech
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                {!isTextMode ? (
                  <>
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-white/20 rounded-2xl p-16 text-center hover:border-blue-400/50 transition-colors bg-white/5">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="audio-upload"
                      />
                      <label htmlFor="audio-upload" className="cursor-pointer">
                        <div className="p-6 bg-blue-500/20 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                          <Upload className="w-12 h-12 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3">Click to upload or drag and drop</h3>
                        <p className="text-slate-400 text-lg">WAV, MP3, FLAC supported</p>
                      </label>
                    </div>

                    {/* Record Live */}
                    <div className="text-center">
                      <div className="w-full h-px bg-white/10 mb-8"></div>
                      <p className="text-slate-400 text-lg mb-6">Or Record Live</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRecord}
                        className={`px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 ${
                          isRecording 
                            ? "bg-red-500/20 border-2 border-red-400/50 text-red-400 hover:bg-red-500/30" 
                            : "bg-blue-500/20 border-2 border-blue-400/50 text-blue-400 hover:bg-blue-500/30"
                        }`}
                      >
                        <Mic className="w-6 h-6 mr-3 inline" />
                        {isRecording ? "Stop Recording" : "Start Recording"}
                      </motion.button>
                    </div>
                  </>
                ) : (
                  /* Text to Speech Input */
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-semibold text-white mb-4">
                        Enter text to convert to speech
                      </label>
                      <textarea
                        value={textToSpeech}
                        onChange={(e) => setTextToSpeech(e.target.value)}
                        placeholder="Type your text here... (e.g., 'Hello, this is Rick Sanchez speaking!')"
                        className="w-full h-32 px-6 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:border-blue-400/50 focus:outline-none resize-none"
                      />
                      <p className="text-slate-400 text-sm mt-2">
                        {textToSpeech.length} characters
                      </p>
                    </div>
                    
                    {/* Example prompts */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <h4 className="text-white font-semibold mb-4">Example prompts:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          "Hello, this is Rick Sanchez speaking!",
                          "Wubba lubba dub dub!",
                          "I'm a scientist, not a voice actor!",
                          "Welcome to the voice cloning revolution!"
                        ].map((prompt, index) => (
                          <button
                            key={index}
                            onClick={() => setTextToSpeech(prompt)}
                            className="text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-colors text-sm"
                          >
                            "{prompt}"
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comparison & Results */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 backdrop-blur-xl">
              <h2 className="text-3xl font-bold text-white mb-10">Comparison & Results</h2>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Original Audio</h3>
                  {originalAudioUrl ? (
                    <AudioPlayer src={originalAudioUrl} />
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                      <div className="p-4 bg-white/10 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <FileAudio className="w-10 h-10 text-slate-400" />
                      </div>
                      <p className="text-slate-400 text-lg">No audio file loaded</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Generated Audio</h3>
                  {generatedAudioUrl ? (
                    <AudioPlayer src={generatedAudioUrl} />
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                      <div className="p-4 bg-white/10 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <FileAudio className="w-10 h-10 text-slate-400" />
                      </div>
                      <p className="text-slate-400 text-lg">No audio file loaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>

          {/* Right Sidebar - AI Processing */}
          <aside className="col-span-3 space-y-8">
            {/* AI Processing */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">AI Processing</h2>
              </div>

              <div className="space-y-6">
                {/* Voice Model Selection */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">Voice Model</label>
                  <CustomDropdown
                    options={models.map(model => ({
                      value: model.name,
                      label: `${model.name} (${model.size} MB)`
                    }))}
                    value={selectedModel}
                    onChange={setSelectedModel}
                    placeholder="Select a voice model"
                  />
                </div>

                {/* Processing Options */}
                <div className="space-y-4">
                  <label className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                    <input type="checkbox" defaultChecked className="glass-checkbox" />
                    <span className="text-white font-medium">Enhance audio quality</span>
                  </label>
                  <label className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                    <input type="checkbox" defaultChecked className="glass-checkbox" />
                    <span className="text-white font-medium">Noise reduction</span>
                  </label>
                </div>

                {/* Process Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleProcess}
                  disabled={!uploadedFile || isProcessing}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-400/50 rounded-xl text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
                >
                  {isProcessing ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Zap className="w-6 h-6 mr-3 inline" />
                      Start Voice Cloning
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Generated Audio */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-white mb-6">Generated Audio</h2>
              {generatedAudioUrl ? (
                <div className="space-y-6">
                  <AudioPlayer src={generatedAudioUrl} />
                  <div className="grid grid-cols-2 gap-3">
                    <button className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors">
                      <Download className="w-5 h-5 mr-2 inline" />
                      Download
                    </button>
                    <button className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors">
                      <Play className="w-5 h-5 mr-2 inline" />
                      Play
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                  <div className="p-4 bg-white/10 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <FileAudio className="w-10 h-10 text-slate-400" />
                  </div>
                  <p className="text-slate-400 text-lg">No audio file loaded</p>
                </div>
              )}
            </div>

            {/* Status */}
            {processingStatus && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                <h2 className="text-xl font-semibold text-white mb-6">Processing Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Status:</span>
                    <span className={`font-semibold ${
                      processingStatus.status === 'completed' ? 'text-green-400' :
                      processingStatus.status === 'failed' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                      {processingStatus.status}
                    </span>
                  </div>
                  {processingStatus.progress && (
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${processingStatus.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-8 backdrop-blur-xl">
                <div className="flex items-center space-x-3 text-red-400 mb-4">
                  <AlertCircle className="w-6 h-6" />
                  <span className="font-semibold">Error</span>
                </div>
                <p className="text-red-300">{error}</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
