import {
  GlassCard
} from "/build/_shared/chunk-2AAWFJGS.js";
import {
  Cpu,
  Globe,
  Monitor,
  RotateCcw,
  Save,
  Settings,
  Volume2,
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

// app/routes/settings.tsx
var import_react = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\settings.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\settings.tsx"
  );
  import.meta.hot.lastModified = "1758243793651.973";
}
function Settings2() {
  _s();
  const [settings, setSettings] = (0, import_react.useState)({
    audioQuality: "high",
    sampleRate: 44100,
    bitDepth: 16,
    autoCleanup: true,
    cleanupInterval: 60,
    maxFileSize: 100,
    theme: "dark",
    language: "en",
    notifications: true,
    gpuAcceleration: true,
    modelCache: true,
    apiEndpoint: "http://localhost:8000"
  });
  const [isSaving, setIsSaving] = (0, import_react.useState)(false);
  const [isResetting, setIsResetting] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    const savedSettings = localStorage.getItem("rvc-wiz-settings");
    if (savedSettings) {
      setSettings({
        ...settings,
        ...JSON.parse(savedSettings)
      });
    }
  }, []);
  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem("rvc-wiz-settings", JSON.stringify(settings));
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      alert("Settings saved successfully!");
    } catch (error) {
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };
  const handleReset = async () => {
    setIsResetting(true);
    try {
      const defaultSettings = {
        audioQuality: "high",
        sampleRate: 44100,
        bitDepth: 16,
        autoCleanup: true,
        cleanupInterval: 60,
        maxFileSize: 100,
        theme: "dark",
        language: "en",
        notifications: true,
        gpuAcceleration: true,
        modelCache: true,
        apiEndpoint: "http://localhost:8000"
      };
      setSettings(defaultSettings);
      localStorage.setItem("rvc-wiz-settings", JSON.stringify(defaultSettings));
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      alert("Settings reset to defaults!");
    } catch (error) {
      alert("Failed to reset settings");
    } finally {
      setIsResetting(false);
    }
  };
  const handleInputChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen p-4", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.header, { initial: {
      opacity: 0,
      y: -20
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "glass-card p-6 mb-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-2 bg-primary-500/20 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Settings, { className: "w-6 h-6 text-primary-400" }, void 0, false, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 112,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 111,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl font-bold gradient-text", children: "Settings" }, void 0, false, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 115,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-white/70", children: "Configure RVC-Wiz preferences" }, void 0, false, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 116,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 114,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 110,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex space-x-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, { whileHover: {
          scale: 1.05
        }, whileTap: {
          scale: 0.95
        }, onClick: handleReset, disabled: isResetting, className: "glass-button flex items-center space-x-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RotateCcw, { className: "w-4 h-4" }, void 0, false, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 125,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Reset" }, void 0, false, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 126,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 120,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, { whileHover: {
          scale: 1.05
        }, whileTap: {
          scale: 0.95
        }, onClick: handleSave, disabled: isSaving, className: "glass-button bg-primary-500/20 border-primary-400/50 flex items-center space-x-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Save, { className: "w-4 h-4" }, void 0, false, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 133,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: isSaving ? "Saving..." : "Save" }, void 0, false, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 134,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 128,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 119,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 109,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 102,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GlassCard, { delay: 0.1, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-2 mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Volume2, { className: "w-5 h-5 text-primary-400" }, void 0, false, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 144,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-semibold", children: "Audio Settings" }, void 0, false, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 145,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 143,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium mb-2", children: "Audio Quality" }, void 0, false, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 150,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { value: settings.audioQuality, onChange: (e) => handleInputChange("audioQuality", e.target.value), className: "glass-input w-full", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "low", children: "Low (16kHz)" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 152,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "medium", children: "Medium (22kHz)" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 153,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "high", children: "High (44.1kHz)" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 154,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "ultra", children: "Ultra (48kHz)" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 155,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 151,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 149,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium mb-2", children: "Sample Rate" }, void 0, false, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 160,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { value: settings.sampleRate, onChange: (e) => handleInputChange("sampleRate", parseInt(e.target.value)), className: "glass-input w-full", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: 16e3, children: "16,000 Hz" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 162,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: 22050, children: "22,050 Hz" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 163,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: 44100, children: "44,100 Hz" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 164,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: 48e3, children: "48,000 Hz" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 165,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 161,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 159,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium mb-2", children: "Bit Depth" }, void 0, false, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 170,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { value: settings.bitDepth, onChange: (e) => handleInputChange("bitDepth", parseInt(e.target.value)), className: "glass-input w-full", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: 16, children: "16-bit" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 172,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: 24, children: "24-bit" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 173,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: 32, children: "32-bit" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 174,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 171,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 169,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium mb-2", children: [
              "Max File Size: ",
              settings.maxFileSize,
              " MB"
            ] }, void 0, true, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 179,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "range", min: "10", max: "500", value: settings.maxFileSize, onChange: (e) => handleInputChange("maxFileSize", parseInt(e.target.value)), className: "w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider" }, void 0, false, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 182,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 178,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 148,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 142,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GlassCard, { delay: 0.2, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-2 mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Cpu, { className: "w-5 h-5 text-primary-400" }, void 0, false, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 190,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-semibold", children: "Performance" }, void 0, false, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 191,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 189,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "text-sm font-medium", children: "GPU Acceleration" }, void 0, false, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 196,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "checkbox", checked: settings.gpuAcceleration, onChange: (e) => handleInputChange("gpuAcceleration", e.target.checked), className: "rounded" }, void 0, false, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 197,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 195,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "text-sm font-medium", children: "Model Caching" }, void 0, false, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 201,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "checkbox", checked: settings.modelCache, onChange: (e) => handleInputChange("modelCache", e.target.checked), className: "rounded" }, void 0, false, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 202,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 200,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium mb-2", children: [
              "Cleanup Interval: ",
              settings.cleanupInterval,
              " minutes"
            ] }, void 0, true, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 206,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "range", min: "10", max: "240", value: settings.cleanupInterval, onChange: (e) => handleInputChange("cleanupInterval", parseInt(e.target.value)), className: "w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider" }, void 0, false, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 209,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 205,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "text-sm font-medium", children: "Auto Cleanup" }, void 0, false, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 213,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "checkbox", checked: settings.autoCleanup, onChange: (e) => handleInputChange("autoCleanup", e.target.checked), className: "rounded" }, void 0, false, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 214,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 212,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 194,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 188,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GlassCard, { delay: 0.3, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-2 mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Monitor, { className: "w-5 h-5 text-primary-400" }, void 0, false, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 222,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-semibold", children: "Interface" }, void 0, false, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 223,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 221,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium mb-2", children: "Theme" }, void 0, false, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 228,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { value: settings.theme, onChange: (e) => handleInputChange("theme", e.target.value), className: "glass-input w-full", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "dark", children: "Dark Mode" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 230,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "light", children: "Light Mode" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 231,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "auto", children: "Auto" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 232,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 229,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 227,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium mb-2", children: "Language" }, void 0, false, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 237,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { value: settings.language, onChange: (e) => handleInputChange("language", e.target.value), className: "glass-input w-full", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "en", children: "English" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 239,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "es", children: "Espa\xF1ol" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 240,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "fr", children: "Fran\xE7ais" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 241,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "de", children: "Deutsch" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 242,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "ja", children: "\u65E5\u672C\u8A9E" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 243,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "zh", children: "\u4E2D\u6587" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 244,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 238,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 236,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "text-sm font-medium", children: "Notifications" }, void 0, false, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 249,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "checkbox", checked: settings.notifications, onChange: (e) => handleInputChange("notifications", e.target.checked), className: "rounded" }, void 0, false, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 250,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 248,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 226,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 220,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(GlassCard, { delay: 0.4, children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-2 mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Globe, { className: "w-5 h-5 text-primary-400" }, void 0, false, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 258,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-semibold", children: "API Configuration" }, void 0, false, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 259,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 257,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium mb-2", children: "API Endpoint" }, void 0, false, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 264,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "url", value: settings.apiEndpoint, onChange: (e) => handleInputChange("apiEndpoint", e.target.value), className: "glass-input w-full", placeholder: "http://localhost:8000" }, void 0, false, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 265,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 263,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "glass p-3 rounded-lg", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-medium mb-2", children: "Connection Status" }, void 0, false, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 269,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-2 h-2 bg-green-400 rounded-full animate-pulse" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 271,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm text-white/70", children: "Connected" }, void 0, false, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 272,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 270,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 268,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "glass p-3 rounded-lg", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-medium mb-2", children: "System Info" }, void 0, false, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 277,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-sm text-white/70 space-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
                "Platform: ",
                navigator.platform
              ] }, void 0, true, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 279,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
                "User Agent: ",
                navigator.userAgent.split(" ")[0]
              ] }, void 0, true, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 280,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [
                "Memory: ",
                navigator.deviceMemory ? `${navigator.deviceMemory}GB` : "Unknown"
              ] }, void 0, true, {
                fileName: "app/routes/settings.tsx",
                lineNumber: 281,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/settings.tsx",
              lineNumber: 278,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/settings.tsx",
            lineNumber: 276,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/settings.tsx",
          lineNumber: 262,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/settings.tsx",
        lineNumber: 256,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/settings.tsx",
      lineNumber: 140,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/settings.tsx",
    lineNumber: 100,
    columnNumber: 10
  }, this);
}
_s(Settings2, "pYy5ySkkKV4bkKvMGiVbkORAnbY=");
_c = Settings2;
var _c;
$RefreshReg$(_c, "Settings");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Settings2 as default
};
//# sourceMappingURL=/build/routes/settings-XNDQKT42.js.map
