import {
  apiClient
} from "/build/_shared/chunk-IXVPANFZ.js";
import {
  GlassCard
} from "/build/_shared/chunk-2AAWFJGS.js";
import {
  Link
} from "/build/_shared/chunk-DEIPTZOR.js";
import "/build/_shared/chunk-CWUZT7IQ.js";
import {
  ArrowRight,
  Clock,
  FileAudio,
  Mic,
  MoreVertical,
  Play,
  Plus,
  Settings,
  Sparkles,
  User,
  Volume2,
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

// app/routes/dashboard.tsx
var import_react = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\dashboard.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\dashboard.tsx"
  );
  import.meta.hot.lastModified = "1758248091139.7534";
}
function Dashboard() {
  _s();
  const [isRecording, setIsRecording] = (0, import_react.useState)(false);
  const [isProcessing, setIsProcessing] = (0, import_react.useState)(false);
  const [audioFile, setAudioFile] = (0, import_react.useState)(null);
  const [uploadedFile, setUploadedFile] = (0, import_react.useState)(null);
  const [models, setModels] = (0, import_react.useState)([]);
  const [selectedModel, setSelectedModel] = (0, import_react.useState)("");
  const [processingStatus, setProcessingStatus] = (0, import_react.useState)(null);
  const [originalAudioUrl, setOriginalAudioUrl] = (0, import_react.useState)(null);
  const [generatedAudioUrl, setGeneratedAudioUrl] = (0, import_react.useState)(null);
  const [error, setError] = (0, import_react.useState)(null);
  const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
  const [activeTab, setActiveTab] = (0, import_react.useState)("text-to-speech");
  import_react.default.useEffect(() => {
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
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 relative overflow-hidden", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-0 overflow-hidden", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute top-20 left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl floating" }, void 0, false, {
        fileName: "app/routes/dashboard.tsx",
        lineNumber: 124,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute bottom-20 right-20 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl floating", style: {
        animationDelay: "2s"
      } }, void 0, false, {
        fileName: "app/routes/dashboard.tsx",
        lineNumber: 125,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/dashboard.tsx",
      lineNumber: 123,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.aside, { initial: {
      opacity: 0,
      x: -20
    }, animate: {
      opacity: 1,
      x: 0
    }, className: "fixed left-0 top-0 h-full w-80 glass-sidebar z-20", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-6 h-full flex flex-col", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-3 mb-8", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-2 bg-primary-500/20 rounded-xl neon-glow", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "w-6 h-6 text-primary-400" }, void 0, false, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 142,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 141,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-xl font-bold gradient-text", children: "RVC-Wiz" }, void 0, false, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 144,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/dashboard.tsx",
        lineNumber: 140,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, { whileHover: {
        scale: 1.02
      }, whileTap: {
        scale: 0.98
      }, className: "glass-button bg-primary-500/20 border-primary-400/50 neon-glow-hover mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "w-4 h-4 mr-2" }, void 0, false, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 153,
          columnNumber: 13
        }, this),
        "Clone Voice"
      ] }, void 0, true, {
        fileName: "app/routes/dashboard.tsx",
        lineNumber: 148,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/dashboard", className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Mic, { className: "w-5 h-5 text-white/70" }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 160,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Clone Voice" }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 161,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 159,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/voice-library", className: "flex items-center space-x-3 p-3 rounded-xl bg-primary-500/20 text-primary-400", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Volume2, { className: "w-5 h-5" }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 164,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Voice Library" }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 165,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 163,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/history", className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Clock, { className: "w-5 h-5 text-white/70" }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 168,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "History" }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 169,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 167,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/dashboard.tsx",
        lineNumber: 158,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-xs font-semibold text-white/50 uppercase tracking-wider mb-3", children: "PRODUCT" }, void 0, false, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 175,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setActiveTab("text-to-speech"), className: `w-full flex items-center justify-between p-3 rounded-xl transition-colors ${activeTab === "text-to-speech" ? "bg-primary-500/20 text-primary-400" : "hover:bg-white/10 text-white/70"}`, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FileAudio, { className: "w-5 h-5" }, void 0, false, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 179,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Text To Speech" }, void 0, false, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 180,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 178,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "w-4 h-4" }, void 0, false, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 182,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 177,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/voice-agent", className: "flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-colors text-white/70", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(User, { className: "w-5 h-5" }, void 0, false, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 186,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Voice Agent" }, void 0, false, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 187,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 185,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "w-4 h-4" }, void 0, false, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 189,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 184,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/voice-changer", className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors text-white/70", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Mic, { className: "w-5 h-5" }, void 0, false, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 192,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Voice Changer App" }, void 0, false, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 193,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 191,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 176,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/dashboard.tsx",
        lineNumber: 174,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "glass-card p-4 mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-2 mb-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Zap, { className: "w-4 h-4 text-primary-400" }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 201,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm font-medium", children: "Usage" }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 202,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 200,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-2xl font-bold", children: "114" }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 205,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm text-white/60", children: "/ 1,000" }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 206,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 204,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-full bg-white/10 rounded-full h-2 mb-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-primary-400 h-2 rounded-full", style: {
          width: "11%"
        } }, void 0, false, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 209,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 208,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between text-xs text-white/60", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Characters used" }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 214,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/reset", className: "hover:text-white transition-colors", children: "Resets" }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 215,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 213,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/dashboard.tsx",
        lineNumber: 199,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "glass-card p-4 mb-6 bg-orange-500/10 border-orange-400/20", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", { className: "font-semibold mb-2", children: "Upgrade to PRO" }, void 0, false, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 222,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-white/70 mb-3", children: "50% OFF" }, void 0, false, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 223,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, { whileHover: {
          scale: 1.02
        }, whileTap: {
          scale: 0.98
        }, className: "w-full glass-button bg-primary-500/20 border-primary-400/50 neon-glow-hover", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Zap, { className: "w-4 h-4 mr-2" }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 229,
            columnNumber: 17
          }, this),
          "Upgrade now"
        ] }, void 0, true, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 224,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/dashboard.tsx",
        lineNumber: 221,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/dashboard.tsx",
        lineNumber: 220,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm font-semibold text-primary-400", children: "BI" }, void 0, false, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 238,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 237,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm font-medium", children: "Free Plan" }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 241,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-xs text-white/60", children: "Bilaaln101@gmail..." }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 242,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 240,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MoreVertical, { className: "w-4 h-4 text-white/60" }, void 0, false, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 244,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/dashboard.tsx",
        lineNumber: 236,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/dashboard.tsx",
      lineNumber: 138,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/dashboard.tsx",
      lineNumber: 131,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "ml-80 p-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.header, { initial: {
        opacity: 0,
        y: -20
      }, animate: {
        opacity: 1,
        y: 0
      }, className: "flex items-center justify-between mb-8", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-2 text-white/70 mb-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "All Projects" }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 261,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ">" }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 262,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Project with Rick Sanchez" }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 263,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "p-1 hover:bg-white/10 rounded", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Settings, { className: "w-4 h-4" }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 265,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 264,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 260,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 259,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "glass-button", children: "Generate All" }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 270,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "glass-button", children: "Export All" }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 271,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 269,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/dashboard.tsx",
        lineNumber: 252,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "xl:col-span-2 space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "glass p-4 rounded-xl flex items-center space-x-3", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(User, { className: "w-6 h-6 text-primary-400" }, void 0, false, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 282,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 281,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-semibold", children: "Rick Sanchez" }, void 0, false, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 285,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-white/60", children: "Male, Adult, English" }, void 0, false, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 286,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 284,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 280,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "glass-input min-h-[200px] text-left", children: "Start typing here or paste any text you want to turn into lifelike speech." }, void 0, false, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 292,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm text-white/60", children: "Press enter or click here to create a new paragraph" }, void 0, false, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 296,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm text-white/60", children: "0/500" }, void 0, false, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 297,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 295,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 291,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-start space-x-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, { whileHover: {
              scale: 1.02
            }, whileTap: {
              scale: 0.98
            }, className: "glass-button bg-primary-500/20 border-primary-400/50 neon-glow-hover px-6 py-3 text-lg font-semibold mb-4", children: "Generate Speech" }, void 0, false, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 304,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "glass p-4 rounded-xl", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-white/70", children: "This paragraph does not have any audio samples yet. Click on the button above to generate the first sample." }, void 0, false, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 312,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 311,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "glass-button text-sm mt-4", children: "Get Faster Generations" }, void 0, false, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 316,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 303,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 302,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold mb-4", children: "Try an example to get started" }, void 0, false, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 324,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: [{
              icon: FileAudio,
              label: "Tell a story"
            }, {
              icon: Sparkles,
              label: "Listen to a joke"
            }, {
              icon: Mic,
              label: "Narrate an ad"
            }, {
              icon: Play,
              label: "Play dramatic movie dialog"
            }, {
              icon: Volume2,
              label: "Hear from a video game character"
            }].map((prompt, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, { whileHover: {
              scale: 1.02
            }, whileTap: {
              scale: 0.98
            }, className: "glass-button flex items-center space-x-2 p-3", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(prompt.icon, { className: "w-4 h-4" }, void 0, false, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 346,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm", children: prompt.label }, void 0, false, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 347,
                columnNumber: 21
              }, this)
            ] }, prompt.label, true, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 341,
              columnNumber: 41
            }, this)) }, void 0, false, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 325,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 323,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 278,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex space-x-1 glass p-1 rounded-xl", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setActiveTab("settings"), className: `flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === "settings" ? "bg-primary-500/20 text-primary-400" : "text-white/70 hover:text-white"}`, children: "Settings" }, void 0, false, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 357,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setActiveTab("history"), className: `flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === "history" ? "bg-primary-500/20 text-primary-400" : "text-white/70 hover:text-white"}`, children: "History" }, void 0, false, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 360,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 356,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GlassCard, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-semibold mb-2", children: "Clone a voice in seconds!" }, void 0, false, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 368,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-white/70 mb-4", children: "Create a digital replica of any voice!" }, void 0, false, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 369,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "glass-button w-full", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "w-4 h-4 mr-2" }, void 0, false, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 371,
                columnNumber: 19
              }, this),
              "Clone Voice"
            ] }, void 0, true, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 370,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 367,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 366,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GlassCard, { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-semibold mb-4", children: "Selected Voice" }, void 0, false, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 379,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "glass p-4 rounded-xl flex items-center space-x-3", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(User, { className: "w-5 h-5 text-primary-400" }, void 0, false, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 382,
                columnNumber: 19
              }, this) }, void 0, false, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 381,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", { className: "font-medium", children: "Rick Sanchez" }, void 0, false, {
                  fileName: "app/routes/dashboard.tsx",
                  lineNumber: 385,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-white/60", children: "Male, Adult, English" }, void 0, false, {
                  fileName: "app/routes/dashboard.tsx",
                  lineNumber: 386,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 384,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "w-4 h-4 text-white/60" }, void 0, false, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 388,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 380,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 378,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GlassCard, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-semibold", children: "Enhanced Mode" }, void 0, false, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 395,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "relative inline-flex items-center cursor-pointer", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "checkbox", className: "sr-only peer" }, void 0, false, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 397,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500" }, void 0, false, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 398,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 396,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 394,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 393,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GlassCard, { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-6", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm font-medium", children: "Creativity" }, void 0, false, {
                    fileName: "app/routes/dashboard.tsx",
                    lineNumber: 408,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm text-white/60", children: "Low" }, void 0, false, {
                    fileName: "app/routes/dashboard.tsx",
                    lineNumber: 409,
                    columnNumber: 21
                  }, this)
                ] }, void 0, true, {
                  fileName: "app/routes/dashboard.tsx",
                  lineNumber: 407,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "range", className: "glass-slider w-full" }, void 0, false, {
                  fileName: "app/routes/dashboard.tsx",
                  lineNumber: 411,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 406,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm font-medium", children: "Guidance" }, void 0, false, {
                    fileName: "app/routes/dashboard.tsx",
                    lineNumber: 415,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm text-white/60", children: "Low" }, void 0, false, {
                    fileName: "app/routes/dashboard.tsx",
                    lineNumber: 416,
                    columnNumber: 21
                  }, this)
                ] }, void 0, true, {
                  fileName: "app/routes/dashboard.tsx",
                  lineNumber: 414,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "range", className: "glass-slider w-full" }, void 0, false, {
                  fileName: "app/routes/dashboard.tsx",
                  lineNumber: 418,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 413,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 405,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4 space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/more-settings", className: "text-sm text-primary-400 hover:text-primary-300 transition-colors", children: "More settings v" }, void 0, false, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 422,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/reset", className: "text-sm text-white/60 hover:text-white transition-colors", children: "Reset Values" }, void 0, false, {
                fileName: "app/routes/dashboard.tsx",
                lineNumber: 425,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/dashboard.tsx",
              lineNumber: 421,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/dashboard.tsx",
            lineNumber: 404,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard.tsx",
          lineNumber: 354,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/dashboard.tsx",
        lineNumber: 276,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/dashboard.tsx",
      lineNumber: 250,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/dashboard.tsx",
    lineNumber: 121,
    columnNumber: 10
  }, this);
}
_s(Dashboard, "XLH8OQowNtxoKnwfhCeGXetEtHY=");
_c = Dashboard;
var _c;
$RefreshReg$(_c, "Dashboard");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Dashboard as default
};
//# sourceMappingURL=/build/routes/dashboard-4RB4XT7B.js.map
