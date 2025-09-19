import {
  motion
} from "/build/_shared/chunk-7NFSZCFO.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-CBDF6H27.js";
import {
  createHotContext
} from "/build/_shared/chunk-PAD7UL62.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/components/GlassCard.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\GlassCard.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\GlassCard.tsx"
  );
  import.meta.hot.lastModified = "1758243793651.973";
}
function GlassCard({
  children,
  className = "",
  hover = true,
  delay = 0
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(motion.div, { initial: {
    opacity: 0,
    y: 20
  }, animate: {
    opacity: 1,
    y: 0
  }, transition: {
    delay,
    duration: 0.5
  }, whileHover: hover ? {
    scale: 1.02,
    y: -5
  } : {}, className: `glass-card ${className}`, children }, void 0, false, {
    fileName: "app/components/GlassCard.tsx",
    lineNumber: 28,
    columnNumber: 10
  }, this);
}
_c = GlassCard;
var _c;
$RefreshReg$(_c, "GlassCard");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  GlassCard
};
//# sourceMappingURL=/build/_shared/chunk-2AAWFJGS.js.map
