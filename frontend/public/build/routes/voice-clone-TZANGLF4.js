import {
  apiClient
} from "/build/_shared/chunk-IXVPANFZ.js";
import {
  AlertCircle,
  ChevronDown,
  Download,
  FileAudio,
  Mic,
  Pause,
  Play,
  Settings,
  Sparkles,
  Upload,
  Volume2,
  VolumeX,
  Zap,
  motion
} from "/build/_shared/chunk-7NFSZCFO.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-CBDF6H27.js";
import {
  require_react
} from "/build/_shared/chunk-G4YTFA6Y.js";
import {
  createHotContext
} from "/build/_shared/chunk-PAD7UL62.js";
import "/build/_shared/chunk-TLBAXOHZ.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/voice-clone.tsx
var import_react3 = __toESM(require_react(), 1);

// app/components/AudioPlayer.tsx
var import_react = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\AudioPlayer.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\AudioPlayer.tsx"
  );
  import.meta.hot.lastModified = "1758243793651.973";
}
function AudioPlayer({
  src,
  title = "Audio",
  className = ""
}) {
  _s();
  const [isPlaying, setIsPlaying] = (0, import_react.useState)(false);
  const [currentTime, setCurrentTime] = (0, import_react.useState)(0);
  const [duration, setDuration] = (0, import_react.useState)(0);
  const [volume, setVolume] = (0, import_react.useState)(1);
  const [isMuted, setIsMuted] = (0, import_react.useState)(false);
  const audioRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    const audio = audioRef.current;
    if (!audio)
      return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [src]);
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio)
      return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };
  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio)
      return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };
  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    if (!audio)
      return;
    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio)
      return;
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  const handleDownload = () => {
    if (src) {
      const link = document.createElement("a");
      link.href = src;
      link.download = `${title}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `glass-card p-4 ${className}`, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("audio", { ref: audioRef, src, preload: "metadata" }, void 0, false, {
      fileName: "app/components/AudioPlayer.tsx",
      lineNumber: 101,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-medium text-white/90", children: title }, void 0, false, {
        fileName: "app/components/AudioPlayer.tsx",
        lineNumber: 104,
        columnNumber: 9
      }, this),
      src && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, { whileHover: {
        scale: 1.05
      }, whileTap: {
        scale: 0.95
      }, onClick: handleDownload, className: "glass-button p-2", title: "Download", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "w-4 h-4" }, void 0, false, {
        fileName: "app/components/AudioPlayer.tsx",
        lineNumber: 110,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/components/AudioPlayer.tsx",
        lineNumber: 105,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AudioPlayer.tsx",
      lineNumber: 103,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-3", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "range", min: "0", max: duration || 0, value: currentTime, onChange: handleSeek, className: "w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider", style: {
        background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${currentTime / duration * 100}%, rgba(255,255,255,0.1) ${currentTime / duration * 100}%, rgba(255,255,255,0.1) 100%)`
      } }, void 0, false, {
        fileName: "app/components/AudioPlayer.tsx",
        lineNumber: 116,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-between text-xs text-white/50 mt-1", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: formatTime(currentTime) }, void 0, false, {
          fileName: "app/components/AudioPlayer.tsx",
          lineNumber: 120,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: formatTime(duration) }, void 0, false, {
          fileName: "app/components/AudioPlayer.tsx",
          lineNumber: 121,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AudioPlayer.tsx",
        lineNumber: 119,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AudioPlayer.tsx",
      lineNumber: 115,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, { whileHover: {
        scale: 1.05
      }, whileTap: {
        scale: 0.95
      }, onClick: togglePlay, disabled: !src, className: "glass-button p-3 disabled:opacity-50 disabled:cursor-not-allowed", children: isPlaying ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pause, { className: "w-5 h-5" }, void 0, false, {
        fileName: "app/components/AudioPlayer.tsx",
        lineNumber: 132,
        columnNumber: 24
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Play, { className: "w-5 h-5" }, void 0, false, {
        fileName: "app/components/AudioPlayer.tsx",
        lineNumber: 132,
        columnNumber: 56
      }, this) }, void 0, false, {
        fileName: "app/components/AudioPlayer.tsx",
        lineNumber: 127,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-2 flex-1", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, { whileHover: {
          scale: 1.05
        }, whileTap: {
          scale: 0.95
        }, onClick: toggleMute, className: "glass-button p-2", children: isMuted ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(VolumeX, { className: "w-4 h-4" }, void 0, false, {
          fileName: "app/components/AudioPlayer.tsx",
          lineNumber: 141,
          columnNumber: 24
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Volume2, { className: "w-4 h-4" }, void 0, false, {
          fileName: "app/components/AudioPlayer.tsx",
          lineNumber: 141,
          columnNumber: 58
        }, this) }, void 0, false, {
          fileName: "app/components/AudioPlayer.tsx",
          lineNumber: 136,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "range", min: "0", max: "1", step: "0.1", value: isMuted ? 0 : volume, onChange: handleVolumeChange, className: "flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider" }, void 0, false, {
          fileName: "app/components/AudioPlayer.tsx",
          lineNumber: 144,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AudioPlayer.tsx",
        lineNumber: 135,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AudioPlayer.tsx",
      lineNumber: 126,
      columnNumber: 7
    }, this),
    !src && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center py-8 text-white/50", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: "No audio file loaded" }, void 0, false, {
      fileName: "app/components/AudioPlayer.tsx",
      lineNumber: 149,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/components/AudioPlayer.tsx",
      lineNumber: 148,
      columnNumber: 16
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/AudioPlayer.tsx",
    lineNumber: 100,
    columnNumber: 10
  }, this);
}
_s(AudioPlayer, "+Gf+NDA2yg1YbQZ8yy7WtNRp3fI=");
_c = AudioPlayer;
var _c;
$RefreshReg$(_c, "AudioPlayer");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/LoadingSpinner.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\LoadingSpinner.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\LoadingSpinner.tsx"
  );
  import.meta.hot.lastModified = "1758243793651.973";
}
function LoadingSpinner({
  size = "md",
  className = ""
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: `flex items-center justify-center ${className}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(motion.div, { className: `${sizeClasses[size]} border-2 border-white/20 border-t-primary-400 rounded-full`, animate: {
    rotate: 360
  }, transition: {
    duration: 1,
    repeat: Infinity,
    ease: "linear"
  } }, void 0, false, {
    fileName: "app/components/LoadingSpinner.tsx",
    lineNumber: 32,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/components/LoadingSpinner.tsx",
    lineNumber: 31,
    columnNumber: 10
  }, this);
}
_c2 = LoadingSpinner;
var _c2;
$RefreshReg$(_c2, "LoadingSpinner");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/CustomDropdown.tsx
var import_react2 = __toESM(require_react(), 1);
var import_jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\CustomDropdown.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\CustomDropdown.tsx"
  );
  import.meta.hot.lastModified = "1758248159262.8535";
}
function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = ""
}) {
  _s2();
  const [isOpen, setIsOpen] = (0, import_react2.useState)(false);
  const dropdownRef = (0, import_react2.useRef)(null);
  const selectedOption = options.find((option) => option.value === value);
  (0, import_react2.useEffect)(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: `custom-dropdown ${className}`, ref: dropdownRef, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("button", { type: "button", className: "custom-dropdown-button", onClick: () => setIsOpen(!isOpen), children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("span", { className: selectedOption ? "text-white" : "text-white/50", children: selectedOption ? selectedOption.label : placeholder }, void 0, false, {
        fileName: "app/components/CustomDropdown.tsx",
        lineNumber: 48,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(ChevronDown, { className: `w-4 h-4 text-white/50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}` }, void 0, false, {
        fileName: "app/components/CustomDropdown.tsx",
        lineNumber: 51,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/CustomDropdown.tsx",
      lineNumber: 47,
      columnNumber: 7
    }, this),
    isOpen && /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "custom-dropdown-menu", children: options.map((option) => /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: `custom-dropdown-item ${option.value === value ? "selected" : ""}`, onClick: () => {
      onChange(option.value);
      setIsOpen(false);
    }, children: option.label }, option.value, false, {
      fileName: "app/components/CustomDropdown.tsx",
      lineNumber: 55,
      columnNumber: 34
    }, this)) }, void 0, false, {
      fileName: "app/components/CustomDropdown.tsx",
      lineNumber: 54,
      columnNumber: 18
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/CustomDropdown.tsx",
    lineNumber: 46,
    columnNumber: 10
  }, this);
}
_s2(CustomDropdown, "uhOyve9TWk+bvhPJTPlaMsUEQAY=");
_c3 = CustomDropdown;
var _c3;
$RefreshReg$(_c3, "CustomDropdown");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/routes/voice-clone.tsx
var import_jsx_dev_runtime4 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\voice-clone.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s3 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\voice-clone.tsx"
  );
  import.meta.hot.lastModified = "1758249152382.5288";
}
function VoiceClone() {
  _s3();
  const [isRecording, setIsRecording] = (0, import_react3.useState)(false);
  const [isProcessing, setIsProcessing] = (0, import_react3.useState)(false);
  const [audioFile, setAudioFile] = (0, import_react3.useState)(null);
  const [uploadedFile, setUploadedFile] = (0, import_react3.useState)(null);
  const [models, setModels] = (0, import_react3.useState)([]);
  const [selectedModel, setSelectedModel] = (0, import_react3.useState)("");
  const [processingStatus, setProcessingStatus] = (0, import_react3.useState)(null);
  const [originalAudioUrl, setOriginalAudioUrl] = (0, import_react3.useState)(null);
  const [generatedAudioUrl, setGeneratedAudioUrl] = (0, import_react3.useState)(null);
  const [error, setError] = (0, import_react3.useState)(null);
  (0, import_react3.useEffect)(() => {
    loadModels();
  }, []);
  const loadModels = async () => {
    try {
      const response = await apiClient.getModels();
      setModels(response.models);
      if (response.models.length > 0) {
        setSelectedModel(response.models[0].name);
      }
    } catch (error2) {
      console.error("Failed to load models:", error2);
      setError("Failed to load voice models");
    }
  };
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      setError(null);
      try {
        const response = await apiClient.uploadAudio(file);
        setUploadedFile(response.filename);
        const audioUrl = URL.createObjectURL(file);
        setOriginalAudioUrl(audioUrl);
      } catch (error2) {
        console.error("Upload failed:", error2);
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
      const request = {
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
            setTimeout(pollStatus, 1e3);
          }
        } catch (error2) {
          console.error("Status check failed:", error2);
          setError("Failed to check processing status");
          setIsProcessing(false);
        }
      };
      pollStatus();
    } catch (error2) {
      console.error("Processing failed:", error2);
      setError("Failed to start processing");
      setIsProcessing(false);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" }, void 0, false, {
      fileName: "app/routes/voice-clone.tsx",
      lineNumber: 122,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("header", { className: "relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "max-w-8xl mx-auto px-8 py-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "p-3 bg-blue-500/20 rounded-2xl border border-blue-400/30", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Sparkles, { className: "w-8 h-8 text-blue-400" }, void 0, false, {
          fileName: "app/routes/voice-clone.tsx",
          lineNumber: 130,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/voice-clone.tsx",
          lineNumber: 129,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("h1", { className: "text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent", children: "RVC-Wiz" }, void 0, false, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 133,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("p", { className: "text-slate-400 text-sm", children: "AI-Powered Voice Cloning Platform" }, void 0, false, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 136,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-clone.tsx",
          lineNumber: 132,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/voice-clone.tsx",
        lineNumber: 128,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("button", { className: "px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-200 backdrop-blur-sm", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Settings, { className: "w-5 h-5 mr-2 inline" }, void 0, false, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 142,
            columnNumber: 17
          }, this),
          "Settings"
        ] }, void 0, true, {
          fileName: "app/routes/voice-clone.tsx",
          lineNumber: 141,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("button", { className: "px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-400/50 rounded-xl text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Zap, { className: "w-5 h-5 mr-2 inline" }, void 0, false, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 146,
            columnNumber: 17
          }, this),
          "Upgrade Pro"
        ] }, void 0, true, {
          fileName: "app/routes/voice-clone.tsx",
          lineNumber: 145,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/voice-clone.tsx",
        lineNumber: 140,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/voice-clone.tsx",
      lineNumber: 127,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/voice-clone.tsx",
      lineNumber: 126,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/voice-clone.tsx",
      lineNumber: 125,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "max-w-8xl mx-auto px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "grid grid-cols-12 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("aside", { className: "col-span-3 space-y-8", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "mb-8", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("h2", { className: "text-xl font-semibold text-white mb-2", children: "Voice Library" }, void 0, false, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 163,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("p", { className: "text-slate-400 text-sm", children: "Choose from premium voices" }, void 0, false, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 164,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 162,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "p-6 bg-blue-500/10 border border-blue-400/30 rounded-xl", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "flex items-center space-x-4", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "p-3 bg-blue-500/20 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Mic, { className: "w-6 h-6 text-blue-400" }, void 0, false, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 171,
                columnNumber: 23
              }, this) }, void 0, false, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 170,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("h3", { className: "font-semibold text-white", children: "Female Voice v1.0" }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 174,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("p", { className: "text-slate-400 text-sm", children: "Professional, Clear" }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 175,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 173,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 169,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 168,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "flex items-center space-x-4", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "p-3 bg-white/10 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Volume2, { className: "w-6 h-6 text-slate-400" }, void 0, false, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 183,
                columnNumber: 23
              }, this) }, void 0, false, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 182,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("h3", { className: "font-semibold text-white", children: "Male Voice v1.0" }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 186,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("p", { className: "text-slate-400 text-sm", children: "Deep, Authoritative" }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 187,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 185,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 181,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 180,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 167,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-clone.tsx",
          lineNumber: 161,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "mb-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("h2", { className: "text-xl font-semibold text-white mb-2", children: "Usage" }, void 0, false, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 197,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 196,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "flex items-baseline justify-between mb-2", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("span", { className: "text-4xl font-bold text-white", children: "114" }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 203,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("span", { className: "text-slate-400", children: "/ 1000" }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 204,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 202,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "w-full bg-white/10 rounded-full h-3", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full", style: {
                width: "11%"
              } }, void 0, false, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 207,
                columnNumber: 21
              }, this) }, void 0, false, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 206,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("p", { className: "text-slate-400 text-sm mt-2", children: "Characters used this month" }, void 0, false, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 211,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 201,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("button", { className: "w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-400/50 rounded-xl text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Zap, { className: "w-5 h-5 mr-2 inline" }, void 0, false, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 215,
                columnNumber: 19
              }, this),
              "Upgrade to Pro"
            ] }, void 0, true, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 214,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 200,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-clone.tsx",
          lineNumber: 195,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/voice-clone.tsx",
        lineNumber: 159,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("main", { className: "col-span-6 space-y-8", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "bg-white/5 border border-white/10 rounded-2xl p-10 backdrop-blur-xl", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "flex items-center space-x-3 mb-10", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "p-3 bg-blue-500/20 rounded-xl", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Mic, { className: "w-8 h-8 text-blue-400" }, void 0, false, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 228,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 227,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("h2", { className: "text-3xl font-bold text-white", children: "Voice Cloning Studio" }, void 0, false, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 230,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 226,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "space-y-8", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "border-2 border-dashed border-white/20 rounded-2xl p-16 text-center hover:border-blue-400/50 transition-colors bg-white/5", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("input", { type: "file", accept: "audio/*", onChange: handleFileUpload, className: "hidden", id: "audio-upload" }, void 0, false, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 236,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("label", { htmlFor: "audio-upload", className: "cursor-pointer", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "p-6 bg-blue-500/20 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Upload, { className: "w-12 h-12 text-blue-400" }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 239,
                  columnNumber: 23
                }, this) }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 238,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("h3", { className: "text-2xl font-semibold text-white mb-3", children: "Click to upload or drag and drop" }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 241,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("p", { className: "text-slate-400 text-lg", children: "WAV, MP3, FLAC supported" }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 242,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 237,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 235,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "text-center", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "w-full h-px bg-white/10 mb-8" }, void 0, false, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 248,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("p", { className: "text-slate-400 text-lg mb-6", children: "Or Record Live" }, void 0, false, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 249,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(motion.button, { whileHover: {
                scale: 1.05
              }, whileTap: {
                scale: 0.95
              }, onClick: handleRecord, className: `px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 ${isRecording ? "bg-red-500/20 border-2 border-red-400/50 text-red-400 hover:bg-red-500/30" : "bg-blue-500/20 border-2 border-blue-400/50 text-blue-400 hover:bg-blue-500/30"}`, children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Mic, { className: "w-6 h-6 mr-3 inline" }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 255,
                  columnNumber: 21
                }, this),
                isRecording ? "Stop Recording" : "Start Recording"
              ] }, void 0, true, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 250,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 247,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 233,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-clone.tsx",
          lineNumber: 225,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "bg-white/5 border border-white/10 rounded-2xl p-10 backdrop-blur-xl", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("h2", { className: "text-3xl font-bold text-white mb-10", children: "Comparison & Results" }, void 0, false, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 264,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "grid grid-cols-2 gap-8", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("h3", { className: "text-xl font-semibold text-white mb-6", children: "Original Audio" }, void 0, false, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 268,
                columnNumber: 19
              }, this),
              originalAudioUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(AudioPlayer, { src: originalAudioUrl }, void 0, false, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 269,
                columnNumber: 39
              }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "bg-white/5 border border-white/10 rounded-2xl p-12 text-center", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "p-4 bg-white/10 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(FileAudio, { className: "w-10 h-10 text-slate-400" }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 271,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 270,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("p", { className: "text-slate-400 text-lg", children: "No audio file loaded" }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 273,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 269,
                columnNumber: 80
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 267,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("h3", { className: "text-xl font-semibold text-white mb-6", children: "Generated Audio" }, void 0, false, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 278,
                columnNumber: 19
              }, this),
              generatedAudioUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(AudioPlayer, { src: generatedAudioUrl }, void 0, false, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 279,
                columnNumber: 40
              }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "bg-white/5 border border-white/10 rounded-2xl p-12 text-center", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "p-4 bg-white/10 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(FileAudio, { className: "w-10 h-10 text-slate-400" }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 281,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 280,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("p", { className: "text-slate-400 text-lg", children: "No audio file loaded" }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 283,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 279,
                columnNumber: 82
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 277,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 266,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-clone.tsx",
          lineNumber: 263,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/voice-clone.tsx",
        lineNumber: 223,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("aside", { className: "col-span-3 space-y-8", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "flex items-center space-x-3 mb-8", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "p-3 bg-blue-500/20 rounded-xl", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Zap, { className: "w-6 h-6 text-blue-400" }, void 0, false, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 296,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 295,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("h2", { className: "text-xl font-semibold text-white", children: "AI Processing" }, void 0, false, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 298,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 294,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("label", { className: "block text-sm font-medium text-white mb-3", children: "Voice Model" }, void 0, false, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 304,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(CustomDropdown, { options: models.map((model) => ({
                value: model.name,
                label: `${model.name} (${model.size} MB)`
              })), value: selectedModel, onChange: setSelectedModel, placeholder: "Select a voice model" }, void 0, false, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 305,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 303,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "space-y-4", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("label", { className: "flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("input", { type: "checkbox", defaultChecked: true, className: "glass-checkbox" }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 314,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("span", { className: "text-white font-medium", children: "Enhance audio quality" }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 315,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 313,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("label", { className: "flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("input", { type: "checkbox", defaultChecked: true, className: "glass-checkbox" }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 318,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("span", { className: "text-white font-medium", children: "Noise reduction" }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 319,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 317,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 312,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(motion.button, { whileHover: {
              scale: 1.02
            }, whileTap: {
              scale: 0.98
            }, onClick: handleProcess, disabled: !uploadedFile || isProcessing, className: "w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-400/50 rounded-xl text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg", children: isProcessing ? /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(LoadingSpinner, { size: "sm" }, void 0, false, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 329,
              columnNumber: 35
            }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_jsx_dev_runtime4.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Zap, { className: "w-6 h-6 mr-3 inline" }, void 0, false, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 330,
                columnNumber: 23
              }, this),
              "Start Voice Cloning"
            ] }, void 0, true, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 329,
              columnNumber: 66
            }, this) }, void 0, false, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 324,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 301,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-clone.tsx",
          lineNumber: 293,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("h2", { className: "text-xl font-semibold text-white mb-6", children: "Generated Audio" }, void 0, false, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 339,
            columnNumber: 15
          }, this),
          generatedAudioUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(AudioPlayer, { src: generatedAudioUrl }, void 0, false, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 341,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("button", { className: "px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Download, { className: "w-5 h-5 mr-2 inline" }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 344,
                  columnNumber: 23
                }, this),
                "Download"
              ] }, void 0, true, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 343,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("button", { className: "px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Play, { className: "w-5 h-5 mr-2 inline" }, void 0, false, {
                  fileName: "app/routes/voice-clone.tsx",
                  lineNumber: 348,
                  columnNumber: 23
                }, this),
                "Play"
              ] }, void 0, true, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 347,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 342,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 340,
            columnNumber: 36
          }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "bg-white/5 border border-white/10 rounded-2xl p-12 text-center", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "p-4 bg-white/10 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(FileAudio, { className: "w-10 h-10 text-slate-400" }, void 0, false, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 354,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 353,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("p", { className: "text-slate-400 text-lg", children: "No audio file loaded" }, void 0, false, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 356,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 352,
            columnNumber: 26
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-clone.tsx",
          lineNumber: 338,
          columnNumber: 13
        }, this),
        processingStatus && /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("h2", { className: "text-xl font-semibold text-white mb-6", children: "Processing Status" }, void 0, false, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 362,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("span", { className: "text-white font-medium", children: "Status:" }, void 0, false, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 365,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("span", { className: `font-semibold ${processingStatus.status === "completed" ? "text-green-400" : processingStatus.status === "failed" ? "text-red-400" : "text-yellow-400"}`, children: processingStatus.status }, void 0, false, {
                fileName: "app/routes/voice-clone.tsx",
                lineNumber: 366,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 364,
              columnNumber: 19
            }, this),
            processingStatus.progress && /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "w-full bg-white/10 rounded-full h-3", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-300", style: {
              width: `${processingStatus.progress}%`
            } }, void 0, false, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 371,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 370,
              columnNumber: 49
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 363,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-clone.tsx",
          lineNumber: 361,
          columnNumber: 34
        }, this),
        error && /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "bg-red-500/10 border border-red-400/30 rounded-2xl p-8 backdrop-blur-xl", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "flex items-center space-x-3 text-red-400 mb-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(AlertCircle, { className: "w-6 h-6" }, void 0, false, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 381,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("span", { className: "font-semibold", children: "Error" }, void 0, false, {
              fileName: "app/routes/voice-clone.tsx",
              lineNumber: 382,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 380,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("p", { className: "text-red-300", children: error }, void 0, false, {
            fileName: "app/routes/voice-clone.tsx",
            lineNumber: 384,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-clone.tsx",
          lineNumber: 379,
          columnNumber: 23
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/voice-clone.tsx",
        lineNumber: 291,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/voice-clone.tsx",
      lineNumber: 156,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/voice-clone.tsx",
      lineNumber: 155,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/voice-clone.tsx",
    lineNumber: 120,
    columnNumber: 10
  }, this);
}
_s3(VoiceClone, "rZvYC3aVvN6qL1XN+3xZGyuQ1uA=");
_c4 = VoiceClone;
var _c4;
$RefreshReg$(_c4, "VoiceClone");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  VoiceClone as default
};
//# sourceMappingURL=/build/routes/voice-clone-TZANGLF4.js.map
