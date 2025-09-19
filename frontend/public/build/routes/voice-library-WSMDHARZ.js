import {
  apiClient
} from "/build/_shared/chunk-IXVPANFZ.js";
import {
  Link
} from "/build/_shared/chunk-DEIPTZOR.js";
import "/build/_shared/chunk-CWUZT7IQ.js";
import {
  ArrowRight,
  Clock,
  Download,
  ExternalLink,
  Mic,
  MoreVertical,
  Play,
  Search,
  Sparkles,
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

// app/routes/voice-library.tsx
var import_react = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\voice-library.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\voice-library.tsx"
  );
  import.meta.hot.lastModified = "1758248457339.6526";
}
function VoiceLibrary() {
  _s();
  const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
  const [activeTab, setActiveTab] = (0, import_react.useState)("explore");
  const [selectedFilters, setSelectedFilters] = (0, import_react.useState)([]);
  const [voiceModels, setVoiceModels] = (0, import_react.useState)([]);
  const [featuredModels, setFeaturedModels] = (0, import_react.useState)([]);
  const [rickSanchezModels, setRickSanchezModels] = (0, import_react.useState)([]);
  const [loading, setLoading] = (0, import_react.useState)(true);
  const [error, setError] = (0, import_react.useState)(null);
  const filters = ["Adult", "Female", "Calm", "Male", "Narration", "Friendly", "Professional", "Young", "English", "Japanese"];
  (0, import_react.useEffect)(() => {
    loadVoiceModels();
  }, []);
  const loadVoiceModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const [topModelsResponse, featuredResponse, rickResponse] = await Promise.all([apiClient.getTopVoiceModels(20), apiClient.getFeaturedVoiceModels(), apiClient.getRickSanchezModels()]);
      setVoiceModels(topModelsResponse.models);
      setFeaturedModels(featuredResponse.models);
      setRickSanchezModels(rickResponse.models);
    } catch (error2) {
      console.error("Failed to load voice models:", error2);
      setError("Failed to load voice models. Please try again later.");
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
    } catch (error2) {
      console.error("Search failed:", error2);
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
  const getAvatar = (name) => {
    return name.charAt(0).toUpperCase();
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 relative overflow-hidden", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-0 overflow-hidden", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute top-20 left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl floating" }, void 0, false, {
        fileName: "app/routes/voice-library.tsx",
        lineNumber: 94,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute bottom-20 right-20 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl floating", style: {
        animationDelay: "2s"
      } }, void 0, false, {
        fileName: "app/routes/voice-library.tsx",
        lineNumber: 95,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/voice-library.tsx",
      lineNumber: 93,
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
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 112,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 111,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-xl font-bold gradient-text", children: "RVC-Wiz" }, void 0, false, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 114,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/voice-library.tsx",
        lineNumber: 110,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/dashboard", className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Mic, { className: "w-5 h-5 text-white/70" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 120,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Clone Voice" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 121,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 119,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/voice-library", className: "flex items-center space-x-3 p-3 rounded-xl bg-primary-500/20 text-primary-400", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Volume2, { className: "w-5 h-5" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 124,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Voice Library" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 125,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 123,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/history", className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Clock, { className: "w-5 h-5 text-white/70" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 128,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "History" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 129,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 127,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/voice-library.tsx",
        lineNumber: 118,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, { whileHover: {
        scale: 1.02
      }, whileTap: {
        scale: 0.98
      }, className: "glass-button bg-primary-500/20 border-primary-400/50 neon-glow-hover mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "w-4 h-4 mr-2" }, void 0, false, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 139,
          columnNumber: 13
        }, this),
        "Clone Voice"
      ] }, void 0, true, {
        fileName: "app/routes/voice-library.tsx",
        lineNumber: 134,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "glass-card p-4 mb-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-2 mb-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Zap, { className: "w-4 h-4 text-primary-400" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 146,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm font-medium", children: "Usage" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 147,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 145,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-2xl font-bold", children: "114" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 150,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm text-white/60", children: "/ 1,000" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 151,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 149,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-full bg-white/10 rounded-full h-2 mb-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-primary-400 h-2 rounded-full", style: {
          width: "11%"
        } }, void 0, false, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 154,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 153,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between text-xs text-white/60", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Characters used" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 159,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/reset", className: "hover:text-white transition-colors", children: "Resets" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 160,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 158,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/voice-library.tsx",
        lineNumber: 144,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "glass-card p-4 mb-6 bg-orange-500/10 border-orange-400/20", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", { className: "font-semibold mb-2", children: "Upgrade to PRO" }, void 0, false, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 167,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-white/70 mb-3", children: "50% OFF" }, void 0, false, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 168,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, { whileHover: {
          scale: 1.02
        }, whileTap: {
          scale: 0.98
        }, className: "w-full glass-button bg-primary-500/20 border-primary-400/50 neon-glow-hover", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Zap, { className: "w-4 h-4 mr-2" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 174,
            columnNumber: 17
          }, this),
          "Upgrade now"
        ] }, void 0, true, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 169,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/voice-library.tsx",
        lineNumber: 166,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/voice-library.tsx",
        lineNumber: 165,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm font-semibold text-primary-400", children: "BI" }, void 0, false, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 183,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 182,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm font-medium", children: "Free Plan" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 186,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-xs text-white/60", children: "Bilaaln101@gmail..." }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 187,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 185,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MoreVertical, { className: "w-4 h-4 text-white/60" }, void 0, false, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 189,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/voice-library.tsx",
        lineNumber: 181,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/voice-library.tsx",
      lineNumber: 108,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/voice-library.tsx",
      lineNumber: 101,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "ml-80 p-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.header, { initial: {
        opacity: 0,
        y: -20
      }, animate: {
        opacity: 1,
        y: 0
      }, className: "mb-8", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl font-bold mb-4", children: "Voice Library" }, void 0, false, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 204,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex space-x-1 glass p-1 rounded-xl w-fit", children: [{
          key: "explore",
          label: "Explore"
        }, {
          key: "featured",
          label: "Featured"
        }, {
          key: "rick-sanchez",
          label: "Rick Sanchez"
        }, {
          key: "favorites",
          label: "Favorites"
        }].map((tab) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setActiveTab(tab.key), className: `px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key ? "bg-primary-500/20 text-primary-400" : "text-white/70 hover:text-white"}`, children: tab.label }, tab.key, false, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 220,
          columnNumber: 25
        }, this)) }, void 0, false, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 207,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/voice-library.tsx",
        lineNumber: 197,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: 0.2
      }, className: "mb-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col lg:flex-row gap-4 items-center justify-between", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative flex-1 max-w-md", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 239,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), onKeyPress: (e) => e.key === "Enter" && handleSearch(), placeholder: "Search voices...", className: "glass-input pl-12 w-full" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 240,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 238,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-wrap gap-2", children: filters.map((filter) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => {
          setSelectedFilters((prev) => prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]);
        }, className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilters.includes(filter) ? "bg-primary-500/20 text-primary-400 border border-primary-400/50" : "glass-button"}`, children: filter }, filter, false, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 245,
          columnNumber: 38
        }, this)) }, void 0, false, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 244,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm text-white/70", children: "Popularity" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 254,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowRight, { className: "w-4 h-4 text-white/50" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 255,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 253,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, { whileHover: {
          scale: 1.02
        }, whileTap: {
          scale: 0.98
        }, className: "glass-button bg-primary-500/20 border-primary-400/50 neon-glow-hover", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "w-4 h-4 mr-2" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 264,
            columnNumber: 15
          }, this),
          "Clone Voice"
        ] }, void 0, true, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 259,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/voice-library.tsx",
        lineNumber: 236,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/voice-library.tsx",
        lineNumber: 227,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.section, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: 0.4
      }, className: "mb-12", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-2xl font-bold", children: [
            activeTab === "explore" && "Top Voice Models",
            activeTab === "featured" && "Featured Models",
            activeTab === "rick-sanchez" && "Rick Sanchez Models",
            activeTab === "favorites" && "Your Favorites"
          ] }, void 0, true, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 281,
            columnNumber: 13
          }, this),
          loading && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-2 text-white/60", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" }, void 0, false, {
              fileName: "app/routes/voice-library.tsx",
              lineNumber: 288,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm", children: "Loading..." }, void 0, false, {
              fileName: "app/routes/voice-library.tsx",
              lineNumber: 289,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 287,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 280,
          columnNumber: 11
        }, this),
        error && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "glass-card p-6 mb-6 border-red-400/20", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-2 text-red-400", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm font-medium", children: "Error" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 295,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 294,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-red-300 mt-2", children: error }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 297,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 293,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-4", children: getDisplayModels().map((model, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, { initial: {
          opacity: 0,
          x: -20
        }, animate: {
          opacity: 1,
          x: 0
        }, transition: {
          delay: 0.6 + index * 0.1
        }, className: "glass-card p-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-2xl font-bold text-primary-400", children: getAvatar(model.character) }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 312,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 311,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-2 mb-1", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-xl font-semibold", children: model.character }, void 0, false, {
                fileName: "app/routes/voice-library.tsx",
                lineNumber: 316,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full", children: [
                model.epochs,
                " Epochs"
              ] }, void 0, true, {
                fileName: "app/routes/voice-library.tsx",
                lineNumber: 317,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "px-2 py-1 bg-white/10 text-white/60 text-xs rounded-full", children: model.type }, void 0, false, {
                fileName: "app/routes/voice-library.tsx",
                lineNumber: 320,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/voice-library.tsx",
              lineNumber: 315,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-white/70 mb-2", children: model.description }, void 0, false, {
              fileName: "app/routes/voice-library.tsx",
              lineNumber: 324,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-wrap gap-2 mb-3", children: [
              model.tags.slice(0, 5).map((tag) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "px-2 py-1 bg-white/10 text-white/60 text-xs rounded-full", children: tag }, tag, false, {
                fileName: "app/routes/voice-library.tsx",
                lineNumber: 326,
                columnNumber: 58
              }, this)),
              model.tags.length > 5 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "px-2 py-1 bg-white/10 text-white/60 text-xs rounded-full", children: [
                "+",
                model.tags.length - 5
              ] }, void 0, true, {
                fileName: "app/routes/voice-library.tsx",
                lineNumber: 329,
                columnNumber: 49
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/voice-library.tsx",
              lineNumber: 325,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-4 text-xs text-white/50", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
                "Size: ",
                model.size
              ] }, void 0, true, {
                fileName: "app/routes/voice-library.tsx",
                lineNumber: 334,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "\u2022" }, void 0, false, {
                fileName: "app/routes/voice-library.tsx",
                lineNumber: 335,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
                model.epochs,
                " Epochs"
              ] }, void 0, true, {
                fileName: "app/routes/voice-library.tsx",
                lineNumber: 336,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/voice-library.tsx",
              lineNumber: 333,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 314,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "glass-button p-2", onClick: () => window.open(model.download_url, "_blank"), title: "Download Model", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "w-4 h-4" }, void 0, false, {
              fileName: "app/routes/voice-library.tsx",
              lineNumber: 341,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/routes/voice-library.tsx",
              lineNumber: 340,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "glass-button p-2", onClick: () => window.open(model.huggingface_url, "_blank"), title: "View on HuggingFace", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ExternalLink, { className: "w-4 h-4" }, void 0, false, {
              fileName: "app/routes/voice-library.tsx",
              lineNumber: 344,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/routes/voice-library.tsx",
              lineNumber: 343,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "glass-button p-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Play, { className: "w-4 h-4" }, void 0, false, {
              fileName: "app/routes/voice-library.tsx",
              lineNumber: 347,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/routes/voice-library.tsx",
              lineNumber: 346,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "glass-button p-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MoreVertical, { className: "w-4 h-4" }, void 0, false, {
              fileName: "app/routes/voice-library.tsx",
              lineNumber: 350,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/routes/voice-library.tsx",
              lineNumber: 349,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 339,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 310,
          columnNumber: 17
        }, this) }, model.id, false, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 301,
          columnNumber: 55
        }, this)) }, void 0, false, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 300,
          columnNumber: 11
        }, this),
        getDisplayModels().length === 0 && !loading && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "glass-card p-12 text-center", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Volume2, { className: "w-8 h-8 text-white/40" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 359,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 358,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-lg font-semibold mb-2", children: "No models found" }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 361,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-white/60", children: activeTab === "rick-sanchez" ? "No Rick Sanchez models found. Try searching for other characters." : "Try adjusting your search or filters to find more models." }, void 0, false, {
            fileName: "app/routes/voice-library.tsx",
            lineNumber: 362,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/voice-library.tsx",
          lineNumber: 357,
          columnNumber: 59
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/voice-library.tsx",
        lineNumber: 271,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/voice-library.tsx",
      lineNumber: 195,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/voice-library.tsx",
    lineNumber: 91,
    columnNumber: 10
  }, this);
}
_s(VoiceLibrary, "3peRmvdlMVFfezYN4xsgh9n2+Po=");
_c = VoiceLibrary;
var _c;
$RefreshReg$(_c, "VoiceLibrary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  VoiceLibrary as default
};
//# sourceMappingURL=/build/routes/voice-library-WSMDHARZ.js.map
