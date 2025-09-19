import {
  Link
} from "/build/_shared/chunk-DEIPTZOR.js";
import "/build/_shared/chunk-CWUZT7IQ.js";
import {
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  User,
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

// app/routes/signup.tsx
var import_react = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\signup.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\signup.tsx"
  );
  import.meta.hot.lastModified = "1758247528997.4038";
}
function Signup() {
  _s();
  const [showPassword, setShowPassword] = (0, import_react.useState)(false);
  const [showConfirmPassword, setShowConfirmPassword] = (0, import_react.useState)(false);
  const [formData, setFormData] = (0, import_react.useState)({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup attempt:", formData);
  };
  const handleInputChange = (e) => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 relative overflow-hidden", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-0 overflow-hidden", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute top-20 left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl floating" }, void 0, false, {
        fileName: "app/routes/signup.tsx",
        lineNumber: 57,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute bottom-20 right-20 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl floating", style: {
        animationDelay: "2s"
      } }, void 0, false, {
        fileName: "app/routes/signup.tsx",
        lineNumber: 58,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/signup.tsx",
      lineNumber: 56,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative z-10 min-h-screen flex", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1 flex items-center justify-center p-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, { initial: {
        opacity: 0,
        x: -20
      }, animate: {
        opacity: 1,
        x: 0
      }, className: "w-full max-w-md", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center mb-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "inline-flex items-center space-x-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-2 bg-primary-500/20 rounded-xl neon-glow", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "w-8 h-8 text-primary-400" }, void 0, false, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 77,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 76,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-2xl font-bold gradient-text", children: "RVC-Wiz" }, void 0, false, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 79,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/signup.tsx",
          lineNumber: 75,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/signup.tsx",
          lineNumber: 74,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "glass-card p-8", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center mb-8", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-3xl font-bold mb-2", children: "Create your account" }, void 0, false, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 86,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-white/70", children: "Start your journey with RVC-Wiz today" }, void 0, false, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 87,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 85,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium mb-2", children: "Full Name" }, void 0, false, {
                fileName: "app/routes/signup.tsx",
                lineNumber: 93,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(User, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" }, void 0, false, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 95,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", name: "name", value: formData.name, onChange: handleInputChange, className: "glass-input pl-12 w-full", placeholder: "Enter your full name", required: true }, void 0, false, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 96,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/signup.tsx",
                lineNumber: 94,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 92,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium mb-2", children: "Email" }, void 0, false, {
                fileName: "app/routes/signup.tsx",
                lineNumber: 102,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Mail, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" }, void 0, false, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 104,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "email", name: "email", value: formData.email, onChange: handleInputChange, className: "glass-input pl-12 w-full", placeholder: "Enter your email", required: true }, void 0, false, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 105,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/signup.tsx",
                lineNumber: 103,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 101,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium mb-2", children: "Password" }, void 0, false, {
                fileName: "app/routes/signup.tsx",
                lineNumber: 111,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Lock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" }, void 0, false, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 113,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: showPassword ? "text" : "password", name: "password", value: formData.password, onChange: handleInputChange, className: "glass-input pl-12 pr-12 w-full", placeholder: "Create a password", required: true }, void 0, false, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 114,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors", children: showPassword ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EyeOff, { className: "w-5 h-5" }, void 0, false, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 116,
                  columnNumber: 39
                }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "w-5 h-5" }, void 0, false, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 116,
                  columnNumber: 72
                }, this) }, void 0, false, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 115,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/signup.tsx",
                lineNumber: 112,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 110,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium mb-2", children: "Confirm Password" }, void 0, false, {
                fileName: "app/routes/signup.tsx",
                lineNumber: 123,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Lock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" }, void 0, false, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 125,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: showConfirmPassword ? "text" : "password", name: "confirmPassword", value: formData.confirmPassword, onChange: handleInputChange, className: "glass-input pl-12 pr-12 w-full", placeholder: "Confirm your password", required: true }, void 0, false, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 126,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setShowConfirmPassword(!showConfirmPassword), className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors", children: showConfirmPassword ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(EyeOff, { className: "w-5 h-5" }, void 0, false, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 128,
                  columnNumber: 46
                }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Eye, { className: "w-5 h-5" }, void 0, false, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 128,
                  columnNumber: 79
                }, this) }, void 0, false, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 127,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/signup.tsx",
                lineNumber: 124,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 122,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-start space-x-3", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "checkbox", name: "agreeToTerms", checked: formData.agreeToTerms, onChange: handleInputChange, className: "mt-1 rounded", required: true }, void 0, false, {
                fileName: "app/routes/signup.tsx",
                lineNumber: 135,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "text-sm text-white/70", children: [
                "I agree to the",
                " ",
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/terms", className: "text-primary-400 hover:text-primary-300 transition-colors", children: "Terms of Service" }, void 0, false, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 138,
                  columnNumber: 21
                }, this),
                " ",
                "and",
                " ",
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/privacy", className: "text-primary-400 hover:text-primary-300 transition-colors", children: "Privacy Policy" }, void 0, false, {
                  fileName: "app/routes/signup.tsx",
                  lineNumber: 142,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/signup.tsx",
                lineNumber: 136,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 134,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, { whileHover: {
              scale: 1.02
            }, whileTap: {
              scale: 0.98
            }, type: "submit", className: "w-full glass-button bg-primary-500/20 border-primary-400/50 neon-glow-hover py-3 text-lg font-semibold", children: "Create Account" }, void 0, false, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 149,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 90,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative my-6", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-full border-t border-white/20" }, void 0, false, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 161,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 160,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative flex justify-center text-sm", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "px-2 bg-dark-800 text-white/70", children: "Or continue with" }, void 0, false, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 164,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 163,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 159,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.button, { whileHover: {
            scale: 1.02
          }, whileTap: {
            scale: 0.98
          }, className: "w-full glass-button flex items-center justify-center space-x-2 py-3", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { fill: "currentColor", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }, void 0, false, {
                fileName: "app/routes/signup.tsx",
                lineNumber: 175,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { fill: "currentColor", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }, void 0, false, {
                fileName: "app/routes/signup.tsx",
                lineNumber: 176,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { fill: "currentColor", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }, void 0, false, {
                fileName: "app/routes/signup.tsx",
                lineNumber: 177,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { fill: "currentColor", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" }, void 0, false, {
                fileName: "app/routes/signup.tsx",
                lineNumber: 178,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 174,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Continue with Google" }, void 0, false, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 180,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 169,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center mt-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-white/70", children: [
            "Already have an account?",
            " ",
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/login", className: "text-primary-400 hover:text-primary-300 transition-colors font-medium", children: "Sign in" }, void 0, false, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 187,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 185,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 184,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/signup.tsx",
          lineNumber: 84,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/signup.tsx",
        lineNumber: 66,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/signup.tsx",
        lineNumber: 65,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "hidden lg:flex flex-1 items-center justify-center p-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, { initial: {
        opacity: 0,
        x: 20
      }, animate: {
        opacity: 1,
        x: 0
      }, transition: {
        delay: 0.2
      }, className: "glass-modal p-8 max-w-lg w-full", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center mb-8", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-2xl font-bold mb-4", children: "Why Join RVC-Wiz?" }, void 0, false, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 208,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-white/70", children: "Unlock the power of AI voice technology" }, void 0, false, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 209,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/signup.tsx",
          lineNumber: 207,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-6", children: [{
          icon: CheckCircle,
          title: "Free Trial",
          description: "Start with 1,000 free characters to test our platform"
        }, {
          icon: CheckCircle,
          title: "High-Quality Voices",
          description: "Access premium AI voices with natural-sounding speech"
        }, {
          icon: CheckCircle,
          title: "Real-Time Processing",
          description: "Generate voice content in seconds, not minutes"
        }, {
          icon: CheckCircle,
          title: "Secure & Private",
          description: "Your data is encrypted and never shared with third parties"
        }, {
          icon: CheckCircle,
          title: "Easy Integration",
          description: "Simple API and SDK for developers"
        }].map((benefit, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, { initial: {
          opacity: 0,
          x: 20
        }, animate: {
          opacity: 1,
          x: 0
        }, transition: {
          delay: 0.4 + index * 0.1
        }, className: "flex items-start space-x-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-1 bg-primary-500/20 rounded-full", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(benefit.icon, { className: "w-4 h-4 text-primary-400" }, void 0, false, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 244,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 243,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-semibold text-white", children: benefit.title }, void 0, false, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 247,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-white/60", children: benefit.description }, void 0, false, {
              fileName: "app/routes/signup.tsx",
              lineNumber: 248,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 246,
            columnNumber: 19
          }, this)
        ] }, benefit.title, true, {
          fileName: "app/routes/signup.tsx",
          lineNumber: 234,
          columnNumber: 40
        }, this)) }, void 0, false, {
          fileName: "app/routes/signup.tsx",
          lineNumber: 213,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center mt-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "glass p-4 rounded-xl", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-white/70 mb-2", children: "Join thousands of creators" }, void 0, false, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 255,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-center space-x-1", children: [...Array(5)].map((_, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Sparkles, { className: "w-4 h-4 text-primary-400" }, i, false, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 257,
            columnNumber: 48
          }, this)) }, void 0, false, {
            fileName: "app/routes/signup.tsx",
            lineNumber: 256,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/signup.tsx",
          lineNumber: 254,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/signup.tsx",
          lineNumber: 253,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/signup.tsx",
        lineNumber: 198,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/signup.tsx",
        lineNumber: 197,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/signup.tsx",
      lineNumber: 63,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/signup.tsx",
    lineNumber: 54,
    columnNumber: 10
  }, this);
}
_s(Signup, "VT6vSv4qlIRLhckh5heS36/p+5U=");
_c = Signup;
var _c;
$RefreshReg$(_c, "Signup");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Signup as default
};
//# sourceMappingURL=/build/routes/signup-FKKYYH4J.js.map
