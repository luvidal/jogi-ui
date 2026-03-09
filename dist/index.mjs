import { createContext, useState, useEffect, useContext, useCallback, useMemo, useRef, useLayoutEffect, Fragment as Fragment$1, useId } from 'react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { icons, CircleHelp } from 'lucide-react';
import { createPortal } from 'react-dom';

// src/hooks.tsx
var useIsMobile = () => {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    setM(mql.matches);
    const h = (e) => setM(e.matches);
    mql.addEventListener("change", h);
    return () => mql.removeEventListener("change", h);
  }, []);
  return m;
};
var useIsDesktop = () => {
  const [d, setD] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    setD(mql.matches);
    const h = (e) => setD(e.matches);
    mql.addEventListener("change", h);
    return () => mql.removeEventListener("change", h);
  }, []);
  return d;
};
var ToastContext = createContext(void 0);
var useToast = () => {
  const context = useContext(ToastContext);
  if (context === void 0) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
var ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, duration: 5e3, ...toast }]);
    return id;
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const clearToasts = useCallback(() => setToasts([]), []);
  const showSuccess = useCallback((message, options) => addToast({ type: "success", message, ...options }), [addToast]);
  const showError = useCallback((message, options) => addToast({ type: "error", message, duration: 7e3, ...options }), [addToast]);
  const showWarning = useCallback((message, options) => addToast({ type: "warning", message, ...options }), [addToast]);
  const showInfo = useCallback((message, options) => addToast({ type: "info", message, ...options }), [addToast]);
  const value = useMemo(() => ({
    toasts,
    addToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }), [toasts, addToast, removeToast, clearToasts, showSuccess, showError, showWarning, showInfo]);
  return /* @__PURE__ */ jsx(ToastContext.Provider, { value, children });
};
var reported = /* @__PURE__ */ new Set();
var Icon = ({ name, ...props }) => {
  const LucideIcon = name ? icons[name] : void 0;
  if (name && !LucideIcon && !reported.has(name)) {
    reported.add(name);
    const err = new Error(`[Icon] "${name}" not found in lucide-react`);
    console.error(err.message);
    if (typeof reportError === "function") reportError(err);
  }
  const Component = LucideIcon || CircleHelp;
  return /* @__PURE__ */ jsx(Component, { ...props });
};
var icon_default = Icon;
var sizeConfig = {
  sm: { cls: "h-8 px-3 text-xs gap-1.5", icon: 14 },
  md: { cls: "h-10 px-5 text-sm gap-2", icon: 16 },
  lg: { cls: "h-12 px-6 text-base gap-2.5", icon: 18 }
};
var variantStyles = {
  primary: (_a, d) => `bg-theme-700 hover:bg-theme-600 text-white shadow-lg hover:shadow-xl ${d ? "cursor-not-allowed" : ""}`,
  glass: (a, d) => `${a ? "bg-white/20 text-white" : "bg-white/10 text-white/80 hover:bg-white/15 hover:text-white"} ${d ? "cursor-not-allowed" : ""}`,
  danger: (_a, d) => `bg-rose-600 hover:bg-rose-700 text-white shadow-lg hover:shadow-xl ${d ? "cursor-not-allowed" : ""}`,
  outline: (_a, d) => `border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white ${d ? "cursor-not-allowed" : ""}`,
  ghost: (_a, d) => `text-gray-600 hover:bg-gray-100 ${d ? "cursor-not-allowed" : ""}`
};
var Button = ({ icon, text, variant = "primary", size = "md", active = false, loading = false, className = "", ...props }) => {
  const isDisabled = props.disabled || loading;
  const sz = sizeConfig[size];
  const base = "flex items-center justify-center transition-all duration-200 backdrop-blur-sm rounded-btn active:scale-[0.98]";
  const disabledEffect = isDisabled ? "opacity-40 blur-[0.5px]" : "";
  return /* @__PURE__ */ jsxs("button", { className: `${base} ${sz.cls} ${variantStyles[variant](active, isDisabled)} ${className}`, ...props, disabled: isDisabled, children: [
    loading ? /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-4 w-4 text-current", viewBox: "0 0 24 24", fill: "none", children: [
      /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "3" }),
      /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
    ] }) : icon && /* @__PURE__ */ jsx(icon_default, { name: icon, size: sz.icon, className: `text-shadow-sm ${disabledEffect}` }),
    text && /* @__PURE__ */ jsx("span", { className: `text-shadow-sm truncate font-semibold uppercase tracking-wide ${disabledEffect}`, children: text })
  ] });
};
var button_default = Button;
var Checkbox = ({ label, checked, className = "", onChange }) => {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      role: "checkbox",
      "aria-checked": checked,
      onClick: () => onChange(!checked),
      className: `group flex items-center gap-3 cursor-pointer select-none ${className}`,
      children: [
        /* @__PURE__ */ jsx("span", { className: `flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all duration-200 ${checked ? "bg-theme-600 border-theme-600" : "bg-white border-gray-300 group-hover:border-theme-400"}`, children: checked && /* @__PURE__ */ jsx(icon_default, { name: "Check", size: 14, className: "text-white", strokeWidth: 3 }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700 group-hover:text-gray-900 transition-colors", children: label })
      ]
    }
  );
};
var checkbox_default = Checkbox;
var Tooltip = ({ text, icon = "CircleQuestionMark", iconColor = "text-gray-700", className = "", html = false }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const btnRef = useRef(null);
  const tooltipRef = useRef(null);
  const shouldHtml = html || /<[a-z][\s\S]*>/i.test(text);
  const patchedText = shouldHtml ? text.replace(
    /(<li[\s\S]*<\/li>)/gi,
    '<ul style="list-style:disc;padding-left:1.25rem;margin:0">$1</ul>'
  ) : text;
  const updatePosition = useCallback(() => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    let top = r.top;
    let left = r.right + 8;
    const tooltipWidth = 256;
    if (left + tooltipWidth > window.innerWidth - 16) {
      left = r.left - tooltipWidth - 8;
    }
    if (top + 100 > window.innerHeight - 16) {
      top = window.innerHeight - 116;
    }
    top = Math.max(8, top);
    left = Math.max(8, left);
    setPos({ top, left });
  }, []);
  useEffect(() => {
    if (open) {
      updatePosition();
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open, updatePosition]);
  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target) && tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);
  return /* @__PURE__ */ jsxs("span", { ref, className: `relative inline-block left-1 ${className}`, children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        ref: btnRef,
        onClick: (e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        },
        children: /* @__PURE__ */ jsx(
          icon_default,
          {
            name: icon,
            className: `size-4 opacity-60 hover:opacity-100 transition-opacity ${iconColor}`
          }
        )
      }
    ),
    open && typeof document !== "undefined" && createPortal(
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: tooltipRef,
          className: `
                        fixed z-[9999] p-3 rounded-xl shade-md text-sm max-w-xs break-words
                        bg-theme-800 text-white/90 border border-white/10 backdrop-blur-md
                        transition-all duration-200
                        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}
                    `,
          style: { top: pos.top, left: pos.left },
          children: shouldHtml ? /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: patchedText } }) : text
        }
      ),
      document.body
    )
  ] });
};
var tooltip_default = Tooltip;
function FieldWrapper({ label, tooltip, className = "", visible = true, children }) {
  if (!visible) return null;
  return /* @__PURE__ */ jsxs("div", { className: `mb-2 ${className}`, children: [
    (label || tooltip) && /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
      label && /* @__PURE__ */ jsx("span", { className: "text-gray-500 text-sm", children: label }),
      tooltip && /* @__PURE__ */ jsx(tooltip_default, { text: tooltip })
    ] }),
    children
  ] });
}
var ColorPicker = ({ label, value = "#000000", onChange, className = "", visible = true }) => {
  const [localValue, setLocalValue] = useState(value);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleChange = (newValue) => {
    setLocalValue(newValue);
    onChange?.(newValue);
  };
  const isValidHex = (hex) => /^#[0-9A-Fa-f]{6}$/.test(hex);
  const handleTextChange = (text) => {
    const formatted = text.startsWith("#") ? text : `#${text}`;
    setLocalValue(formatted);
    if (isValidHex(formatted)) {
      onChange?.(formatted);
    }
  };
  return /* @__PURE__ */ jsx(FieldWrapper, { label, className, visible, children: /* @__PURE__ */ jsxs("div", { className: "relative", ref: pickerRef, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setShowPicker(!showPicker),
          className: "w-12 h-12 rounded-xl border-2 border-gray-200 cursor-pointer transition-all hover:border-gray-300 shadow-sm",
          style: { backgroundColor: isValidHex(localValue) ? localValue : "#ffffff" },
          "aria-label": "Seleccionar color"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: localValue,
          onChange: (e) => handleTextChange(e.target.value),
          maxLength: 7,
          className: "border-1 rounded-xl w-28 text-gray-950 bg-white text-base px-4 py-3 font-mono uppercase",
          placeholder: "#000000"
        }
      )
    ] }),
    showPicker && /* @__PURE__ */ jsx("div", { className: "absolute top-full left-0 mt-2 p-3 bg-white rounded-xl shadow-lg border z-50", children: /* @__PURE__ */ jsx(
      "input",
      {
        type: "color",
        value: isValidHex(localValue) ? localValue : "#000000",
        onChange: (e) => handleChange(e.target.value),
        className: "w-48 h-32 cursor-pointer border-0"
      }
    ) })
  ] }) });
};
var colorpicker_default = ColorPicker;
var sanitizeValue = (s) => String(s || "").replace(/[\u0000-\u001F\u007F-\u009F]/g, "").replace(/[\u00A0\u1680\u180E\u2000-\u200D\u2028-\u202F\u205F\u2060\u3000\uFEFF]+/g, " ").replace(/\s+/g, " ").trim();
var Input = ({ label, className = "", readOnly, onChange, value = "", tooltip, visible = true, ...rest }) => {
  const [localValue, setLocalValue] = useState(value);
  const [cleanValue, setCleanValue] = useState(() => sanitizeValue(value));
  useEffect(() => {
    const cleaned = sanitizeValue(value);
    setLocalValue(value);
    setCleanValue(cleaned);
  }, [value]);
  const commit = () => {
    const sanitized = sanitizeValue(localValue);
    setLocalValue(sanitized);
    if (sanitized !== cleanValue) onChange?.(sanitized);
  };
  return /* @__PURE__ */ jsx(FieldWrapper, { label, tooltip, className, visible, children: /* @__PURE__ */ jsx(
    "input",
    {
      ...rest,
      readOnly,
      value: localValue,
      onChange: (e) => setLocalValue(e.target.value),
      onBlur: commit,
      onKeyDown: (e) => e.key === "Enter" && commit(),
      className: `border-1 rounded-xl w-full ${readOnly ? "text-gray-400 cursor-not-allowed bg-gray-50" : "text-gray-950 bg-white focus:ring-2 focus:ring-theme-200 focus:border-theme-400"} text-base px-4 py-3 transition-all duration-300`
    }
  ) });
};
var input_default = Input;
var Radio = ({ label, value, selected, onChange, className = "" }) => {
  return /* @__PURE__ */ jsxs("label", { className: `flex items-center cursor-pointer ${className}`, children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "radio",
        value,
        checked: selected === value,
        onChange: () => onChange?.(value),
        className: "mr-2 w-4 h-4 accent-theme-700"
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "text-gray-800", children: label })
  ] });
};
var radio_default = Radio;
var Select = ({ label, value, placeholder, options, className = "", onChange, tooltip = "" }) => {
  useEffect(() => {
    if (options.length === 1 && value !== options[0].value) {
      onChange(options[0].value);
    }
  }, [options, value, onChange]);
  return /* @__PURE__ */ jsx(FieldWrapper, { label, tooltip, className, children: /* @__PURE__ */ jsxs(
    "select",
    {
      value: value || "",
      onChange: (e) => onChange(e.target.value),
      className: `border rounded-xl w-full text-base px-4 py-3 appearance-none ${value ? "text-black" : "text-gray-400"} bg-white focus:ring-2 focus:ring-theme-200 focus:border-theme-400 transition-all duration-300 cursor-pointer`,
      style: {
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: "right 1rem center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "1.5em 1.5em"
      },
      children: [
        placeholder && /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: placeholder }),
        options?.map(({ label: label2, value: value2 }) => /* @__PURE__ */ jsx("option", { value: value2, children: label2 }, value2))
      ]
    }
  ) });
};
var select_default = Select;
var useIsMobile2 = () => {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    setM(mql.matches);
    const h = (e) => setM(e.matches);
    mql.addEventListener("change", h);
    return () => mql.removeEventListener("change", h);
  }, []);
  return m;
};
var SIZE_CONFIG = {
  xl: { w: 1200, h: 900, maxW: 95, maxH: 90 },
  lg: { w: 960, h: 800, maxW: 92, maxH: 88 },
  md: { w: 720, h: 720, maxW: 90, maxH: 85 },
  sm: { w: 560, h: 600, maxW: 88, maxH: 82 },
  xs: { w: 400, h: 500, maxW: 85, maxH: 80 }
};
var MIN_W = 320;
var MIN_H = 240;
var MAXIMIZE_MARGIN = 16;
var Modal = ({ title, icon, children, onClose, className = "", size: sizeProp = "md", headerActions, resizable = true }) => {
  const mobile = useIsMobile2();
  const sizeConfig4 = SIZE_CONFIG[sizeProp];
  const [dims, setDims] = useState(null);
  const [maximized, setMaximized] = useState(false);
  const [resizing, setResizing] = useState(false);
  const getResponsiveSize = useCallback(() => {
    if (typeof window === "undefined") return { w: sizeConfig4.w, h: sizeConfig4.h };
    const maxW = Math.floor(window.innerWidth * sizeConfig4.maxW / 100);
    const maxH = Math.floor(window.innerHeight * sizeConfig4.maxH / 100);
    return {
      w: Math.min(sizeConfig4.w, maxW),
      h: Math.min(sizeConfig4.h, maxH)
    };
  }, [sizeConfig4]);
  const effectiveSize = useMemo(() => {
    if (mobile) return null;
    if (maximized) return {
      w: window.innerWidth - MAXIMIZE_MARGIN * 2,
      h: window.innerHeight - MAXIMIZE_MARGIN * 2
    };
    return dims ?? getResponsiveSize();
  }, [mobile, maximized, dims, getResponsiveSize]);
  useEffect(() => {
    if (mobile) return;
    const onResize = () => {
      if (maximized) return;
      setDims((prev) => {
        if (!prev) return prev;
        const maxW = window.innerWidth - MAXIMIZE_MARGIN * 2;
        const maxH = window.innerHeight - MAXIMIZE_MARGIN * 2;
        const w = Math.min(prev.w, maxW);
        const h = Math.min(prev.h, maxH);
        if (w === prev.w && h === prev.h) return prev;
        return { w, h };
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobile, maximized]);
  const handleResizeStart = useCallback((edge, e) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const current = effectiveSize ?? getResponsiveSize();
    const startW = current.w;
    const startH = current.h;
    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      let newW = startW;
      let newH = startH;
      if (edge.includes("e")) newW = startW + dx;
      if (edge.includes("s")) newH = startH + dy;
      const maxW = window.innerWidth - MAXIMIZE_MARGIN * 2;
      const maxH = window.innerHeight - MAXIMIZE_MARGIN * 2;
      newW = Math.max(MIN_W, Math.min(newW, maxW));
      newH = Math.max(MIN_H, Math.min(newH, maxH));
      setDims({ w: newW, h: newH });
      setMaximized(false);
    };
    const onUp = () => {
      setResizing(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [effectiveSize, getResponsiveSize]);
  const canResize = resizable && !mobile;
  return /* @__PURE__ */ jsx("div", { className: "fixed z-[9999] inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: `relative flex flex-col overflow-hidden shadow-2xl bg-theme-700 border border-theme-600 ${mobile ? "w-full h-full rounded-none" : "rounded-xl"} ${className}`,
      style: mobile ? {} : {
        width: `${effectiveSize.w}px`,
        height: `${effectiveSize.h}px`,
        transition: resizing ? "none" : "width 200ms ease, height 200ms ease"
      },
      onClick: (ev) => ev.stopPropagation(),
      children: [
        canResize && !maximized && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute bottom-0 left-2 right-2 h-1.5 cursor-s-resize z-10",
              onMouseDown: (e) => handleResizeStart("s", e)
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute right-0 top-2 bottom-2 w-1.5 cursor-e-resize z-10",
              onMouseDown: (e) => handleResizeStart("e", e)
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-20",
              onMouseDown: (e) => handleResizeStart("se", e)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center justify-between text-white text-sm px-3 py-2 select-none",
            onDoubleClick: () => canResize && setMaximized((m) => !m),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx(icon_default, { name: icon ?? "AppWindow", size: 16, className: "me-2 opacity-80" }),
                /* @__PURE__ */ jsx("span", { className: "opacity-90", children: title ?? " " })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 select-none", children: [
                headerActions,
                canResize && /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "cursor-pointer hover:bg-white/20 p-1.5 rounded",
                    onClick: () => setMaximized((m) => !m),
                    title: maximized ? "Restaurar" : "Maximizar",
                    children: maximized ? /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", className: "text-white", children: [
                      /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "8", height: "8", stroke: "currentColor", strokeWidth: "1.2", fill: "none" }),
                      /* @__PURE__ */ jsx("path", { d: "M3 3 L3 1 L11 1 L11 3", stroke: "currentColor", strokeWidth: "1.2", fill: "none" }),
                      /* @__PURE__ */ jsx("path", { d: "M11 3 L13 3 L13 11 L11 11", stroke: "currentColor", strokeWidth: "1.2", fill: "none" })
                    ] }) : /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", className: "text-white", children: /* @__PURE__ */ jsx("rect", { x: "2", y: "2", width: "10", height: "10", stroke: "currentColor", strokeWidth: "1.2", fill: "none" }) })
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "cursor-pointer hover:bg-white/20 p-1.5 rounded", onClick: onClose, title: "Cerrar Ventana", children: /* @__PURE__ */ jsx(icon_default, { name: "X", size: 16, className: "text-white" }) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: `flex-1 overflow-hidden bg-white ${resizing ? "pointer-events-none" : ""}`, children })
      ]
    }
  ) });
};
var modal_default = Modal;
var Skeleton = ({ className = "" }) => /* @__PURE__ */ jsx("div", { className: `animate-shimmer rounded ${className}` });
Skeleton.Card = function SkeletonCard({ variant = "light", compact = false }) {
  const isLight = variant === "light";
  const shimmer = isLight ? "animate-shimmer" : "animate-shimmer-dark";
  if (compact) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-3.5", children: [
      /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded-full w-7 h-7 flex-shrink-0` }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 space-y-1.5", children: [
        /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded h-3.5 w-3/4` }),
        /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded h-2.5 w-1/2` })
      ] })
    ] });
  }
  const wrapper = isLight ? "p-3 rounded-2xl bg-white shadow-sm" : "px-3 py-2.5";
  return /* @__PURE__ */ jsxs("div", { className: `flex gap-3 ${wrapper}`, children: [
    /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded-full w-10 h-10 flex-shrink-0` }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 space-y-2 py-0.5", children: [
      /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded h-4 w-3/4` }),
      /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded h-3 w-1/2` })
    ] })
  ] });
};
Skeleton.List = function SkeletonList({
  count = 5,
  variant = "light",
  compact = false,
  className = ""
}) {
  const gap = compact ? "gap-0" : variant === "light" ? "gap-2 p-2" : "gap-0.5";
  return /* @__PURE__ */ jsx("div", { className: `flex flex-col ${gap} ${className}`, children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ jsx("div", { style: { animationDelay: `${i * 80}ms` }, className: "animate-fade-in", children: /* @__PURE__ */ jsx(Skeleton.Card, { variant, compact }) }, i)) });
};
Skeleton.FileGrid = function SkeletonFileGrid({ count = 8 }) {
  return /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-4 p-4", children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "animate-fade-in", style: { animationDelay: `${i * 60}ms` }, children: /* @__PURE__ */ jsxs("div", { className: "w-28 space-y-2", children: [
    /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded-xl w-28 h-28" }),
    /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-3 w-20 mx-auto" })
  ] }) }, i)) });
};
Skeleton.DocGrid = function SkeletonDocGrid({ count = 6 }) {
  return /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-8", children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "animate-fade-in", style: { animationDelay: `${i * 60}ms` }, children: /* @__PURE__ */ jsxs(
    "div",
    {
      style: { width: 200, height: 180 },
      className: "flex flex-col rounded-xl border border-gray-200 bg-white shadow-md p-3",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-2", children: [
          /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded-xl w-10 h-10" }),
          /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded-full w-14 h-4" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-3.5 w-4/5 mb-1.5" }),
        /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-2.5 w-3/5" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-auto pt-2 flex gap-1 justify-center", children: [
          /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded w-10 h-4" }),
          /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded w-10 h-4" })
        ] })
      ]
    }
  ) }, i)) });
};
Skeleton.StatCard = function SkeletonStatCard() {
  return /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl p-5 shadow-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 space-y-2", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-3.5 w-24" }),
      /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-8 w-16" }),
      /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-2.5 w-20" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded-xl w-12 h-12" })
  ] }) });
};
Skeleton.StatRow = function SkeletonStatRow({ className = "" }) {
  return /* @__PURE__ */ jsx("div", { className: `grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`, children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "animate-fade-in", style: { animationDelay: `${i * 80}ms` }, children: /* @__PURE__ */ jsx(Skeleton.StatCard, {}) }, i)) });
};
Skeleton.DashCard = function SkeletonDashCard({ colSpan = 6 }) {
  const colClass = {
    12: "sm:col-span-12 md:col-span-12 lg:col-span-12",
    8: "sm:col-span-12 md:col-span-8 lg:col-span-8",
    6: "sm:col-span-12 md:col-span-6 lg:col-span-6",
    4: "sm:col-span-6 md:col-span-6 lg:col-span-4"
  }[colSpan] || "sm:col-span-12 md:col-span-6 lg:col-span-6";
  return /* @__PURE__ */ jsxs("div", { className: `flex flex-col h-96 bg-white shadow-lg rounded-2xl p-6 ${colClass}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0 mb-4 space-y-2", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-5 w-40" }),
      /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-4 w-28" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded-xl w-3/4 h-3/4" }) })
  ] });
};
Skeleton.Form = function SkeletonForm({ rows = 4 }) {
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4 flex-1", children: Array.from({ length: rows }).map((_, i) => /* @__PURE__ */ jsxs("div", { className: "animate-fade-in space-y-1.5", style: { animationDelay: `${i * 80}ms` }, children: [
    /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-3.5 w-20" }),
    /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded-xl h-12 w-full" })
  ] }, i)) });
};
Skeleton.Activity = function SkeletonActivity() {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 flex-1 animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
        /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded-full w-10 h-10 flex-shrink-0" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-3.5 w-24" }),
          /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-2.5 w-16" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-3.5 w-48" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4", children: [0, 1].map((i) => /* @__PURE__ */ jsxs("div", { className: "animate-fade-in rounded-xl p-4 bg-gray-50 text-center space-y-2", style: { animationDelay: `${(i + 1) * 80}ms` }, children: [
      /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-8 w-12 mx-auto" }),
      /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-2.5 w-20 mx-auto" })
    ] }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-3.5 w-32 mb-3" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxs("div", { className: "animate-fade-in flex items-start gap-3", style: { animationDelay: `${(i + 3) * 80}ms` }, children: [
        /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded w-4 h-4 mt-0.5 flex-shrink-0" }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1.5", children: [
          /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-3.5 w-3/4" }),
          /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-2.5 w-1/2" })
        ] })
      ] }, i)) })
    ] })
  ] });
};
Skeleton.Preview = function SkeletonPreview() {
  return /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center animate-fade-in", children: /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded-xl w-3/4 h-3/4" }) });
};
Skeleton.Table = function SkeletonTable({ rows = 5 }) {
  return /* @__PURE__ */ jsx("div", { className: "w-full rounded-xl border border-gray-200 overflow-hidden", children: Array.from({ length: rows }).map((_, i) => /* @__PURE__ */ jsxs("div", { className: "animate-fade-in flex border-b border-gray-100 last:border-0", style: { animationDelay: `${i * 60}ms` }, children: [
    /* @__PURE__ */ jsx("div", { className: "w-1/3 px-3 py-3", children: /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-3 w-16" }) }),
    /* @__PURE__ */ jsx("div", { className: "w-2/3 px-3 py-3", children: /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-3 w-32" }) })
  ] }, i)) });
};
Skeleton.Welcome = function SkeletonWelcome({ className = "" }) {
  return /* @__PURE__ */ jsx("div", { className: `bg-theme-grad rounded-2xl p-6 min-h-[80px] flex items-center ${className}`, children: /* @__PURE__ */ jsx("div", { className: "animate-shimmer-dark rounded h-6 w-48" }) });
};
var skeleton_default = Skeleton;
var EmptyState = ({ title = "Sin elementos", description, className = "", variant = "light", icon, action }) => {
  const isDark = variant === "dark";
  return /* @__PURE__ */ jsxs("div", { className: `flex flex-col items-center justify-center w-full h-full min-h-48 p-8 ${className}`, children: [
    icon ? /* @__PURE__ */ jsx("div", { className: `mb-4 opacity-40 ${isDark ? "text-white/50" : "text-theme-400"}`, children: /* @__PURE__ */ jsx(icon_default, { name: icon, size: 48 }) }) : (
      /* Minimalist empty box illustration */
      /* @__PURE__ */ jsxs(
        "svg",
        {
          width: "120",
          height: "100",
          viewBox: "0 0 120 100",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          className: "mb-4 opacity-40",
          children: [
            /* @__PURE__ */ jsx(
              "path",
              {
                d: "M20 35 L60 15 L100 35 L60 55 Z",
                className: isDark ? "fill-white/20 stroke-white/40" : "fill-theme-200 stroke-theme-400",
                strokeWidth: "1.5"
              }
            ),
            /* @__PURE__ */ jsx(
              "path",
              {
                d: "M20 35 L20 65 L60 85 L60 55 Z",
                className: isDark ? "fill-white/15 stroke-white/40" : "fill-theme-100 stroke-theme-400",
                strokeWidth: "1.5"
              }
            ),
            /* @__PURE__ */ jsx(
              "path",
              {
                d: "M100 35 L100 65 L60 85 L60 55 Z",
                className: isDark ? "fill-white/10 stroke-white/40" : "fill-theme-50 stroke-theme-400",
                strokeWidth: "1.5"
              }
            ),
            /* @__PURE__ */ jsx(
              "path",
              {
                d: "M40 45 L60 35 L80 45",
                className: isDark ? "stroke-white/30" : "stroke-theme-300",
                strokeWidth: "1.5",
                strokeDasharray: "4 3",
                strokeLinecap: "round",
                fill: "none"
              }
            )
          ]
        }
      )
    ),
    /* @__PURE__ */ jsx("p", { className: `font-medium text-sm ${isDark ? "text-white/50" : "text-gray-500"}`, children: title }),
    description && /* @__PURE__ */ jsx("p", { className: `text-xs mt-1 text-center max-w-xs ${isDark ? "text-white/40" : "text-gray-400"}`, children: description }),
    action && /* @__PURE__ */ jsx(
      "button",
      {
        onClick: action.onClick,
        className: `mt-4 text-xs font-semibold px-4 py-2 rounded-btn transition-all duration-200 ${isDark ? "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white" : "bg-theme-50 text-theme-600 hover:bg-theme-100"}`,
        children: action.label
      }
    )
  ] });
};
var emptystate_default = EmptyState;
var variantConfig = {
  danger: {
    icon: "Trash2",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
    confirmBg: "bg-rose-600 hover:bg-rose-700"
  },
  warning: {
    icon: "TriangleAlert",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    confirmBg: "bg-amber-600 hover:bg-amber-700"
  },
  info: {
    icon: "Info",
    iconBg: "bg-theme-50",
    iconColor: "text-theme-600",
    confirmBg: "bg-theme-700 hover:bg-theme-600"
  }
};
var ConfirmDialog = ({ state, onDone }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const dialogRef = useRef(null);
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);
  const close = useCallback((result) => {
    setLeaving(true);
    setTimeout(() => {
      state.resolve(result);
      onDone();
    }, 200);
  }, [state, onDone]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") close(false);
      if (e.key === "Enter") close(true);
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll("button");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);
  useEffect(() => {
    if (visible && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [visible]);
  const v = state.variant || "danger";
  const cfg2 = variantConfig[v];
  return createPortal(
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `fixed inset-0 z-[10000] flex items-center justify-center transition-all duration-200 ${visible && !leaving ? "bg-black/50 backdrop-blur-sm" : "bg-black/0"}`,
        onClick: () => close(false),
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "confirm-title",
        "aria-describedby": "confirm-message",
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            ref: dialogRef,
            tabIndex: -1,
            className: `
          relative w-[360px] max-w-[90vw] overflow-hidden rounded-xl
          bg-white border border-gray-200
          shadow-2xl outline-none
          transition-all duration-200
          ${visible && !leaving ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}
        `,
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center px-6 pt-7 pb-5", children: [
                /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-xl ${cfg2.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 ${visible && !leaving ? "scale-100" : "scale-75"}`, children: /* @__PURE__ */ jsx(icon_default, { name: state.icon || cfg2.icon, size: 24, className: cfg2.iconColor }) }),
                /* @__PURE__ */ jsx("h3", { id: "confirm-title", className: "text-[15px] font-semibold text-gray-900 mb-1", children: state.title || "\xBFEst\xE1s seguro?" }),
                /* @__PURE__ */ jsx("p", { id: "confirm-message", className: "text-sm text-gray-500 leading-relaxed whitespace-pre-line", children: state.message })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2.5 px-5 pb-5", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => close(true),
                    className: `flex-1 h-10 rounded-btn text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] outline-none ${cfg2.confirmBg}`,
                    children: state.confirmText || "Confirmar"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => close(false),
                    className: "flex-1 h-10 rounded-btn text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all duration-200 active:scale-[0.98] outline-none",
                    children: state.cancelText || "Cancelar"
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    document.body
  );
};
var confirm_default = ConfirmDialog;
var variantConfig2 = {
  danger: {
    icon: "Trash2",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
    confirmBg: "bg-rose-600 hover:bg-rose-700"
  },
  warning: {
    icon: "TriangleAlert",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    confirmBg: "bg-amber-600 hover:bg-amber-700"
  },
  info: {
    icon: "Pencil",
    iconBg: "bg-theme-50",
    iconColor: "text-theme-600",
    confirmBg: "bg-theme-700 hover:bg-theme-600"
  }
};
var PromptDialog = ({ state, onDone }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [value, setValue] = useState(state.defaultValue || "");
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);
  const close = useCallback((result) => {
    setLeaving(true);
    setTimeout(() => {
      state.resolve(result);
      onDone();
    }, 200);
  }, [state, onDone]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") close(null);
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll("input, button");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);
  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [visible]);
  const v = state.variant || "info";
  const cfg2 = variantConfig2[v];
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) close(value.trim());
  };
  return createPortal(
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `fixed inset-0 z-[10000] flex items-center justify-center transition-all duration-200 ${visible && !leaving ? "bg-black/50 backdrop-blur-sm" : "bg-black/0"}`,
        onClick: () => close(null),
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "prompt-title",
        "aria-describedby": "prompt-message",
        children: /* @__PURE__ */ jsx(
          "div",
          {
            ref: dialogRef,
            className: `
          relative w-[400px] max-w-[90vw] overflow-hidden rounded-xl
          bg-white border border-gray-200
          shadow-2xl
          transition-all duration-200
          ${visible && !leaving ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}
        `,
            onClick: (e) => e.stopPropagation(),
            children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center px-6 pt-7 pb-4", children: [
                /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-xl ${cfg2.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 ${visible && !leaving ? "scale-100" : "scale-75"}`, children: /* @__PURE__ */ jsx(icon_default, { name: state.icon || cfg2.icon, size: 24, className: cfg2.iconColor }) }),
                /* @__PURE__ */ jsx("h3", { id: "prompt-title", className: "text-[15px] font-semibold text-gray-900 mb-1", children: state.title || "Ingresa un valor" }),
                /* @__PURE__ */ jsx("p", { id: "prompt-message", className: "text-sm text-gray-500 leading-relaxed whitespace-pre-line", children: state.message })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "px-5 pb-4", children: /* @__PURE__ */ jsx(
                "input",
                {
                  ref: inputRef,
                  type: state.type || "text",
                  value,
                  onChange: (e) => setValue(e.target.value),
                  placeholder: state.placeholder,
                  step: state.type === "number" ? "any" : void 0,
                  className: "w-full h-10 px-3 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-theme-500 focus:ring-2 focus:ring-theme-500/20 transition-all"
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2.5 px-5 pb-5", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: !value.trim(),
                    className: `flex-1 h-10 rounded-btn text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] outline-none disabled:opacity-40 disabled:cursor-not-allowed ${cfg2.confirmBg}`,
                    children: state.confirmText || "Aceptar"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => close(null),
                    className: "flex-1 h-10 rounded-btn text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all duration-200 active:scale-[0.98] outline-none",
                    children: state.cancelText || "Cancelar"
                  }
                )
              ] })
            ] })
          }
        )
      }
    ),
    document.body
  );
};
var prompt_default = PromptDialog;
var ContextMenu = ({ open, position, items, onClose }) => {
  const menuRef = useRef(null);
  const [adjustedPos, setAdjustedPos] = useState(null);
  useEffect(() => {
    if (!open) {
      setAdjustedPos(null);
    }
  }, [open]);
  useLayoutEffect(() => {
    if (!open || !menuRef.current) return;
    const r = menuRef.current.getBoundingClientRect();
    const pad = 8;
    let x = position.x;
    let y = position.y;
    if (x + r.width > window.innerWidth - pad) x = Math.max(pad, window.innerWidth - r.width - pad);
    if (y + r.height > window.innerHeight - pad) y = Math.max(pad, window.innerHeight - r.height - pad);
    setAdjustedPos({ x, y });
  }, [open, position.x, position.y]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      onClose();
    };
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    const onScroll = () => onClose();
    document.addEventListener("mousedown", onDown, true);
    document.addEventListener("click", onDown, true);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onDown, true);
      document.removeEventListener("click", onDown, true);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, onClose]);
  if (!open || typeof document === "undefined") return null;
  const displayPos = adjustedPos || position;
  const isVisible = adjustedPos !== null;
  return createPortal(
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: menuRef,
        className: "fixed z-50 w-52 rounded-xl overflow-hidden shadow-2xl bg-gray-50 border border-gray-200",
        style: {
          left: displayPos.x,
          top: displayPos.y,
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none"
        },
        onMouseDown: (e) => e.stopPropagation(),
        children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-px p-1", children: items.map((item, i) => item.type === "separator" ? /* @__PURE__ */ jsx("div", { className: "h-px bg-gray-200 my-1 mx-2" }, i) : /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            disabled: item.disabled,
            className: `w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left ${item.disabled ? "opacity-40 cursor-not-allowed" : item.variant === "red" ? "text-red-600 hover:bg-red-50" : item.variant === "amber" ? "text-amber-600 hover:bg-amber-50" : "text-gray-700 hover:bg-gray-100"}`,
            onClick: (e) => {
              e.stopPropagation();
              if (item.disabled) return;
              onClose();
              item.action?.();
            },
            children: [
              item.icon && /* @__PURE__ */ jsx(icon_default, { name: item.icon, size: 16, className: item.disabled ? "" : item.variant === "red" ? "text-red-500" : item.variant === "amber" ? "text-amber-500" : "text-gray-700" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: item.label })
            ]
          },
          i
        )) })
      }
    ),
    document.body
  );
};
var contextmenu_default = ContextMenu;
var containerSizes = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10"
};
var DEFAULT_COLORS = { iconBg: "bg-gray-100", text: "text-gray-700" };
var SectionIcon = ({
  colors = DEFAULT_COLORS,
  icon,
  size = 18,
  containerSize = "md",
  className = ""
}) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `
        shrink-0 flex items-center justify-center rounded-xl
        ${containerSizes[containerSize]}
        ${colors.iconBg}
        ${className}
      `,
      children: /* @__PURE__ */ jsx(icon_default, { name: icon, size, className: colors.text })
    }
  );
};
var sectionicon_default = SectionIcon;
var Card = ({ item, isSelected, onClick, checkbox }) => /* @__PURE__ */ jsxs(
  "div",
  {
    onClick: checkbox ? () => checkbox.onChange(!checkbox.checked) : onClick,
    className: `
            group relative flex items-center gap-3 p-3 rounded-2xl cursor-pointer
            transition-all duration-200 ease-out bg-white
            shadow-md hover:shadow-lg active:scale-[0.99]
            ${isSelected ? "ring-2 ring-theme-500" : ""}
        `,
    children: [
      checkbox ? /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 flex items-center", onClick: (e) => {
        e.stopPropagation();
        checkbox.onChange(!checkbox.checked);
      }, children: /* @__PURE__ */ jsx(
        icon_default,
        {
          name: checkbox.checked ? "SquareCheckBig" : "Square",
          size: 18,
          className: `cursor-pointer transition-colors ${checkbox.checked ? "text-theme-500" : "text-gray-300"}`
        }
      ) }) : item.icon ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 rounded-xl bg-theme-100 flex-shrink-0", children: typeof item.icon === "string" ? /* @__PURE__ */ jsx(icon_default, { name: item.icon, size: 24, className: "text-theme-600" }) : item.icon }) : null,
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 flex flex-col items-start", children: [
        typeof item.title === "string" ? /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-800 truncate max-w-full", children: item.title }) : item.title,
        item.subtitle && (typeof item.subtitle === "string" ? /* @__PURE__ */ jsx("span", { className: "mt-0.5 text-xs text-theme-500 truncate max-w-full", children: item.subtitle }) : item.subtitle)
      ] }),
      item.right && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: item.right })
    ]
  }
);
var CardCompact = ({ item, isSelected, onClick, checkbox }) => /* @__PURE__ */ jsxs(
  "button",
  {
    onClick: checkbox ? () => checkbox.onChange(!checkbox.checked) : onClick,
    className: `w-full relative flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${isSelected ? "bg-white/15" : "hover:bg-white/10"}`,
    children: [
      checkbox ? /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 flex items-center", onClick: (e) => {
        e.stopPropagation();
        checkbox.onChange(!checkbox.checked);
      }, children: /* @__PURE__ */ jsx(
        icon_default,
        {
          name: checkbox.checked ? "SquareCheckBig" : "Square",
          size: 18,
          className: `cursor-pointer transition-colors ${checkbox.checked ? "text-white" : "text-white/30"}`
        }
      ) }) : item.icon ? typeof item.icon === "string" ? /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-white/10", children: /* @__PURE__ */ jsx(icon_default, { name: item.icon, size: 18, className: "text-white/80" }) }) : /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: item.icon }) : null,
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        typeof item.title === "string" ? /* @__PURE__ */ jsx("div", { className: `text-sm font-medium truncate ${isSelected ? "text-white" : "text-white/90"}`, children: item.title }) : item.title,
        item.subtitle && (typeof item.subtitle === "string" ? /* @__PURE__ */ jsx("div", { className: "text-xs text-white/60 truncate", children: item.subtitle }) : item.subtitle)
      ] }),
      item.right && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: item.right }),
      isSelected && !checkbox && /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" })
    ]
  }
);
function CardList({ items, selectedId, onSelect, compact, checkedIds, onCheck }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const getCheckbox = (id) => checkedIds && onCheck ? { checked: checkedIds.has(id), onChange: (checked) => onCheck(id, checked) } : void 0;
  if (compact) {
    return /* @__PURE__ */ jsx("div", { className: "flex flex-col py-1", children: items.map((item, i) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "animate-fade-in",
        style: i < 8 ? { animationDelay: `${i * 40}ms` } : void 0,
        children: /* @__PURE__ */ jsx(
          CardCompact,
          {
            item,
            isSelected: selectedId === item.id,
            onClick: () => onSelect(item.id),
            checkbox: getCheckbox(item.id)
          }
        )
      },
      item.id
    )) });
  }
  return /* @__PURE__ */ jsx("div", { className: "grid p-1.5 sm:p-2.5", children: items.map((item, i) => /* @__PURE__ */ jsx(
    "div",
    {
      className: "p-1.5 animate-fade-in-up",
      style: i < 8 ? { animationDelay: `${i * 50}ms` } : void 0,
      children: /* @__PURE__ */ jsx(
        Card,
        {
          item,
          isSelected: selectedId === item.id,
          onClick: () => onSelect(item.id),
          checkbox: getCheckbox(item.id)
        }
      )
    },
    item.id
  )) });
}
function MasterDetail({
  title,
  icon,
  list,
  detail,
  hasSelection,
  sidebarWidth = 280,
  actions,
  sidebarHeader,
  sidebarFooter,
  mobileTbar,
  mobileExtension,
  items,
  onSelect,
  detailLoading
}) {
  const isDesktop = useIsDesktop();
  const [showControls, setShowControls] = useState(false);
  useEffect(() => {
    if (isDesktop && !hasSelection && items?.length && onSelect) {
      onSelect(items[0].id);
    }
  }, [isDesktop, hasSelection, items, onSelect]);
  const hasControls = sidebarHeader || sidebarFooter;
  const hasItems = (items?.length ?? 0) > 0;
  const isInitialLoading = items === void 0;
  const detailLoadingContent = detailLoading ?? /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col gap-6 p-6 bg-gradient-to-br from-theme-50 to-white", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-5 w-40" }),
      /* @__PURE__ */ jsx("div", { className: "animate-shimmer rounded h-3 w-24" })
    ] }),
    /* @__PURE__ */ jsx(skeleton_default.Form, { rows: 5 })
  ] });
  if (isDesktop) {
    return /* @__PURE__ */ jsxs("div", { className: "h-full flex rounded-xl overflow-hidden", children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "h-full flex-shrink-0 flex flex-col bg-gradient-to-b from-theme-700 to-theme-800",
          style: { width: sidebarWidth },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                icon && /* @__PURE__ */ jsx(icon_default, { name: icon, size: 22, className: "text-white/80" }),
                /* @__PURE__ */ jsx("span", { className: "text-lg font-bold uppercase tracking-wide text-white", children: title })
              ] }),
              actions && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: actions })
            ] }),
            hasControls && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setShowControls(!showControls),
                className: "flex items-center justify-end h-9 px-4 hover:bg-white/5 transition-colors",
                children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-[11px] text-white/50 uppercase tracking-wider", children: [
                  /* @__PURE__ */ jsx(icon_default, { name: showControls ? "ChevronUp" : "SlidersHorizontal", size: 12 }),
                  "Filtros"
                ] })
              }
            ),
            showControls && sidebarHeader && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 px-4 py-3 border-b border-white/10", children: sidebarHeader }),
            /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 overflow-auto", children: list }),
            sidebarFooter && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 px-3 py-2", children: sidebarFooter })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0 h-full flex flex-col overflow-hidden bg-white rounded-r-xl", children: hasSelection && detail ? detail : isInitialLoading ? detailLoadingContent : hasItems ? /* @__PURE__ */ jsx("div", { className: "h-full flex items-center justify-center bg-gradient-to-br from-theme-50 to-white", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx(icon_default, { name: "MousePointerClick", size: 32, className: "text-theme-300 mx-auto mb-2" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-400", children: "Seleccione un elemento" })
      ] }) }) : /* @__PURE__ */ jsx("div", { className: "h-full bg-gradient-to-br from-theme-50 to-white" }) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col overflow-hidden", children: [
    !hasSelection && /* @__PURE__ */ jsxs("header", { className: "flex-shrink-0 flex flex-col bg-gradient-to-r from-theme-700 to-theme-600", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          icon && /* @__PURE__ */ jsx(icon_default, { name: icon, size: 22, className: "text-theme-100 icon-shadow-md" }),
          /* @__PURE__ */ jsx("span", { className: "text-xl font-bold uppercase tracking-wide text-theme-100 text-shadow-md", children: title })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 flex justify-end gap-2", children: mobileTbar })
      ] }),
      hasControls && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setShowControls(!showControls),
          className: "flex items-center justify-end h-9 px-4 hover:bg-white/5 transition-colors",
          children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-[11px] text-white/50 uppercase tracking-wider", children: [
            /* @__PURE__ */ jsx(icon_default, { name: showControls ? "ChevronUp" : "SlidersHorizontal", size: 12 }),
            "Filtros"
          ] })
        }
      ),
      showControls && sidebarHeader && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 px-4 pt-2 pb-4", children: sidebarHeader })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 bg-white overflow-hidden", children: hasSelection && detail ? detail : /* @__PURE__ */ jsx("div", { className: "h-full overflow-auto", children: list }) })
  ] });
}
var colorMap = {
  default: { bg: "bg-gray-50", text: "text-gray-600", icon: "text-gray-400" },
  success: { bg: "bg-emerald-50", text: "text-emerald-600", icon: "text-emerald-400" },
  warning: { bg: "bg-amber-50", text: "text-amber-600", icon: "text-amber-400" },
  danger: { bg: "bg-rose-50", text: "text-rose-600", icon: "text-rose-400" }
};
function StatCard({ label, value, icon, subtitle, trend, color = "default", onClick }) {
  const colors = colorMap[color];
  return /* @__PURE__ */ jsx(
    "div",
    {
      onClick,
      className: `relative overflow-hidden bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 ${onClick ? "cursor-pointer" : ""}`,
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-500 truncate", children: label }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-3xl font-bold text-theme-700", children: value }),
          subtitle && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-400", children: subtitle }),
          trend && /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(icon_default, { name: trend.value >= 0 ? "TrendingUp" : "TrendingDown", size: 14, className: trend.value >= 0 ? "text-emerald-500" : "text-rose-500" }),
            /* @__PURE__ */ jsxs("span", { className: `text-xs font-medium ${trend.value >= 0 ? "text-emerald-600" : "text-rose-600"}`, children: [
              trend.value >= 0 ? "+" : "",
              trend.value,
              "%"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400", children: trend.label })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: `${colors.bg} rounded-xl p-3`, children: /* @__PURE__ */ jsx(icon_default, { name: icon, size: 24, className: colors.icon }) })
      ] })
    }
  );
}
function SidebarFilter({ value, onChange, placeholder = "Filtrar..." }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-white/10 rounded-btn px-3 h-9", children: [
    /* @__PURE__ */ jsx(icon_default, { name: "Search", size: 14, className: "text-white/50" }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        defaultValue: value,
        onBlur: (e) => onChange(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            onChange(e.currentTarget.value);
            e.currentTarget.blur();
          }
        },
        placeholder,
        className: "flex-1 min-w-0 bg-transparent text-sm text-white placeholder:text-white/40 border-none focus:ring-0 outline-none"
      }
    )
  ] });
}
function SidebarSort({ options, value, onChange, direction, onDirectionChange }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsx(
      "select",
      {
        value,
        onChange: (e) => onChange(e.target.value),
        className: 'flex-1 min-w-0 h-8 px-3 pr-8 text-xs bg-white/10 text-white rounded-btn border-none focus:ring-1 focus:ring-white/30 cursor-pointer appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2712%27%20height%3D%2712%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27rgba(255%2C255%2C255%2C0.5)%27%20stroke-width%3D%272%27%3E%3Cpath%20d%3D%27m6%209%206%206%206-6%27%2F%3E%3C%2Fsvg%3E")] bg-no-repeat bg-[center_right_0.5rem]',
        children: options.map((opt) => /* @__PURE__ */ jsx("option", { value: opt.value, className: "bg-theme-700 text-white", children: opt.label }, opt.value))
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => onDirectionChange(direction === "asc" ? "desc" : "asc"),
        className: "h-8 w-8 flex items-center justify-center rounded-btn bg-white/10 hover:bg-white/20 transition-colors",
        title: direction === "asc" ? "Ascendente" : "Descendente",
        children: /* @__PURE__ */ jsx(
          icon_default,
          {
            name: direction === "asc" ? "ArrowUp" : "ArrowDown",
            size: 14,
            className: "text-white/80"
          }
        )
      }
    )
  ] });
}
function SidebarPaginator({ page, setPage, hasNext }) {
  const hasPrev = page > 0;
  if (!hasPrev && !hasNext) return null;
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setPage(Math.max(0, page - 1)),
        disabled: !hasPrev,
        className: "h-8 w-8 flex items-center justify-center rounded-btn bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors",
        children: /* @__PURE__ */ jsx(icon_default, { name: "ChevronLeft", size: 16, className: "text-white" })
      }
    ),
    /* @__PURE__ */ jsxs("span", { className: "text-xs text-white/60", children: [
      "P\xE1gina ",
      page + 1
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setPage(page + 1),
        disabled: !hasNext,
        className: "h-8 w-8 flex items-center justify-center rounded-btn bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors",
        children: /* @__PURE__ */ jsx(icon_default, { name: "ChevronRight", size: 16, className: "text-white" })
      }
    )
  ] });
}
function SidebarControls({
  search,
  onSearchChange,
  sortOptions,
  sortBy,
  onSortChange,
  sortDir,
  onSortDirChange
}) {
  const [expanded, setExpanded] = useState(false);
  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label || sortBy;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setExpanded(!expanded),
        className: "flex items-center justify-between gap-2 h-9 px-3 rounded-btn bg-white/10 hover:bg-white/15 transition-colors",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsx(icon_default, { name: "SlidersHorizontal", size: 14, className: "text-white/60 flex-shrink-0" }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-white/80 truncate", children: [
              search ? `"${search}"` : currentSortLabel,
              search && ` \xB7 ${currentSortLabel}`
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            icon_default,
            {
              name: expanded ? "ChevronUp" : "ChevronDown",
              size: 14,
              className: "text-white/50 flex-shrink-0"
            }
          )
        ]
      }
    ),
    expanded && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 mt-2", children: [
      /* @__PURE__ */ jsx(SidebarFilter, { value: search, onChange: onSearchChange }),
      /* @__PURE__ */ jsx(
        SidebarSort,
        {
          options: sortOptions,
          value: sortBy,
          onChange: onSortChange,
          direction: sortDir,
          onDirectionChange: onSortDirChange
        }
      )
    ] })
  ] });
}
var EditableTitle = ({ value, onChange, className = "" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  useEffect(() => {
    setEditValue(value);
  }, [value]);
  const handleSave = () => {
    if (editValue.trim() && editValue !== value) {
      onChange?.(editValue.trim());
    }
    setIsEditing(false);
  };
  const hasCustomColor = className.includes("text-");
  if (isEditing) {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        value: editValue,
        onChange: (e) => setEditValue(e.target.value),
        onBlur: handleSave,
        onKeyDown: (e) => e.key === "Enter" && handleSave(),
        onClick: (e) => e.stopPropagation(),
        className: `font-semibold bg-transparent focus:outline-none focus:ring-0 w-full ${hasCustomColor ? "" : "text-gray-800"} ${className}`,
        style: { padding: 0, border: "none" },
        autoFocus: true
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "h3",
    {
      className: `group/title font-semibold truncate inline-flex items-center gap-1 ${hasCustomColor ? "" : "text-gray-800 hover:text-theme-600"} ${onChange ? "cursor-text" : ""} ${className}`,
      onClick: (e) => {
        e.stopPropagation();
        onChange && setIsEditing(true);
      },
      title: onChange ? "Clic para editar" : void 0,
      children: [
        value,
        onChange && /* @__PURE__ */ jsx(icon_default, { name: "Pencil", size: 12, className: `opacity-0 group-hover/title:opacity-100 transition-opacity flex-shrink-0 ${hasCustomColor ? "text-current" : "text-gray-400"}` })
      ]
    }
  );
};
var editabletitle_default = EditableTitle;
var EmailLink = ({ label, email, onClick, className = "" }) => {
  const hasCustomColor = className.includes("text-");
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: `group/name text-sm inline-flex items-center gap-1 ${hasCustomColor ? "" : "text-gray-500 hover:text-theme-600"} ${onClick ? "cursor-pointer" : ""} ${className}`,
      onClick: (e) => {
        e.stopPropagation();
        onClick?.();
      },
      title: onClick ? email || "Enviar correo" : void 0,
      children: [
        /* @__PURE__ */ jsx("span", { className: `truncate ${email ? "group-hover/name:hidden" : ""}`, children: label }),
        email && /* @__PURE__ */ jsx("span", { className: "hidden group-hover/name:inline truncate", children: email }),
        onClick && /* @__PURE__ */ jsx(icon_default, { name: "Mail", size: 10, className: `opacity-0 group-hover/name:opacity-100 transition-opacity flex-shrink-0 ${hasCustomColor ? "text-current" : "text-gray-400"}` })
      ]
    }
  );
};
var emaillink_default = EmailLink;
function DetailBar({ title, subtitle, email, icon, toolbar, extra, subtitlePrefix, variant = "light", onRename, onEmail }) {
  const isDark = variant === "dark";
  const renderTitle = (className) => {
    if (typeof title === "string" && onRename) {
      return /* @__PURE__ */ jsx(editabletitle_default, { value: title, onChange: onRename, className });
    }
    if (typeof title === "string") {
      return /* @__PURE__ */ jsx("span", { className: `${className} truncate`, children: title });
    }
    return title;
  };
  const renderSubtitle = (className) => {
    if (!subtitle) return null;
    if (typeof subtitle === "string" && onEmail) {
      return /* @__PURE__ */ jsx(emaillink_default, { label: subtitle, email, onClick: onEmail, className });
    }
    if (typeof subtitle === "string") {
      return /* @__PURE__ */ jsx("span", { className: `${className} truncate`, children: subtitle });
    }
    return subtitle;
  };
  if (isDark) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
        icon && /* @__PURE__ */ jsx(icon_default, { name: icon, size: 22, className: "text-white/80" }),
        /* @__PURE__ */ jsxs("div", { className: "group flex flex-col min-w-0", children: [
          renderTitle("text-lg font-bold uppercase tracking-wide text-white text-shadow-md"),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
            subtitlePrefix && /* @__PURE__ */ jsx("span", { className: "text-sm text-white/50", children: subtitlePrefix }),
            renderSubtitle("text-sm text-white/70"),
            extra && subtitle && /* @__PURE__ */ jsx("span", { className: "text-white/30", children: "\xB7" }),
            extra
          ] })
        ] })
      ] }),
      toolbar && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: toolbar })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative border-b border-theme-100 bg-theme-50", children: [
    icon && /* @__PURE__ */ jsx("div", { className: "absolute -right-3 -bottom-6 opacity-[0.05] pointer-events-none", children: /* @__PURE__ */ jsx(icon_default, { name: icon, size: 120, className: "text-theme-600" }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center justify-between px-6 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
        icon && /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-theme-100 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(icon_default, { name: icon, size: 18, className: "text-theme-600" }) }),
        /* @__PURE__ */ jsxs("div", { className: "group flex flex-col min-w-0", children: [
          renderTitle("text-base font-semibold text-theme-700"),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
            subtitlePrefix && /* @__PURE__ */ jsx("span", { className: "text-xs text-theme-400", children: subtitlePrefix }),
            renderSubtitle("text-xs text-theme-600"),
            extra && subtitle && /* @__PURE__ */ jsx("span", { className: "text-theme-300", children: "\xB7" }),
            extra
          ] })
        ] })
      ] }),
      toolbar && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: toolbar })
    ] })
  ] });
}
var Card2 = ({ title, subtitle, children, colSpan = 6 }) => {
  const colClass = {
    12: "sm:col-span-12 md:col-span-12 lg:col-span-12",
    8: "sm:col-span-12 md:col-span-8 lg:col-span-8",
    6: "sm:col-span-12 md:col-span-6 lg:col-span-6",
    4: "sm:col-span-6 md:col-span-6 lg:col-span-4",
    3: "sm:col-span-6 md:col-span-4 lg:col-span-3"
  }[colSpan] || "sm:col-span-12 md:col-span-6 lg:col-span-6";
  return /* @__PURE__ */ jsxs("div", { className: `flex flex-col h-96 bg-white shadow-lg hover:shadow-xl rounded-2xl p-6 ${colClass} transition-all duration-300`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0 text-lg sm:text-xl md:text-xl lg:text-xl xl:text-2xl font-bold text-theme-700 mb-4 whitespace-nowrap overflow-hidden text-ellipsis", children: [
      title,
      subtitle && /* @__PURE__ */ jsx("div", { className: "text-base sm:text-md md:text-md lg:text-base xl:text-lg font-semibold text-theme-500 mt-1 whitespace-nowrap overflow-hidden text-ellipsis", children: subtitle })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 overflow-y-auto", children })
  ] });
};
var card_default = Card2;
var Anchor = ({ children, className = "", onClick, ...props }) => {
  const handleClick = (e) => {
    e.preventDefault();
    onClick?.(e);
  };
  return /* @__PURE__ */ jsx(
    "a",
    {
      href: "#",
      onClick: handleClick,
      className: `block ${className}`.trim(),
      ...props,
      children
    }
  );
};
var anchor_default = Anchor;
var ProgressRing = ({ progress, size = 36, light = false }) => {
  const strokeWidth = light ? 2.5 : 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress / 100 * circumference;
  return /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-center flex-shrink-0", children: [
    /* @__PURE__ */ jsxs("svg", { width: size, height: size, className: "transform -rotate-90", children: [
      /* @__PURE__ */ jsx(
        "circle",
        {
          cx: size / 2,
          cy: size / 2,
          r: radius,
          stroke: "currentColor",
          strokeWidth,
          fill: "none",
          className: light ? "text-white/15" : "text-theme-200"
        }
      ),
      /* @__PURE__ */ jsx(
        "circle",
        {
          cx: size / 2,
          cy: size / 2,
          r: radius,
          stroke: "currentColor",
          strokeWidth,
          fill: "none",
          strokeLinecap: "round",
          strokeDasharray: circumference,
          strokeDashoffset: offset,
          className: light ? "text-white transition-all duration-500 ease-out" : "text-theme-500 transition-all duration-500 ease-out"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("span", { className: `absolute font-bold ${light ? "text-[9px] text-white" : "text-[10px] text-theme-700"}`, children: [
      progress,
      "%"
    ] })
  ] });
};
var progressring_default = ProgressRing;
function DetailContent({ children, className = "" }) {
  return /* @__PURE__ */ jsx("div", { className: `flex-1 min-h-0 overflow-auto ${className}`, children });
}
var DragHere = () => {
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 3500);
    const hideTimer = setTimeout(() => setVisible(false), 5e3);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);
  if (!visible) return null;
  const text = isMobile ? "Toca para subir documentos" : "Arrastre aqu\xED los documentos";
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `
        fixed bottom-4 left-0 right-0 z-20 flex justify-center
        pointer-events-none select-none
        transition-opacity duration-[1500ms] ease-out
        ${fading ? "opacity-0" : "opacity-100"}
      `,
      children: /* @__PURE__ */ jsx("div", { className: "\n        px-4 py-2 rounded-full whitespace-nowrap w-fit\n        bg-white/70 backdrop-blur-sm\n        text-theme-600 text-sm font-medium\n      ", children: text })
    }
  );
};
var dragherehint_default = DragHere;
var Toast = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration]);
  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300);
  };
  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return { bg: "bg-emerald-50", iconBg: "bg-emerald-100", text: "text-emerald-700", icon: "CircleCheck" };
      case "error":
        return { bg: "bg-rose-50", iconBg: "bg-rose-100", text: "text-rose-700", icon: "CircleX" };
      case "warning":
        return { bg: "bg-amber-50", iconBg: "bg-amber-100", text: "text-amber-700", icon: "TriangleAlert" };
      default:
        return { bg: "bg-violet-50", iconBg: "bg-violet-100", text: "text-violet-700", icon: "Info" };
    }
  };
  const styles = getToastStyles();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        ${styles.bg} rounded-xl shade-md
        p-4 min-w-[300px] max-w-[400px] relative overflow-hidden
      `,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: `shrink-0 flex items-center justify-center rounded-xl w-8 h-8 ${styles.iconBg}`, children: /* @__PURE__ */ jsx(icon_default, { name: styles.icon, size: 18, className: styles.text }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            toast.title && /* @__PURE__ */ jsx("div", { className: `font-medium text-sm mb-0.5 uppercase ${styles.text}`, children: toast.title }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: toast.message }),
            toast.action && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: toast.action.onClick,
                className: `mt-2 text-xs font-medium underline hover:no-underline ${styles.text}`,
                children: toast.action.label
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleClose,
              className: "flex-shrink-0 p-1 rounded-xl hover:bg-black/5 transition-colors text-gray-400 hover:text-gray-600",
              children: /* @__PURE__ */ jsx(icon_default, { name: "X", size: 16 })
            }
          )
        ] }),
        toast.duration && toast.duration > 0 && /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: `h-full ${styles.iconBg}`,
            style: {
              animation: `toast-shrink ${toast.duration}ms linear forwards`,
              animationDelay: "10ms"
            }
          }
        ) })
      ]
    }
  );
};
var toast_default = Toast;
var ToastContainer = () => {
  const { toasts, removeToast } = useToast();
  if (toasts.length === 0) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed bottom-4 right-4 z-[10000] flex flex-col-reverse space-y-reverse space-y-2", children: toasts.map((toast) => /* @__PURE__ */ jsx(
    Toast,
    {
      toast,
      onClose: removeToast
    },
    toast.id
  )) });
};
var DEFAULT_COLORS2 = { bg: "bg-gray-50", text: "text-gray-700", iconBg: "bg-gray-100" };
var Accordion = ({ sections, forceExpanded = false, defaultOpenId, bare = false }) => {
  const initialOpenId = defaultOpenId === void 0 ? sections[0]?.id ?? null : defaultOpenId;
  const [openId, setOpenId] = useState(initialOpenId);
  const handleToggle = (sectionId) => {
    if (forceExpanded) return;
    setOpenId((prev) => prev === sectionId ? null : sectionId);
  };
  const content = sections.map((section) => {
    const colors = section.colors ?? DEFAULT_COLORS2;
    const isExpanded = forceExpanded || openId === section.id;
    const contentId = `section-content-${section.id}`;
    return /* @__PURE__ */ jsxs("div", { className: `border-b border-gray-200 last:border-b-0 flex flex-col ${isExpanded ? "flex-1 min-h-0" : ""}`, children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleToggle(section.id),
          "aria-expanded": isExpanded,
          "aria-controls": contentId,
          className: `w-full flex items-center gap-1.5 sm:gap-2.5 px-2.5 py-1.5 sm:px-4 sm:py-2.5 flex-shrink-0 ${colors.bg} hover:brightness-95 transition-all ${forceExpanded ? "cursor-default" : ""}`,
          children: [
            /* @__PURE__ */ jsx(sectionicon_default, { colors, icon: section.icon, size: 14, containerSize: "sm" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 text-left flex items-baseline gap-1.5", children: [
              /* @__PURE__ */ jsx("div", { className: `font-semibold text-sm truncate ${colors.text}`, children: section.number ? `${section.number}. ${section.title}` : section.title }),
              section.subtitle && /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-400 shrink-0", children: section.subtitle })
            ] }),
            !forceExpanded && /* @__PURE__ */ jsx(
              icon_default,
              {
                name: "ChevronDown",
                size: 16,
                className: `${colors.text} transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          id: contentId,
          role: "region",
          className: `p-2.5 sm:p-4 bg-gray-50/30 ${isExpanded ? "flex-1 min-h-0 overflow-auto" : "hidden print:block"}`,
          children: section.content
        }
      )
    ] }, section.id);
  });
  if (bare) return /* @__PURE__ */ jsx(Fragment, { children: content });
  return /* @__PURE__ */ jsx("div", { className: "rounded-xl overflow-hidden border border-gray-200 flex-1 flex flex-col min-h-0", children: content });
};
var section_default = Accordion;
var Tooltip2 = ({ label, btnRef }) => {
  const [pos, setPos] = useState(null);
  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({ top: rect.bottom + 6, left: rect.left + rect.width / 2 });
  }, [btnRef]);
  if (!pos) return null;
  return createPortal(
    /* @__PURE__ */ jsx(
      "span",
      {
        className: "fixed pointer-events-none z-50 px-2 py-0.5 rounded text-[11px] whitespace-nowrap bg-gray-900 text-white shadow-lg -translate-x-1/2",
        style: { top: pos.top, left: pos.left },
        children: label
      }
    ),
    document.body
  );
};
var ToolbarButton = ({
  icon,
  label,
  visible = true,
  onClick,
  active = false,
  blink = false,
  variant = "dark",
  className = "",
  disabled,
  ...rest
}) => {
  const [blinkActive, setBlinkActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const btnRef = useRef(null);
  useEffect(() => {
    if (!blink) return;
    const i = setInterval(() => setBlinkActive((a) => !a), 600);
    return () => clearInterval(i);
  }, [blink]);
  if (!visible) return null;
  const disabledEffect = disabled ? "opacity-40 blur-[0.5px]" : "";
  const variantStyles2 = variant === "light" ? "bg-white hover:bg-gray-50 text-theme-700 hover:text-theme-800" : "bg-white/10 hover:bg-white/15 text-white/80 hover:text-white";
  const activeStyles = variant === "light" ? "bg-gray-100 text-theme-600" : "bg-white/20 text-white";
  return /* @__PURE__ */ jsxs(
    "button",
    {
      ...rest,
      ref: btnRef,
      disabled,
      onClick: (e) => {
        e.stopPropagation();
        onClick?.(e);
      },
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      "aria-label": label,
      className: `
                flex items-center justify-center h-9 px-3
                ${variantStyles2}
                backdrop-blur-sm transition-all duration-200
                first:rounded-l-btn last:rounded-r-btn
                ${active ? activeStyles : ""}
                ${blinkActive ? "opacity-30" : ""}
                ${disabled ? "cursor-not-allowed" : ""}
                ${className}
            `,
      children: [
        /* @__PURE__ */ jsx(icon_default, { name: icon, size: 16, className: `${variant === "dark" ? "icon-shadow-sm" : ""} ${disabledEffect}` }),
        hovered && /* @__PURE__ */ jsx(Tooltip2, { label, btnRef })
      ]
    }
  );
};
var toolbarbutton_default = ToolbarButton;
var Tooltip3 = ({ label, btnRef }) => {
  const [pos, setPos] = useState(null);
  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({ top: rect.bottom + 6, left: rect.left + rect.width / 2 });
  }, [btnRef]);
  if (!pos) return null;
  return createPortal(
    /* @__PURE__ */ jsx(
      "span",
      {
        className: "fixed pointer-events-none z-50 px-2 py-0.5 rounded text-[11px] whitespace-nowrap bg-gray-900 text-white shadow-lg -translate-x-1/2",
        style: { top: pos.top, left: pos.left },
        children: label
      }
    ),
    document.body
  );
};
var ToolBack = ({ icon, label = "Volver", onClick, variant = "light" }) => {
  const [hovered, setHovered] = useState(false);
  const btnRef = useRef(null);
  const variantStyles2 = variant === "light" ? "bg-theme-100 hover:bg-theme-200 text-theme-700 hover:text-theme-800" : "bg-white/10 hover:bg-white/15 text-white/80 hover:text-white";
  return /* @__PURE__ */ jsxs(
    "button",
    {
      ref: btnRef,
      onClick: (e) => {
        e.stopPropagation();
        onClick();
      },
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      "aria-label": label,
      className: `
                flex items-center justify-center gap-0.5 h-9 px-2
                ${variantStyles2}
                backdrop-blur-sm transition-all duration-200
                rounded-btn
            `,
      children: [
        /* @__PURE__ */ jsx(icon_default, { name: "ChevronLeft", size: 16, className: variant === "dark" ? "icon-shadow-sm" : "" }),
        /* @__PURE__ */ jsx(icon_default, { name: icon, size: 16, className: variant === "dark" ? "icon-shadow-sm" : "" }),
        hovered && /* @__PURE__ */ jsx(Tooltip3, { label, btnRef })
      ]
    }
  );
};
var toolback_default = ToolBack;
var ButtonGroup = ({ children, className = "", visible = true, variant = "dark" }) => {
  if (!visible) return null;
  const bg = variant === "dark" ? "bg-white/10" : "bg-gray-200 shadow-sm";
  return /* @__PURE__ */ jsx(
    "div",
    {
      onClick: (e) => e.stopPropagation(),
      className: `flex gap-px ${bg} rounded-btn p-px overflow-hidden ${className}`,
      children
    }
  );
};
var buttongroup_default = ButtonGroup;
var Label = ({ text, className = "", visible = true }) => {
  if (!visible) return null;
  return /* @__PURE__ */ jsx("div", { className: `flex items-center justify-center px-4 min-w-[2.5rem] h-9 bg-white/10 text-white font-semibold text-sm ${className}`, children: text });
};
var label_default = Label;
var Paginator = ({ page, setPage, hasNext, className = "", visible, compact = false }) => {
  const hasPrev = page > 0;
  if (visible === false || visible === void 0 && !hasPrev && !hasNext) return null;
  if (compact) {
    return /* @__PURE__ */ jsx("div", { className: `flex items-center ${className}`, children: /* @__PURE__ */ jsxs(buttongroup_default, { children: [
      /* @__PURE__ */ jsx(
        toolbarbutton_default,
        {
          icon: "ChevronLeft",
          label: "Anterior",
          onClick: () => setPage(Math.max(page - 1, 0)),
          disabled: page === 0
        }
      ),
      /* @__PURE__ */ jsx(label_default, { text: `${page + 1}` }),
      /* @__PURE__ */ jsx(
        toolbarbutton_default,
        {
          icon: "ChevronRight",
          label: "Siguiente",
          onClick: () => setPage(page + 1),
          disabled: !hasNext
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: `flex justify-end p-3 sm:p-4 ${className}`, children: /* @__PURE__ */ jsxs(buttongroup_default, { children: [
    /* @__PURE__ */ jsx(
      toolbarbutton_default,
      {
        icon: "ChevronLeft",
        label: "Anterior",
        onClick: () => setPage(Math.max(page - 1, 0)),
        disabled: page === 0
      }
    ),
    /* @__PURE__ */ jsx(label_default, { text: `${page + 1}` }),
    /* @__PURE__ */ jsx(
      toolbarbutton_default,
      {
        icon: "ChevronRight",
        label: "Siguiente",
        onClick: () => setPage(page + 1),
        disabled: !hasNext
      }
    )
  ] }) });
};
var paginator_default = Paginator;
var Tabs = ({
  tabs,
  activeTab: controlledActive,
  onChange,
  onRefresh,
  children,
  className = "",
  variant = "underline",
  selectedBackground,
  selectedForeground,
  inactiveBackground,
  inactiveForeground,
  rounded = true
}) => {
  const [internalActive, setInternalActive] = useState(tabs[0]?.id || "");
  const activeId = controlledActive ?? internalActive;
  useEffect(() => {
    if (tabs.length > 0 && !tabs.some((t) => t.id === activeId)) {
      const newActive = tabs[0].id;
      setInternalActive(newActive);
      onChange?.(newActive);
    }
  }, [tabs, activeId]);
  const handleTabClick = (tabId) => {
    if (tabId === activeId) {
      onRefresh?.(tabId);
    } else {
      if (controlledActive === void 0) {
        setInternalActive(tabId);
      }
      onChange?.(tabId);
    }
  };
  const activeContent = tabs.find((t) => t.id === activeId)?.content;
  if (tabs.length === 0) return null;
  const hasGroups = tabs.some((t) => t.group !== void 0);
  hasGroups ? tabs[0]?.group : void 0;
  if (variant === "underline") {
    const renderTabButton = (tab, i) => {
      const isActive = activeId === tab.id;
      const bg = tab.selectedBackground ?? selectedBackground;
      const fg = tab.selectedForeground ?? selectedForeground;
      const hasCustomColors2 = bg || fg;
      const hasInactiveColors = inactiveBackground || inactiveForeground;
      const customStyle = isActive ? hasCustomColors2 ? { backgroundColor: bg, color: fg } : void 0 : hasInactiveColors ? { backgroundColor: inactiveBackground, color: inactiveForeground } : void 0;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: (e) => {
            e.stopPropagation();
            handleTabClick(tab.id);
          },
          style: customStyle,
          className: `flex-1 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold py-3 sm:py-4 px-2 sm:px-4 md:px-5 truncate whitespace-nowrap overflow-hidden transition-all duration-200 ${!hasGroups && rounded ? "md:first:rounded-tl-btn md:last:rounded-tr-btn" : ""} ${isActive ? hasCustomColors2 ? "" : "text-theme-700 bg-white" : hasInactiveColors ? "hover:brightness-110" : "text-gray-300 bg-gray-50 hover:text-gray-400 hover:bg-gray-100"}`,
          children: [
            tab.icon && /* @__PURE__ */ jsx(icon_default, { name: tab.icon, size: 16, className: `flex-shrink-0 ${isActive ? hasCustomColors2 ? "" : "text-theme-500" : hasInactiveColors ? "" : "text-gray-300"}`, style: isActive ? fg ? { color: fg } : void 0 : inactiveForeground ? { color: inactiveForeground } : void 0 }),
            /* @__PURE__ */ jsx("span", { className: "truncate", children: tab.shortLabel ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: tab.shortLabel }),
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: tab.label })
            ] }) : tab.label })
          ]
        },
        tab.id
      );
    };
    const renderTabBar = () => {
      if (!hasGroups) {
        return /* @__PURE__ */ jsx("div", { className: "flex flex-shrink-0", children: tabs.map(renderTabButton) });
      }
      const groups = [];
      let currentGroup = [];
      let currentGroupName = tabs[0]?.group;
      for (const tab of tabs) {
        if (tab.group !== currentGroupName) {
          groups.push(currentGroup);
          currentGroup = [];
          currentGroupName = tab.group;
        }
        currentGroup.push(tab);
      }
      if (currentGroup.length) groups.push(currentGroup);
      return /* @__PURE__ */ jsx("div", { className: "flex flex-shrink-0 gap-6", children: groups.map((group, gi) => /* @__PURE__ */ jsx("div", { className: `flex ${rounded && gi === 0 ? "md:first:rounded-tl-btn" : ""} ${rounded && gi === groups.length - 1 ? "md:last:rounded-tr-btn" : ""}`, style: { flex: group.length }, children: group.map((tab, ti) => renderTabButton(tab)) }, gi)) });
    };
    return /* @__PURE__ */ jsxs("div", { className, children: [
      renderTabBar(),
      /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 flex flex-col", children: children ?? activeContent })
    ] });
  }
  const hasCustomColors = selectedBackground || selectedForeground;
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsx("div", { className: "flex gap-2 p-2 bg-gray-100 rounded-xl", children: tabs.map((tab, i) => {
      const isActive = activeId === tab.id;
      const customStyle = isActive && hasCustomColors ? {
        backgroundColor: selectedBackground,
        color: selectedForeground
      } : void 0;
      const isNewGroup = hasGroups && i > 0 && tab.group !== tabs[i - 1].group;
      const groupStyle = hasGroups ? { ...customStyle, flex: "0 1 300px" } : customStyle;
      return /* @__PURE__ */ jsxs(Fragment$1, { children: [
        isNewGroup && /* @__PURE__ */ jsx("div", { className: "w-px bg-gray-300 mx-2 my-2 flex-shrink-0" }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              handleTabClick(tab.id);
            },
            style: groupStyle,
            className: `${hasGroups ? "flex-1" : "flex-1"} flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base font-medium py-2.5 sm:py-3 px-2 sm:px-4 md:px-5 rounded-btn transition-all duration-200 ${isActive ? hasCustomColors ? "shadow-sm" : "bg-white text-theme-700 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`,
            children: [
              tab.icon && /* @__PURE__ */ jsx(icon_default, { name: tab.icon, size: 16, className: `flex-shrink-0 ${isActive ? hasCustomColors ? "" : "text-theme-500" : ""}`, style: isActive && selectedForeground ? { color: selectedForeground } : void 0 }),
              /* @__PURE__ */ jsx("span", { className: "truncate", children: tab.shortLabel ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: tab.shortLabel }),
                /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: tab.label })
              ] }) : tab.label })
            ]
          }
        )
      ] }, tab.id);
    }) }),
    /* @__PURE__ */ jsx("div", { children: children ?? activeContent })
  ] });
};
var tabs_default = Tabs;
var Panel = ({ open, onToggle, width = 280, icon, title, subtitle, children }) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative h-full bg-gray-50 border-l border-gray-200 flex flex-shrink-0",
      style: {
        width: open ? width : 20,
        transition: "width 400ms cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "data-sidebar-toggle": true,
            onClick: (e) => {
              e.stopPropagation();
              onToggle(!open);
            },
            className: "group w-5 h-full flex-shrink-0 flex items-center justify-center cursor-pointer hover:bg-gray-100/50 transition-all",
            title: open ? "Ocultar panel" : "Mostrar panel",
            children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 opacity-40 group-hover:opacity-70 transition-opacity", children: [
              /* @__PURE__ */ jsx("div", { className: "w-1 h-1 rounded-full bg-gray-500" }),
              /* @__PURE__ */ jsx("div", { className: "w-1 h-1 rounded-full bg-gray-500" }),
              /* @__PURE__ */ jsx("div", { className: "w-1 h-1 rounded-full bg-gray-500" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-full flex flex-col overflow-hidden",
            style: {
              width: width - 20,
              minWidth: width - 20,
              opacity: open ? 1 : 0,
              transition: "opacity 400ms ease-in-out",
              pointerEvents: open ? "auto" : "none"
            },
            children: /* @__PURE__ */ jsxs("div", { className: "p-4 h-full overflow-y-auto", children: [
              icon && /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden", children: typeof icon === "string" ? /* @__PURE__ */ jsx(icon_default, { name: icon, size: 48, className: "text-theme-500" }) : icon }) }),
              title && /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-900 text-center mb-1 break-words", children: title }),
              subtitle && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 text-center mb-4 break-words", children: subtitle }),
              children
            ] })
          }
        )
      ]
    }
  );
};
var panel_default = Panel;
var CollapsiblePanel = ({
  title,
  icon,
  iconColor = "text-gray-500",
  defaultOpen = true,
  maxHeight,
  children
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-b from-white to-gray-50 rounded-xl border border-gray-200 overflow-hidden mb-3", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((o) => !o),
        className: "w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer",
        children: [
          /* @__PURE__ */ jsxs("h4", { className: "text-xs font-semibold text-gray-700 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(icon_default, { name: icon, size: 12, className: iconColor }),
            title
          ] }),
          /* @__PURE__ */ jsx(icon_default, { name: open ? "ChevronUp" : "ChevronDown", size: 14, className: "text-gray-400" })
        ]
      }
    ),
    open && /* @__PURE__ */ jsx("div", { className: "p-3 overflow-y-auto", style: maxHeight ? { maxHeight } : void 0, children })
  ] });
};
var DataRow = ({ label, value }) => {
  const displayValue = value ?? "\u2014";
  const titleValue = typeof value === "string" ? value : void 0;
  return /* @__PURE__ */ jsxs("div", { className: "py-1.5 border-b border-gray-100 last:border-0", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 capitalize", children: label.replace(/_/g, " ") }),
    /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-900 truncate", title: titleValue, children: displayValue || /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "\u2014" }) })
  ] });
};
var TablePanel = ({
  title,
  icon,
  iconColor = "text-gray-500",
  defaultOpen = false,
  maxHeight = 200,
  data,
  emptyContent
}) => /* @__PURE__ */ jsx(
  CollapsiblePanel,
  {
    title,
    icon,
    iconColor,
    defaultOpen,
    maxHeight,
    children: data.length > 0 ? data.map((row, i) => /* @__PURE__ */ jsx(DataRow, { label: row.label, value: row.value }, i)) : emptyContent || /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: "Sin datos" })
  }
);
var tablepanel_default = TablePanel;
var Scroll = ({ children, className = "", grid = false }) => {
  const layout = grid ? "grid gap-[3%] p-[3%] lg:grid-cols-12" : "";
  return /* @__PURE__ */ jsx("div", { className: `flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col ${layout} ${className}`, children });
};
var scroll_default = Scroll;
var Container = ({ title, icon, tbar, children, page, setPage, hasNext }) => {
  const hasPagination = page !== void 0 && setPage && hasNext !== void 0;
  const FirstRow = ({ title: title2, icon: icon2 }) => {
    return /* @__PURE__ */ jsxs("div", { className: "group/header flex items-center gap-4 sm:gap-8", children: [
      /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-3 whitespace-nowrap text-theme-100", children: [
        icon2 && /* @__PURE__ */ jsx(icon_default, { name: icon2, className: "hidden sm:inline-block size-[20px] md:size-[22px] lg:size-[24px] text-theme-100 icon-shadow-md" }),
        /* @__PURE__ */ jsx("span", { className: "text-xl md:text-2xl font-bold uppercase tracking-wide text-theme-100 text-shadow-md", children: title2 })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "flex flex-1 items-center", children: tbar }),
      hasPagination && /* @__PURE__ */ jsx(paginator_default, { page, setPage, hasNext, visible: true, compact: true })
    ] });
  };
  const horizontalr = "gap-2 sm:gap-4 px-4 sm:px-5 md:px-6";
  const verticalr = "py-2 short:py-3 mid:py-3 tall:py-4 xtall:py-5";
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full shadow-2xl lg:rounded-xl overflow-hidden", children: [
    /* @__PURE__ */ jsx("header", { className: `flex flex-col text-lg sm:text-xl ${horizontalr} ${verticalr} flex-shrink-0 bg-gradient-to-r from-theme-700 to-theme-600`, children: /* @__PURE__ */ jsx(FirstRow, { title, icon }) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 flex flex-col bg-white", children })
  ] });
};
var container_default = Container;
var sizeConfig2 = {
  xs: { spinner: 20, stroke: 2, text: "text-xs" },
  sm: { spinner: 28, stroke: 2.5, text: "text-sm" },
  md: { spinner: 36, stroke: 3, text: "text-base" },
  lg: { spinner: 48, stroke: 3.5, text: "text-lg" }
};
function Spinner({ size = "sm", message }) {
  const id = useId().replace(/:/g, "");
  const cfg2 = sizeConfig2[size];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes loading-spin-${id} {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes loading-dash-${id} {
          0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
          100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
        }
        .loading-spinner-${id} {
          animation: loading-spin-${id} 1.5s linear infinite;
        }
        .loading-dash-${id} {
          animation: loading-dash-${id} 1.5s ease-in-out infinite;
        }
      ` }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxs(
        "svg",
        {
          className: `loading-spinner-${id} drop-shadow-sm`,
          viewBox: "0 0 50 50",
          style: { width: cfg2.spinner, height: cfg2.spinner },
          children: [
            /* @__PURE__ */ jsx(
              "circle",
              {
                cx: "25",
                cy: "25",
                r: "20",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: cfg2.stroke,
                className: "text-theme-100"
              }
            ),
            /* @__PURE__ */ jsx(
              "circle",
              {
                cx: "25",
                cy: "25",
                r: "20",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: cfg2.stroke,
                strokeLinecap: "round",
                className: `text-theme-500 loading-dash-${id}`
              }
            )
          ]
        }
      ),
      message && /* @__PURE__ */ jsx("span", { className: `${cfg2.text} text-theme-600 font-medium`, children: message })
    ] })
  ] });
}
var cfg = { svg: 120, text: "text-lg", minH: 200, barW: 140 };
function AnimAI({ message = "Analizando con IA" }) {
  const id = useId().replace(/:/g, "");
  const [phase, setPhase] = useState("upload");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("ai"), 2e3);
    return () => clearTimeout(t1);
  }, []);
  const phaseLabel = phase === "upload" ? "Subiendo archivo" : message;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes animai-arrow-${id} {
          0%, 100% { transform: translateY(6px); opacity: 0.4; }
          50% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes animai-orbit-${id} {
          0% { transform: rotate(0deg) translateX(18px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(18px) rotate(-360deg); }
        }
        @keyframes animai-pop-${id} {
          0% { transform: scale(0); opacity: 0; }
          20% { transform: scale(1.3); opacity: 0.8; }
          40% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(0.6); opacity: 0; }
        }
        .animai-arrow-${id} {
          animation: animai-arrow-${id} 1.4s ease-in-out infinite;
        }
        .animai-orbit-${id}-1 {
          animation: animai-orbit-${id} 3s linear infinite;
          transform-origin: 68px 16px;
        }
        .animai-orbit-${id}-2 {
          animation: animai-orbit-${id} 3s linear -1s infinite;
          transform-origin: 68px 16px;
        }
        .animai-orbit-${id}-3 {
          animation: animai-orbit-${id} 3s linear -2s infinite;
          transform-origin: 68px 16px;
        }
        .animai-pop-${id}-1 {
          animation: animai-pop-${id} 2s ease-out 0s infinite;
        }
        .animai-pop-${id}-2 {
          animation: animai-pop-${id} 2s ease-out 0.7s infinite;
        }
        .animai-pop-${id}-3 {
          animation: animai-pop-${id} 2s ease-out 1.4s infinite;
        }
      ` }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white/60 backdrop-blur-sm grid place-items-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-0", style: { minHeight: cfg.minH }, children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-center", style: { minHeight: cfg.minH - 24 }, children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "absolute flex flex-col items-center justify-center gap-3 transition-opacity duration-500",
            style: { opacity: phase === "upload" ? 1 : 0, visibility: phase === "upload" ? "visible" : "hidden" },
            children: [
              /* @__PURE__ */ jsxs(
                "svg",
                {
                  width: cfg.svg,
                  height: Math.round(cfg.svg * 0.83),
                  viewBox: "0 0 120 100",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "opacity-50",
                  children: [
                    /* @__PURE__ */ jsx("path", { d: "M20 35 L60 15 L100 35 L60 55 Z", className: "fill-theme-200 stroke-theme-400", strokeWidth: "1.5" }),
                    /* @__PURE__ */ jsx("path", { d: "M20 35 L20 65 L60 85 L60 55 Z", className: "fill-theme-100 stroke-theme-400", strokeWidth: "1.5" }),
                    /* @__PURE__ */ jsx("path", { d: "M100 35 L100 65 L60 85 L60 55 Z", className: "fill-theme-50 stroke-theme-400", strokeWidth: "1.5" }),
                    /* @__PURE__ */ jsx("g", { className: `animai-arrow-${id}`, children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M60 30 L60 4 M52 12 L60 4 L68 12",
                        className: "stroke-theme-500",
                        strokeWidth: "2.5",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                      }
                    ) })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("p", { className: `font-medium text-gray-500 whitespace-nowrap ${cfg.text}`, children: phaseLabel })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "absolute flex flex-col items-center justify-center gap-3 transition-opacity duration-500",
            style: { opacity: phase === "ai" ? 1 : 0, visibility: phase === "ai" ? "visible" : "hidden" },
            children: [
              /* @__PURE__ */ jsxs(
                "svg",
                {
                  width: cfg.svg,
                  height: Math.round(cfg.svg * 0.83),
                  viewBox: "0 0 120 100",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "opacity-50",
                  children: [
                    /* @__PURE__ */ jsx("path", { d: "M20 35 L60 15 L100 35 L60 55 Z", className: "fill-theme-200 stroke-theme-400", strokeWidth: "1.5" }),
                    /* @__PURE__ */ jsx("path", { d: "M20 35 L20 65 L60 85 L60 55 Z", className: "fill-theme-100 stroke-theme-400", strokeWidth: "1.5" }),
                    /* @__PURE__ */ jsx("path", { d: "M100 35 L100 65 L60 85 L60 55 Z", className: "fill-theme-50 stroke-theme-400", strokeWidth: "1.5" }),
                    /* @__PURE__ */ jsx("circle", { cx: "68", cy: "16", r: "13", className: "stroke-theme-500", strokeWidth: "2", fill: "none" }),
                    /* @__PURE__ */ jsx("line", { x1: "78", y1: "25", x2: "88", y2: "35", className: "stroke-theme-500", strokeWidth: "3", strokeLinecap: "round" }),
                    /* @__PURE__ */ jsx("circle", { className: `fill-theme-400 animai-orbit-${id}-1`, r: "2.5", cx: "68", cy: "16" }),
                    /* @__PURE__ */ jsx("circle", { className: `fill-theme-300 animai-orbit-${id}-2`, r: "2", cx: "68", cy: "16" }),
                    /* @__PURE__ */ jsx("circle", { className: `fill-theme-400 animai-orbit-${id}-3`, r: "1.5", cx: "68", cy: "16" }),
                    /* @__PURE__ */ jsx("circle", { cx: "50", cy: "8", r: "3", className: `fill-theme-300 animai-pop-${id}-1` }),
                    /* @__PURE__ */ jsx("circle", { cx: "68", cy: "2", r: "2.5", className: `fill-theme-300 animai-pop-${id}-2` }),
                    /* @__PURE__ */ jsx("circle", { cx: "42", cy: "3", r: "2", className: `fill-theme-300 animai-pop-${id}-3` })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("p", { className: `font-medium text-gray-500 whitespace-nowrap ${cfg.text}`, children: phaseLabel })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "rounded-full bg-theme-100 overflow-hidden",
          style: { width: cfg.barW, height: 4 },
          children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "h-full rounded-full bg-theme-400 transition-all ease-out",
              style: {
                width: phase === "upload" ? "30%" : "85%",
                transitionDuration: phase === "upload" ? "1.5s" : "8s"
              }
            }
          )
        }
      )
    ] }) })
  ] });
}
var sizeConfig3 = {
  xs: { svg: 60, text: "text-xs" },
  sm: { svg: 80, text: "text-sm" },
  md: { svg: 100, text: "text-base" },
  lg: { svg: 120, text: "text-lg" },
  xl: { svg: 140, text: "text-xl" }
};
function DragHere2({ size = "lg" }) {
  const isMobile = useIsMobile();
  const cfg2 = sizeConfig3[size];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes drag-arrow-bounce {
          0%, 100% { transform: translateY(-8px); }
          50% { transform: translateY(6px); }
        }
        .drag-arrow-bounce {
          animation: drag-arrow-bounce 1.2s ease-in-out infinite;
        }
      ` }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white/60 backdrop-blur-sm pointer-events-none grid place-items-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxs(
        "svg",
        {
          width: cfg2.svg,
          height: Math.round(cfg2.svg * 0.83),
          viewBox: "0 0 120 100",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          className: "opacity-50",
          children: [
            /* @__PURE__ */ jsx("path", { d: "M20 35 L60 15 L100 35 L60 55 Z", className: "fill-theme-200 stroke-theme-400", strokeWidth: "1.5" }),
            /* @__PURE__ */ jsx("path", { d: "M20 35 L20 65 L60 85 L60 55 Z", className: "fill-theme-100 stroke-theme-400", strokeWidth: "1.5" }),
            /* @__PURE__ */ jsx("path", { d: "M100 35 L100 65 L60 85 L60 55 Z", className: "fill-theme-50 stroke-theme-400", strokeWidth: "1.5" }),
            /* @__PURE__ */ jsx("g", { className: "drag-arrow-bounce", children: /* @__PURE__ */ jsx(
              "path",
              {
                d: "M60 0 L60 22 M52 14 L60 22 L68 14",
                className: "stroke-theme-500",
                strokeWidth: "2.5",
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            ) })
          ]
        }
      ),
      /* @__PURE__ */ jsx("p", { className: `${cfg2.text} font-medium text-gray-500`, children: isMobile ? "Toca para subir documentos" : "Arrastre aqu\xED" })
    ] }) })
  ] });
}
var PillTag = ({ children, onRemove, grip }) => /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-white border border-gray-200 text-gray-700", children: [
  grip && /* @__PURE__ */ jsx(icon_default, { name: "GripVertical", size: 12, className: "text-gray-400" }),
  /* @__PURE__ */ jsx("span", { className: "truncate", children }),
  onRemove && /* @__PURE__ */ jsx("button", { onClick: onRemove, className: "hover:text-red-500 transition-all", children: /* @__PURE__ */ jsx(icon_default, { name: "X", size: 12 }) })
] });
var pilltag_default = PillTag;

export { section_default as Accordion, anchor_default as Anchor, AnimAI, button_default as Button, buttongroup_default as ButtonGroup, card_default as Card, CardList, checkbox_default as Checkbox, colorpicker_default as ColorPicker, confirm_default as Confirm, container_default as Container, contextmenu_default as ContextMenu, DetailBar, DetailContent, dragherehint_default as DragHereHint, DragHere2 as DragHereOverlay, editabletitle_default as EditableTitle, emaillink_default as EmailLink, emptystate_default as EmptyState, FieldWrapper, icon_default as Icon, input_default as Input, label_default as Label, MasterDetail, modal_default as Modal, paginator_default as Paginator, panel_default as Panel, pilltag_default as PillTag, progressring_default as ProgressRing, prompt_default as Prompt, radio_default as Radio, scroll_default as Scroll, sectionicon_default as SectionIcon, select_default as Select, SidebarControls, SidebarFilter, SidebarPaginator, SidebarSort, skeleton_default as Skeleton, Spinner, StatCard, tablepanel_default as TablePanel, tabs_default as Tabs, toast_default as Toast, ToastContainer, ToastProvider, toolback_default as ToolBack, toolbarbutton_default as ToolbarButton, tooltip_default as Tooltip, useIsDesktop, useIsMobile, useToast };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map