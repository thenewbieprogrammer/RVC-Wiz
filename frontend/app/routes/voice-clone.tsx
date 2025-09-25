import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { redirect } from "@remix-run/node";
import { Link, useSearchParams } from "@remix-run/react";
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
import { apiClient, type VoiceModel, type ProcessingRequest, type ProcessingStatus } from "~/utils/api";
import { useAuth } from "~/contexts/AuthContext";

export default function VoiceClone() {
  const { isAuthenticated, isLoading } = useAuth();
  const [searchParams] = useSearchParams();

  // All hooks must be called at the top level
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [downloadedModels, setDownloadedModels] = useState<VoiceModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null);
  const [originalAudioUrl, setOriginalAudioUrl] = useState<string | null>(null);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [textToSpeech, setTextToSpeech] = useState<string>("");
  const [isTextMode, setIsTextMode] = useState<boolean>(false);
  const [microphoneDevices, setMicrophoneDevices] = useState<any[]>([]);
  const [selectedMicrophone, setSelectedMicrophone] = useState<number | null>(null);
  const [isLiveRecording, setIsLiveRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(5);

  const loadDownloadedModels = useCallback(async () => {
    try {
      const response = await apiClient.getDownloadedVoiceModels();
      // The /downloaded endpoint already returns only downloaded models, no need to filter
      const models = response.models || [];
      setDownloadedModels(models);
      
      // Check if a model was passed via URL parameter
      const modelParam = searchParams.get('model');
      if (modelParam && models.some(model => model.name === modelParam)) {
        setSelectedModel(modelParam);
      } else if (models.length > 0) {
        setSelectedModel(models[0].name);
      }
    } catch (error) {
      console.error("Failed to load downloaded models:", error);
      setError("Failed to load downloaded voice models. Please download some models from the Voice Library first.");
    }
  }, [searchParams]);

  const loadMicrophoneDevices = useCallback(async () => {
    try {
      const response = await apiClient.getMicrophoneDevices();
      setMicrophoneDevices(response.devices);
      if (response.devices.length > 0) {
        // Select default device or first available
        const defaultDevice = response.devices.find(d => d.is_default) || response.devices[0];
        setSelectedMicrophone(defaultDevice.device_id);
      }
    } catch (error) {
      console.error("Failed to load microphone devices:", error);
      setError("Failed to load microphone devices");
    }
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isAuthenticated, isLoading]);

  // Load downloaded models and microphone devices on component mount - only if authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      loadDownloadedModels();
      loadMicrophoneDevices();
    }
  }, [isAuthenticated, isLoading, loadDownloadedModels, loadMicrophoneDevices]);

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

  const handleRecord = async () => {
    if (isLiveRecording) {
      // Stop live recording
      try {
        await apiClient.stopLiveRecording();
        setIsLiveRecording(false);
      } catch (error) {
        console.error("Failed to stop live recording:", error);
        setError("Failed to stop live recording");
      }
    } else {
      // Start live recording
      if (!selectedModel) {
        setError("Please select a voice model first");
        return;
      }
      
      try {
        const response = await apiClient.startLiveRecording(selectedModel);
        if (response.success) {
          setIsLiveRecording(true);
          setError(null);
        } else {
          setError(response.message);
        }
      } catch (error) {
        console.error("Failed to start live recording:", error);
        setError("Failed to start live recording");
      }
    }
  };

  const handleRecordAndProcess = async () => {
    if (!selectedModel) {
      setError("Please select a voice model first");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await apiClient.recordAndProcess(recordingDuration, selectedModel);
      if (response.success && response.output_file) {
        // Download and play the processed audio
        const blob = await apiClient.downloadResult(response.output_file);
        const audioUrl = URL.createObjectURL(blob);
        setGeneratedAudioUrl(audioUrl);
        setIsProcessing(false);
      } else {
        setError(response.message || "Recording and processing failed");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Record and process failed:", error);
      setError("Failed to record and process audio");
      setIsProcessing(false);
    }
  };

  const handleProcess = async () => {
    if (isTextMode) {
      // Handle text-to-speech
      if (!textToSpeech.trim() || !selectedModel) {
        setError("Please enter text and select a model");
        return;
      }
      
      setIsProcessing(true);
      setIsGenerating(true);
      setGenerationProgress(0);
      setError(null);
      setProcessingStatus(null);
      
      try {
        // Call the TTS API
        const response = await apiClient.processTextToSpeech(textToSpeech, selectedModel);
        
        // Check if the response indicates TTS engine is not available
        if (response.status === "failed" && response.message?.includes("TTS engine")) {
          setError("TTS engine is currently not available. Please try using the Audio Upload mode instead, or restart the server to fix the TTS engine.");
          setIsProcessing(false);
          setIsGenerating(false);
          return;
        }
        
        // Check if we got a valid task_id
        if (!response.task_id) {
          setError("Failed to start TTS processing. Please try again.");
          setIsProcessing(false);
          setIsGenerating(false);
          return;
        }
        
        // Set initial status
        setProcessingStatus({
          task_id: response.task_id,
          status: "processing",
          progress: 0,
          message: "Starting audio generation..."
        });
        
        const pollStatus = async () => {
          try {
            const status = await apiClient.getProcessingStatus(response.task_id);
            setProcessingStatus(status);
            
            // Update progress
            if (status.progress) {
              setGenerationProgress(status.progress);
            } else {
              // Simulate progress if not provided
              setGenerationProgress(prev => Math.min(prev + 10, 90));
            }
            
            if (status.status === "completed" && status.result_file) {
              setGenerationProgress(100);
              setProcessingStatus({
                ...status,
                message: "Audio generation completed! Downloading..."
              });
              
              // Download the generated audio
              const blob = await apiClient.downloadResult(status.result_file);
              const audioUrl = URL.createObjectURL(blob);
              setGeneratedAudioUrl(audioUrl);
              
              setProcessingStatus({
                ...status,
                message: "Audio ready for playback!"
              });
              
              setIsProcessing(false);
              setIsGenerating(false);
            } else if (status.status === "failed") {
              setError(status.message || "TTS processing failed. Please try using the Audio Upload mode instead.");
              setIsProcessing(false);
              setIsGenerating(false);
            } else {
              // Continue polling
              setTimeout(pollStatus, 1000);
            }
          } catch (error) {
            console.error("Status check failed:", error);
            // Show the actual error message
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            setError(`Status check failed: ${errorMessage}. Please try again.`);
            setIsProcessing(false);
            setIsGenerating(false);
          }
        };

        // Start polling after a short delay
        setTimeout(pollStatus, 500);
      } catch (error) {
        console.error("Text-to-speech processing failed:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        setError(`Failed to start text-to-speech processing: ${errorMessage}. Please try again.`);
        setIsProcessing(false);
        setIsGenerating(false);
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
                <h2 className="text-xl font-semibold text-white mb-2">Downloaded Models</h2>
                <p className="text-slate-400 text-sm">
                  {downloadedModels.length} model{downloadedModels.length !== 1 ? 's' : ''} available
                </p>
              </div>
              
              <div className="h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                <div className="space-y-4 pr-2">
                  {downloadedModels.length > 0 ? (
                    downloadedModels.map((model, index) => (
                      <div 
                        key={model.id}
                        className={`p-4 rounded-xl transition-colors cursor-pointer ${
                          selectedModel === model.name 
                            ? "bg-blue-500/10 border border-blue-400/30" 
                            : "bg-white/5 border border-white/10 hover:bg-white/10"
                        }`}
                        onClick={() => setSelectedModel(model.name)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            selectedModel === model.name ? "bg-blue-500/20" : "bg-white/10"
                          }`}>
                            <Mic className={`w-4 h-4 ${
                              selectedModel === model.name ? "text-blue-400" : "text-slate-400"
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm truncate">{model.name}</h3>
                            <p className="text-slate-400 text-xs truncate">{model.character}</p>
                          </div>
                          {selectedModel === model.name && (
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 bg-yellow-500/10 border border-yellow-400/30 rounded-xl text-center">
                      <div className="p-3 bg-yellow-500/20 rounded-lg w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                        <Download className="w-6 h-6 text-yellow-400" />
                      </div>
                      <p className="text-yellow-400 text-sm mb-3">No models downloaded</p>
                      <Link 
                        to="/voice-library" 
                        className="text-yellow-300 hover:text-yellow-200 underline text-sm"
                      >
                        Browse Voice Library
                      </Link>
                    </div>
                  )}
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
                      
                      {/* Microphone Selection */}
                      {microphoneDevices.length > 0 && (
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-white mb-3">Microphone</label>
                          <CustomDropdown
                            options={microphoneDevices.map(device => ({
                              value: device.device_id.toString(),
                              label: `${device.name} ${device.is_default ? '(Default)' : ''}`
                            }))}
                            value={selectedMicrophone?.toString() || ""}
                            onChange={(value) => setSelectedMicrophone(parseInt(value))}
                            placeholder="Select microphone"
                          />
                        </div>
                      )}
                      
                      {/* Recording Duration */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-white mb-3">Recording Duration</label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="range"
                            min="1"
                            max="30"
                            value={recordingDuration}
                            onChange={(e) => setRecordingDuration(parseInt(e.target.value))}
                            className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-white font-medium min-w-[3rem]">{recordingDuration}s</span>
                        </div>
                      </div>
                      
                      {/* Recording Buttons */}
                      <div className="space-y-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleRecord}
                          disabled={!selectedModel || downloadedModels.length === 0}
                          className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                            isLiveRecording 
                              ? "bg-red-500/20 border-2 border-red-400/50 text-red-400 hover:bg-red-500/30" 
                              : "bg-blue-500/20 border-2 border-blue-400/50 text-blue-400 hover:bg-blue-500/30"
                          }`}
                        >
                          <Mic className="w-5 h-5 mr-2 inline" />
                          {isLiveRecording ? "Stop Live Recording" : "Start Live Recording"}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleRecordAndProcess}
                          disabled={!selectedModel || downloadedModels.length === 0 || isProcessing}
                          className="px-8 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-green-500/20 border-2 border-green-400/50 text-green-400 hover:bg-green-500/30"
                        >
                          {isProcessing ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <>
                              <Mic className="w-5 h-5 mr-2 inline" />
                              Record & Process ({recordingDuration}s)
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Text to Speech Input */
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-semibold text-white mb-4">
                        Enter text to convert to speech
                      </label>
                      <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-xl">
                        <p className="text-yellow-400 text-sm">
                          <strong>Note:</strong> If you encounter TTS engine errors, try using the "Audio Upload" mode instead. 
                          You can record your voice or upload an audio file to clone it with the selected model.
                        </p>
                      </div>
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
                  {downloadedModels.length > 0 ? (
                    <CustomDropdown
                      options={downloadedModels.map(model => ({
                        value: model.name,
                        label: `${model.name} (${model.size})`
                      }))}
                      value={selectedModel}
                      onChange={setSelectedModel}
                      placeholder="Select a downloaded voice model"
                    />
                  ) : (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-xl">
                      <p className="text-yellow-400 text-sm">
                        No downloaded models found. Please visit the{" "}
                        <Link to="/voice-library" className="underline hover:text-yellow-300">
                          Voice Library
                        </Link>{" "}
                        to download some models first.
                      </p>
                    </div>
                  )}
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
                  disabled={(!uploadedFile && !isTextMode) || !selectedModel || isProcessing || downloadedModels.length === 0}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-400/50 rounded-xl text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3 inline"></div>
                      {isTextMode ? "Generating Audio..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6 mr-3 inline" />
                      {isTextMode ? "Generate Voice Audio" : "Start Voice Cloning"}
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

            {/* Audio Generation Status */}
            {isGenerating && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                <h2 className="text-xl font-semibold text-white mb-6">🎵 Audio Generation</h2>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Generating Audio...</h3>
                    <p className="text-slate-400 text-sm">
                      {processingStatus?.message || "Processing your text with the selected voice model"}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Progress:</span>
                      <span className="text-blue-400 font-semibold">{generationProgress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${generationProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-slate-400 text-sm">
                      This may take a few moments. The audio will be saved to the outputs directory and ready for playback.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Processing Status */}
            {processingStatus && !isGenerating && (
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
