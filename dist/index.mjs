import { createContext, useState, useEffect, useContext, useCallback, useMemo, useRef, useLayoutEffect, useId, createElement } from 'react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { icons, CircleHelp } from 'lucide-react';
import { createPortal } from 'react-dom';

// src/hooks.tsx
var useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    setIsMobile(mql.matches);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return isMobile;
};
var useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mql.matches);
    const handler = (e) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return isDesktop;
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
function createDialogContext(Dialog, name, normalizeInput) {
  const Context = createContext(void 0);
  const Provider = ({ children }) => {
    const [state, setState] = useState(null);
    const trigger = useCallback((input) => {
      const opts = normalizeInput && typeof input === "string" ? normalizeInput(input) : input;
      return new Promise((resolve) => {
        setState({ ...opts, resolve });
      });
    }, []);
    const handleDone = useCallback(() => setState(null), []);
    const value = useMemo(() => ({ trigger }), [trigger]);
    return createElement(
      Context.Provider,
      { value },
      children,
      state && createElement(Dialog, { state, onDone: handleDone })
    );
  };
  const useHook = () => {
    const context = useContext(Context);
    if (!context) throw new Error(`${name} must be used within its Provider`);
    return context.trigger;
  };
  return [Provider, useHook];
}
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
var Button = ({ icon, text, loading = false, className = "", ...props }) => {
  const isDisabled = props.disabled || loading;
  const disabledText = isDisabled ? "opacity-40" : "";
  return /* @__PURE__ */ jsxs(
    "button",
    {
      className: `flex items-center justify-center h-10 px-5 text-sm gap-2 bg-theme-700 hover:bg-theme-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm rounded-btn active:scale-[0.98] ${isDisabled ? "cursor-not-allowed" : ""} ${className}`,
      ...props,
      disabled: isDisabled,
      children: [
        loading ? /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-4 w-4 text-current", viewBox: "0 0 24 24", fill: "none", children: [
          /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "3" }),
          /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
        ] }) : icon && /* @__PURE__ */ jsx(icon_default, { name: icon, size: 16, className: `text-shadow-sm ${disabledText}` }),
        text && /* @__PURE__ */ jsx("span", { className: `text-shadow-sm truncate font-semibold uppercase tracking-wide ${disabledText}`, children: text })
      ]
    }
  );
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
        /* @__PURE__ */ jsx("span", { className: `flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all duration-200 ${checked ? "bg-brand border-brand" : "bg-surface-0 border-edge-subtle/30 group-hover:border-brand/60"}`, children: checked && /* @__PURE__ */ jsx(icon_default, { name: "Check", size: 14, className: "text-brand-contrast", strokeWidth: 3 }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-ink-secondary group-hover:text-ink-primary transition-colors", children: label })
      ]
    }
  );
};
var checkbox_default = Checkbox;
var useClickOutside = (refs, onClose) => {
  const callbackRef = useRef(onClose);
  callbackRef.current = onClose;
  useEffect(() => {
    const refList = Array.isArray(refs) ? refs : [refs];
    const onDown = (e) => {
      const target = e.target;
      if (refList.some((r) => r.current?.contains(target))) return;
      callbackRef.current();
    };
    document.addEventListener("mousedown", onDown, true);
    return () => document.removeEventListener("mousedown", onDown, true);
  }, []);
};
var Tooltip = ({ text }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const btnRef = useRef(null);
  const tooltipRef = useRef(null);
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
  useClickOutside([ref, tooltipRef], () => setOpen(false));
  return /* @__PURE__ */ jsxs("span", { ref, className: "relative inline-block left-1", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        ref: btnRef,
        onClick: (e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        },
        children: /* @__PURE__ */ jsx(icon_default, { name: "CircleQuestionMark", className: "size-4 opacity-60 hover:opacity-100 transition-opacity" })
      }
    ),
    open && typeof document !== "undefined" && createPortal(
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: tooltipRef,
          className: `
                        fixed z-[9999] p-3 rounded-xl shadow-md text-sm max-w-xs break-words
                        bg-surface-0 text-ink-secondary border border-edge-subtle/20 backdrop-blur-md
                        transition-opacity duration-500 ease-out
                        ${visible ? "opacity-100" : "opacity-0"}
                    `,
          style: { top: pos.top, left: pos.left },
          children: text
        }
      ),
      document.body
    )
  ] });
};
var tooltip_default = Tooltip;
var Label = ({ text, tooltip, className = "" }) => /* @__PURE__ */ jsxs("div", { className: `flex items-center text-ink-tertiary text-sm ${className}`, children: [
  /* @__PURE__ */ jsx("span", { children: text }),
  tooltip && /* @__PURE__ */ jsx(tooltip_default, { text: tooltip })
] });
var label_default = Label;
function FieldWrapper({ label, tooltip, className = "", visible = true, children }) {
  if (!visible) return null;
  return /* @__PURE__ */ jsxs("div", { className: `mb-2 ${className}`, children: [
    label && /* @__PURE__ */ jsx(label_default, { text: label, tooltip }),
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
  useClickOutside(pickerRef, () => setShowPicker(false));
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
          className: "w-12 h-12 rounded-xl border-2 border-edge-subtle/30 cursor-pointer transition-all hover:border-edge-subtle/60 shadow-md",
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
          className: "border border-edge-subtle/20 rounded-xl w-28 text-ink-primary bg-surface-0 text-base px-4 py-3 font-mono uppercase focus:ring-2 focus:ring-brand/30 focus:border-brand/60 outline-none",
          placeholder: "#000000"
        }
      )
    ] }),
    showPicker && /* @__PURE__ */ jsx("div", { className: "absolute top-full left-0 mt-2 p-3 bg-surface-1 rounded-xl shadow-lg border border-edge-subtle/20 z-50", children: /* @__PURE__ */ jsx(
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
var Input = ({ label, tooltip, className = "", readOnly, onChange, value = "", visible = true, ...rest }) => {
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
      className: `border border-edge-subtle/20 rounded-xl w-full placeholder:text-ink-tertiary/25 ${readOnly ? "text-ink-tertiary cursor-not-allowed bg-surface-1" : "text-ink-primary bg-surface-0 focus:ring-2 focus:ring-brand/30 focus:border-brand/60 outline-none"} text-base px-4 py-3 transition-all duration-300`
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
        className: "mr-2 w-4 h-4 accent-brand"
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "text-ink-secondary", children: label })
  ] });
};
var radio_default = Radio;
var Select = ({ label, value, placeholder, options, className = "", onChange }) => {
  useEffect(() => {
    if (options.length === 1 && value !== options[0].value) {
      onChange(options[0].value);
    }
  }, [options, value, onChange]);
  return /* @__PURE__ */ jsx(FieldWrapper, { label, className, children: /* @__PURE__ */ jsxs(
    "select",
    {
      value: value || "",
      onChange: (e) => onChange(e.target.value),
      className: `border border-edge-subtle/20 rounded-xl w-full text-base px-4 py-3 appearance-none ${value ? "text-ink-primary" : "text-ink-tertiary"} bg-surface-0 focus:ring-2 focus:ring-brand/30 focus:border-brand/60 outline-none transition-all duration-300 cursor-pointer`,
      style: {
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
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
var ComputedField = ({ label, value, suffix, className = "" }) => {
  return /* @__PURE__ */ jsxs("div", { className, children: [
    label && /* @__PURE__ */ jsx(label_default, { text: label, className: "mb-1" }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("div", { className: "border border-dashed border-edge-subtle/30 rounded-xl w-full text-sm px-3 py-2 tabular-nums bg-surface-0 text-ink-primary font-medium cursor-default select-none", children: value }),
      suffix && /* @__PURE__ */ jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-tertiary pointer-events-none", children: suffix })
    ] })
  ] });
};
var computedfield_default = ComputedField;

// src/forms/inputstyles.ts
var inputBase = "border border-edge-subtle/20 rounded-xl w-full text-sm px-3 py-2 text-ink-primary placeholder:text-ink-tertiary/25";
var inputEditable = "bg-surface-0 focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-all duration-200 outline-none";
var inputReadOnly = "bg-surface-1 border-edge-subtle/15 cursor-default text-ink-tertiary";
var disabledEffect = "opacity-40";
var NumberField = ({ label, value, onChange, suffix, step = "any", readOnly }) => {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(label_default, { text: label, className: "mb-1" }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "number",
          step,
          value: value ?? "",
          readOnly,
          tabIndex: readOnly ? -1 : void 0,
          onChange: readOnly ? void 0 : (e) => {
            const raw = e.target.value;
            onChange?.(raw === "" ? void 0 : Number(raw));
          },
          className: `${inputBase} tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${readOnly ? inputReadOnly : inputEditable}`
        }
      ),
      suffix && /* @__PURE__ */ jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-tertiary pointer-events-none", children: suffix })
    ] })
  ] });
};
var numberfield_default = NumberField;
var TextField = ({ label, value, onChange, readOnly, placeholder, fullWidth, icon, onIconClick }) => {
  const hasIcon = !!icon;
  const isInteractive = hasIcon && !!onIconClick;
  return /* @__PURE__ */ jsxs("div", { className: fullWidth ? "col-span-2" : "", children: [
    /* @__PURE__ */ jsx(label_default, { text: label, className: "mb-1" }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: value ?? "",
          readOnly,
          tabIndex: readOnly ? -1 : void 0,
          placeholder: readOnly ? void 0 : placeholder,
          onChange: readOnly ? void 0 : (e) => onChange?.(e.target.value || void 0),
          className: `${inputBase} ${hasIcon ? "pr-8" : ""} ${readOnly ? inputReadOnly : inputEditable}`
        }
      ),
      hasIcon && isInteractive && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onIconClick,
          tabIndex: -1,
          type: "button",
          className: "absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-surface-2 transition-colors",
          children: /* @__PURE__ */ jsx(icon_default, { name: icon, size: 14, className: "text-ink-tertiary hover:text-ink-secondary" })
        }
      ),
      hasIcon && !isInteractive && /* @__PURE__ */ jsx("span", { className: "absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none", children: /* @__PURE__ */ jsx(icon_default, { name: icon, size: 14, className: "text-ink-tertiary/60" }) })
    ] })
  ] });
};
var textfield_default = TextField;
var SelectField = ({ label, value, options, onChange, readOnly }) => {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(label_default, { text: label, className: "mb-1" }),
    /* @__PURE__ */ jsxs(
      "select",
      {
        value: value ?? "",
        disabled: readOnly,
        onChange: readOnly ? void 0 : (e) => onChange?.(e.target.value || void 0),
        className: `${inputBase} ${readOnly ? inputReadOnly : inputEditable}`,
        children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "\u2014" }),
          options.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, children: o.label }, o.value))
        ]
      }
    )
  ] });
};
var selectfield_default = SelectField;
var SIZE_CONFIG = {
  xl: { w: 1200, h: 900, maxW: 95, maxH: 90 },
  lg: { w: 960, h: 800, maxW: 92, maxH: 88 },
  md: { w: 720, h: 720, maxW: 90, maxH: 85 },
  sm: { w: 560, h: 600, maxW: 88, maxH: 82 },
  xs: { w: 400, h: 500, maxW: 85, maxH: 80 }
};
var Modal = ({ title, icon, children, onClose, size: sizeProp = "md", headerActions }) => {
  const mobile = useIsMobile();
  const sizeConfig3 = SIZE_CONFIG[sizeProp];
  const effectiveSize = useMemo(() => {
    if (mobile || typeof window === "undefined") return null;
    const maxW = Math.floor(window.innerWidth * sizeConfig3.maxW / 100);
    const maxH = Math.floor(window.innerHeight * sizeConfig3.maxH / 100);
    return {
      w: Math.min(sizeConfig3.w, maxW),
      h: Math.min(sizeConfig3.h, maxH)
    };
  }, [mobile, sizeConfig3]);
  return /* @__PURE__ */ jsx("div", { className: "fixed z-[9999] inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: `relative flex flex-col overflow-hidden shadow-2xl bg-surface-0 border border-edge-subtle/30 ${mobile ? "w-full h-full rounded-none" : "rounded-xl"}`,
      style: mobile ? {} : {
        width: `${effectiveSize.w}px`,
        height: `${effectiveSize.h}px`
      },
      onClick: (ev) => ev.stopPropagation(),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-ink-primary text-sm px-3 py-2 select-none border-b border-edge-subtle/15", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(icon_default, { name: icon ?? "AppWindow", size: 16, className: "me-2 opacity-70" }),
            /* @__PURE__ */ jsx("span", { className: "opacity-90", children: title ?? " " })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 select-none", children: [
            headerActions,
            /* @__PURE__ */ jsx("div", { className: "cursor-pointer hover:bg-white/10 p-1.5 rounded", onClick: onClose, title: "Cerrar Ventana", children: /* @__PURE__ */ jsx(icon_default, { name: "X", size: 16, className: "text-ink-secondary" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-hidden bg-surface-1", children })
      ]
    }
  ) });
};
var modal_default = Modal;
var ModalOverlayPanel = ({ open, width = "w-72", className = "", children }) => {
  if (!open) return null;
  return /* @__PURE__ */ jsx("div", { className: `absolute right-0 top-0 bottom-0 ${width} bg-surface-3 border-l border-edge-subtle/20 shadow-lg overflow-y-auto z-20 px-3 pt-14 pb-3 ${className}`, children });
};
var modaloverlaypanel_default = ModalOverlayPanel;
var base = "absolute z-20 flex items-center gap-0.5 px-1 py-1 rounded-xl transition-all";
var ModalToolbar = ({ position = "left", offset, variant = "transparent", className = "", children }) => {
  const pos = position === "left" ? "left-3" : "right-3";
  const top = offset || "top-3";
  const bg = variant === "dark" ? "bg-[#3d3d3d]" : "bg-black/50 backdrop-blur-sm";
  return /* @__PURE__ */ jsx("div", { className: `${base} ${pos} ${top} ${bg} ${className}`, children });
};
var Group = ({ children, className = "" }) => /* @__PURE__ */ jsx("div", { className: `flex items-center gap-0.5 ${className}`, children });
var Divider = () => /* @__PURE__ */ jsx("div", { className: "w-px h-4 bg-white/20 mx-0.5" });
ModalToolbar.Group = Group;
ModalToolbar.Divider = Divider;
var modaltoolbar_default = ModalToolbar;
var ModalFormLayout = ({ footer, className = "", children }) => /* @__PURE__ */ jsxs("div", { className: `flex flex-col h-full ${className}`, children: [
  /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 overflow-y-auto", children }),
  /* @__PURE__ */ jsx("div", { className: "shrink-0", children: footer })
] });
var modalformlayout_default = ModalFormLayout;
function SectionSeparator({ label, first, className = "" }) {
  return /* @__PURE__ */ jsxs("div", { className: `basis-full flex items-center gap-3 ${first ? "" : "mt-4"} ${className}`, children: [
    /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-ink-tertiary uppercase tracking-wide", children: label }),
    /* @__PURE__ */ jsx("span", { className: "flex-1 border-b border-edge-subtle/15" })
  ] });
}

// src/common/colclass.ts
var colSpanMap = {
  12: "sm:col-span-12 md:col-span-12 lg:col-span-12",
  8: "sm:col-span-12 md:col-span-8 lg:col-span-8",
  6: "sm:col-span-12 md:col-span-6 lg:col-span-6",
  4: "sm:col-span-6 md:col-span-6 lg:col-span-4",
  3: "sm:col-span-6 md:col-span-4 lg:col-span-3"
};
var defaultCol = "sm:col-span-12 md:col-span-6 lg:col-span-6";
var colClass = (span) => colSpanMap[span] || defaultCol;
var Skeleton = ({ className = "", variant = "light" }) => {
  const shimmer = variant === "light" ? "animate-shimmer" : "animate-shimmer-dark";
  return /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded ${className}` });
};
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
    /* @__PURE__ */ jsx("div", { className: "animate-shimmer-dark rounded-xl w-28 h-28" }),
    /* @__PURE__ */ jsx("div", { className: "animate-shimmer-dark rounded h-3 w-20 mx-auto" })
  ] }) }, i)) });
};
Skeleton.DocGrid = function SkeletonDocGrid({ count = 6, variant = "light" }) {
  const isLight = variant === "light";
  const shimmer = isLight ? "animate-shimmer" : "animate-shimmer-dark";
  const card = isLight ? "border-gray-200 bg-white shadow-md" : "border-edge-subtle/15 bg-surface-1";
  return /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-8", children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "animate-fade-in", style: { animationDelay: `${i * 60}ms` }, children: /* @__PURE__ */ jsxs(
    "div",
    {
      style: { width: 200, height: 180 },
      className: `flex flex-col rounded-xl border ${card} p-3`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-2", children: [
          /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded-xl w-10 h-10` }),
          /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded-full w-14 h-4` })
        ] }),
        /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded h-3.5 w-4/5 mb-1.5` }),
        /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded h-2.5 w-3/5` }),
        /* @__PURE__ */ jsxs("div", { className: "mt-auto pt-2 flex gap-1 justify-center", children: [
          /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded w-10 h-4` }),
          /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded w-10 h-4` })
        ] })
      ]
    }
  ) }, i)) });
};
Skeleton.StatCard = function SkeletonStatCard() {
  return /* @__PURE__ */ jsx("div", { className: "bg-surface-1 border border-edge-subtle/15 rounded-2xl p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 space-y-2", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-shimmer-dark rounded h-3.5 w-24" }),
      /* @__PURE__ */ jsx("div", { className: "animate-shimmer-dark rounded h-8 w-16" }),
      /* @__PURE__ */ jsx("div", { className: "animate-shimmer-dark rounded h-2.5 w-20" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "animate-shimmer-dark rounded-xl w-12 h-12" })
  ] }) });
};
Skeleton.StatRow = function SkeletonStatRow({ className = "" }) {
  return /* @__PURE__ */ jsx("div", { className: `grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`, children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "animate-fade-in", style: { animationDelay: `${i * 80}ms` }, children: /* @__PURE__ */ jsx(Skeleton.StatCard, {}) }, i)) });
};
Skeleton.DashCard = function SkeletonDashCard({ colSpan = 6 }) {
  return /* @__PURE__ */ jsxs("div", { className: `flex flex-col h-96 bg-surface-1 border border-edge-subtle/15 rounded-2xl p-6 ${colClass(colSpan)}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0 mb-4 space-y-2", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-shimmer-dark rounded h-5 w-40" }),
      /* @__PURE__ */ jsx("div", { className: "animate-shimmer-dark rounded h-4 w-28" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-shimmer-dark rounded-xl w-3/4 h-3/4" }) })
  ] });
};
Skeleton.Form = function SkeletonForm({ rows = 4, variant = "light" }) {
  const shimmer = variant === "light" ? "animate-shimmer" : "animate-shimmer-dark";
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4 flex-1", children: Array.from({ length: rows }).map((_, i) => /* @__PURE__ */ jsxs("div", { className: "animate-fade-in space-y-1.5", style: { animationDelay: `${i * 80}ms` }, children: [
    /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded h-3.5 w-20` }),
    /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded-xl h-12 w-full` })
  ] }, i)) });
};
Skeleton.Activity = function SkeletonActivity({ variant = "light" }) {
  const isLight = variant === "light";
  const shimmer = isLight ? "animate-shimmer" : "animate-shimmer-dark";
  const card = isLight ? "bg-white border-gray-200" : "bg-surface-1 border-edge-subtle/15";
  const stat = isLight ? "bg-gray-50" : "bg-surface-2";
  const uploads = isLight ? "bg-white border-gray-200" : "bg-surface-1 border-edge-subtle/15";
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 flex-1 animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: `rounded-xl border ${card} p-4`, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
        /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded-full w-10 h-10 flex-shrink-0` }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded h-3.5 w-24` }),
          /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded h-2.5 w-16` })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded h-3.5 w-48` })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4", children: [0, 1].map((i) => /* @__PURE__ */ jsxs("div", { className: `animate-fade-in rounded-xl p-4 ${stat} text-center space-y-2`, style: { animationDelay: `${(i + 1) * 80}ms` }, children: [
      /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded h-8 w-12 mx-auto` }),
      /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded h-2.5 w-20 mx-auto` })
    ] }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: `rounded-xl border ${uploads} p-4`, children: [
      /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded h-3.5 w-32 mb-3` }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxs("div", { className: "animate-fade-in flex items-start gap-3", style: { animationDelay: `${(i + 3) * 80}ms` }, children: [
        /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded w-4 h-4 mt-0.5 flex-shrink-0` }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1.5", children: [
          /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded h-3.5 w-3/4` }),
          /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded h-2.5 w-1/2` })
        ] })
      ] }, i)) })
    ] })
  ] });
};
Skeleton.Preview = function SkeletonPreview({ variant = "light" }) {
  const shimmer = variant === "light" ? "animate-shimmer" : "animate-shimmer-dark";
  return /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center animate-fade-in", children: /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded-xl w-3/4 h-3/4` }) });
};
Skeleton.Table = function SkeletonTable({ rows = 5, variant = "light" }) {
  const isLight = variant === "light";
  const outer = isLight ? "border-gray-200" : "border-edge-subtle/20";
  const inner = isLight ? "border-gray-100" : "border-edge-subtle/10";
  const shimmer = isLight ? "animate-shimmer" : "animate-shimmer-dark";
  return /* @__PURE__ */ jsx("div", { className: `w-full rounded-xl border ${outer} overflow-hidden`, children: Array.from({ length: rows }).map((_, i) => /* @__PURE__ */ jsxs("div", { className: `animate-fade-in flex border-b ${inner} last:border-0`, style: { animationDelay: `${i * 60}ms` }, children: [
    /* @__PURE__ */ jsx("div", { className: "w-1/3 px-3 py-3", children: /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded h-3 w-16` }) }),
    /* @__PURE__ */ jsx("div", { className: "w-2/3 px-3 py-3", children: /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded h-3 w-32` }) })
  ] }, i)) });
};
Skeleton.Welcome = function SkeletonWelcome({ className = "" }) {
  return /* @__PURE__ */ jsx("div", { className: `bg-surface-2 rounded-2xl p-6 min-h-[80px] flex items-center ${className}`, children: /* @__PURE__ */ jsx("div", { className: "animate-shimmer-dark rounded h-6 w-48" }) });
};
Skeleton.DetailBar = function SkeletonDetailBar({
  variant = "dark",
  icon = true
}) {
  const shimmer = variant === "light" ? "animate-shimmer" : "animate-shimmer-dark";
  return /* @__PURE__ */ jsx("div", { className: "relative border-b border-edge-subtle/15 bg-surface-1", children: /* @__PURE__ */ jsx("div", { className: "relative z-10 flex items-center justify-between px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
    icon && /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded-xl w-9 h-9 flex-shrink-0` }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
      /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded h-4 w-40` }),
      /* @__PURE__ */ jsx("div", { className: `${shimmer} rounded h-3 w-24` })
    ] })
  ] }) }) });
};
var skeleton_default = Skeleton;
var EmptyState = ({ title = "Sin elementos", description, className = "", variant = "light", icon, action }) => {
  const isDark = variant === "dark";
  const renderIcon = () => {
    if (!icon) {
      return (
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
      );
    }
    if (typeof icon === "string") {
      return /* @__PURE__ */ jsx("div", { className: `mb-4 opacity-40 ${isDark ? "text-white/50" : "text-theme-400"}`, children: /* @__PURE__ */ jsx(icon_default, { name: icon, size: 48 }) });
    }
    return /* @__PURE__ */ jsx("div", { className: "mb-4", children: icon });
  };
  return /* @__PURE__ */ jsxs("div", { className: `flex flex-col items-center justify-center w-full h-full min-h-48 p-8 ${className}`, children: [
    renderIcon(),
    /* @__PURE__ */ jsx("p", { className: `font-medium text-sm ${isDark ? "text-white/50" : "text-gray-500"}`, children: title }),
    description && /* @__PURE__ */ jsx("p", { className: `text-xs mt-1 text-center max-w-xs ${isDark ? "text-white/40" : "text-gray-400"}`, children: description }),
    action && /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: action.onClick,
        disabled: action.loading,
        className: `mt-4 flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-btn transition-all duration-200 disabled:opacity-50 ${isDark ? "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white" : "bg-theme-50 text-theme-600 hover:bg-theme-100"}`,
        children: [
          action.icon && /* @__PURE__ */ jsx(icon_default, { name: action.loading ? "Loader" : action.icon, size: 14, className: action.loading ? "animate-spin" : "" }),
          action.label
        ]
      }
    )
  ] });
};
var emptystate_default = EmptyState;

// src/common/dialogvariants.ts
var variantConfig = {
  danger: {
    icon: "Trash2",
    iconBg: "bg-status-pending/10",
    iconColor: "text-status-pending",
    confirmBg: "bg-status-pending hover:bg-status-pending/80"
  },
  warning: {
    icon: "TriangleAlert",
    iconBg: "bg-status-warn/10",
    iconColor: "text-status-warn",
    confirmBg: "bg-status-warn hover:bg-status-warn/80"
  },
  info: {
    icon: "Info",
    iconBg: "bg-theme-50",
    iconColor: "text-theme-600",
    confirmBg: "bg-theme-700 hover:bg-theme-600"
  }
};
var useDialogAnim = (onResolve, onDone) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);
  const close = useCallback((result) => {
    setLeaving(true);
    setTimeout(() => {
      onResolve(result);
      onDone();
    }, 200);
  }, [onResolve, onDone]);
  return { visible, leaving, close };
};
var useTabTrap = (dialogRef, onEscape, selector = "input, button") => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onEscape();
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(selector);
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
  }, [dialogRef, onEscape, selector]);
};
var ConfirmDialog = ({ state, onDone }) => {
  const dialogRef = useRef(null);
  const { visible, leaving, close } = useDialogAnim(state.resolve, onDone);
  useTabTrap(dialogRef, () => close(false), "button");
  useEffect(() => {
    const onEnter = (e) => {
      if (e.key === "Enter") close(true);
    };
    window.addEventListener("keydown", onEnter);
    return () => window.removeEventListener("keydown", onEnter);
  }, [close]);
  useEffect(() => {
    if (visible && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [visible]);
  const cfg = variantConfig[state.variant || "danger"];
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
          bg-surface-1 border border-edge-subtle/20
          shadow-2xl outline-none
          transition-all duration-200
          ${visible && !leaving ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}
        `,
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center px-6 pt-7 pb-5", children: [
                /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-xl ${cfg.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 ${visible && !leaving ? "scale-100" : "scale-75"}`, children: /* @__PURE__ */ jsx(icon_default, { name: cfg.icon, size: 24, className: cfg.iconColor }) }),
                /* @__PURE__ */ jsx("h3", { id: "confirm-title", className: "text-[15px] font-semibold text-ink-primary mb-1", children: state.title || "\xBFEst\xE1s seguro?" }),
                /* @__PURE__ */ jsx("p", { id: "confirm-message", className: "text-sm text-ink-tertiary leading-relaxed whitespace-pre-line", children: state.message })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2.5 px-5 pb-5", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => close(true),
                    className: `flex-1 h-10 rounded-btn text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] outline-none ${cfg.confirmBg}`,
                    children: "Confirmar"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => close(false),
                    className: "flex-1 h-10 rounded-btn text-sm font-semibold text-ink-secondary bg-surface-2 hover:bg-surface-3 transition-all duration-200 active:scale-[0.98] outline-none",
                    children: "Cancelar"
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
var PromptDialog = ({ state, onDone }) => {
  const [value, setValue] = useState(state.defaultValue ?? "");
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const { visible, leaving, close } = useDialogAnim(state.resolve, onDone);
  useTabTrap(dialogRef, () => close(null));
  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [visible]);
  const v = state.variant || "info";
  const cfg = variantConfig[v];
  const defaultIcon = v === "info" ? "Pencil" : cfg.icon;
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
          bg-surface-1 border border-edge-subtle/20
          shadow-2xl
          transition-all duration-200
          ${visible && !leaving ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}
        `,
            onClick: (e) => e.stopPropagation(),
            children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center px-6 pt-7 pb-4", children: [
                /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-xl ${cfg.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 ${visible && !leaving ? "scale-100" : "scale-75"}`, children: /* @__PURE__ */ jsx(icon_default, { name: state.icon || defaultIcon, size: 24, className: cfg.iconColor }) }),
                /* @__PURE__ */ jsx("h3", { id: "prompt-title", className: "text-[15px] font-semibold text-ink-primary mb-1", children: state.title || "Ingresa un valor" }),
                /* @__PURE__ */ jsx("p", { id: "prompt-message", className: "text-sm text-ink-tertiary leading-relaxed whitespace-pre-line", children: state.message })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "px-5 pb-4", children: /* @__PURE__ */ jsx(
                "input",
                {
                  ref: inputRef,
                  type: "text",
                  value,
                  onChange: (e) => setValue(e.target.value),
                  className: "w-full h-10 px-3 rounded-lg border border-edge-subtle/30 text-sm text-ink-primary bg-surface-0 placeholder:text-ink-tertiary/25 outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/30 transition-all"
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2.5 px-5 pb-5", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: !value.trim(),
                    className: `flex-1 h-10 rounded-btn text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] outline-none disabled:opacity-40 disabled:cursor-not-allowed ${cfg.confirmBg}`,
                    children: "Aceptar"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => close(null),
                    className: "flex-1 h-10 rounded-btn text-sm font-semibold text-ink-secondary bg-surface-2 hover:bg-surface-3 transition-all duration-200 active:scale-[0.98] outline-none",
                    children: "Cancelar"
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
  useClickOutside(menuRef, () => {
    if (open) onClose();
  });
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    const onScroll = () => onClose();
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    return () => {
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
        className: "fixed z-50 w-52 rounded-xl overflow-hidden shadow-2xl bg-surface-3 border border-white/10",
        style: {
          left: displayPos.x,
          top: displayPos.y,
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none"
        },
        onMouseDown: (e) => e.stopPropagation(),
        children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-px p-1", children: items.map((item, i) => item.type === "separator" ? /* @__PURE__ */ jsx("div", { className: "h-px bg-white/10 my-1 mx-2" }, i) : /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            disabled: item.disabled,
            className: `w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-white/80 hover:text-white ${item.disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-black/20"}`,
            onClick: (e) => {
              e.stopPropagation();
              if (item.disabled) return;
              onClose();
              item.action?.();
            },
            children: [
              item.icon && /* @__PURE__ */ jsx(icon_default, { name: item.icon, size: 16 }),
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
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 flex flex-col", children: [
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
    className: `w-full relative flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${isSelected ? "bg-surface-2/60" : "hover:bg-surface-2/30"}`,
    children: [
      checkbox ? /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 flex items-center", onClick: (e) => {
        e.stopPropagation();
        checkbox.onChange(!checkbox.checked);
      }, children: /* @__PURE__ */ jsx(
        icon_default,
        {
          name: checkbox.checked ? "SquareCheckBig" : "Square",
          size: 18,
          className: `cursor-pointer transition-colors ${checkbox.checked ? "text-brand" : "text-ink-tertiary"}`
        }
      ) }) : item.icon ? typeof item.icon === "string" ? /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-surface-2", children: /* @__PURE__ */ jsx(icon_default, { name: item.icon, size: 18, className: isSelected ? "text-brand" : "text-ink-tertiary" }) }) : /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: item.icon }) : null,
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        typeof item.title === "string" ? /* @__PURE__ */ jsx("div", { className: `text-sm font-medium truncate ${isSelected ? "text-ink-primary" : "text-ink-secondary"}`, children: item.title }) : item.title,
        item.subtitle && (typeof item.subtitle === "string" ? /* @__PURE__ */ jsx("div", { className: "text-xs text-ink-tertiary truncate", children: item.subtitle }) : item.subtitle)
      ] }),
      item.right && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: item.right }),
      isSelected && !checkbox && /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand rounded-l-full" })
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
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 p-1.5 sm:p-2.5", children: items.map((item, i) => /* @__PURE__ */ jsx(
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
var colorConfig = {
  default: { bg: "bg-surface-2/40", text: "text-ink-primary", iconBg: "bg-surface-3", iconColor: "text-brand" },
  success: { bg: "bg-status-ok/10", text: "text-status-ok", iconBg: "bg-status-ok/20", iconColor: "text-status-ok" },
  warning: { bg: "bg-status-warn/10", text: "text-status-warn", iconBg: "bg-status-warn/20", iconColor: "text-status-warn" },
  danger: { bg: "bg-status-pending/10", text: "text-status-pending", iconBg: "bg-status-pending/20", iconColor: "text-status-pending" }
};
var StatCard = ({ label, value, icon, subtitle, color = "default" }) => {
  const cfg = colorConfig[color];
  return /* @__PURE__ */ jsxs("div", { className: `rounded-xl p-4 flex items-start gap-3 ${cfg.bg}`, children: [
    icon && /* @__PURE__ */ jsx("div", { className: `shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${cfg.iconBg}`, children: /* @__PURE__ */ jsx(icon_default, { name: icon, size: 20, className: cfg.iconColor }) }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx("div", { className: `text-xs font-medium truncate ${cfg.text} opacity-70`, children: label }),
      /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold ${cfg.text}`, children: value }),
      subtitle && /* @__PURE__ */ jsx("div", { className: "text-xs text-ink-tertiary truncate mt-0.5", children: subtitle })
    ] })
  ] });
};
var statcard_default = StatCard;
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
      className: `group/name inline-flex items-center ${hasCustomColor ? "" : "text-gray-500 hover:text-theme-600"} ${onClick ? "cursor-pointer" : ""} ${className}`,
      onClick: (e) => {
        e.stopPropagation();
        onClick?.();
      },
      title: onClick ? email || "Enviar correo" : void 0,
      children: [
        /* @__PURE__ */ jsx("span", { className: `truncate ${email ? "group-hover/name:hidden" : ""}`, children: label }),
        email && /* @__PURE__ */ jsx("span", { className: "hidden group-hover/name:inline truncate", children: email }),
        onClick && /* @__PURE__ */ jsx(icon_default, { name: "Mail", size: 10, className: `hidden group-hover/name:inline ml-1 flex-shrink-0 ${hasCustomColor ? "text-current" : "text-gray-400"}` })
      ]
    }
  );
};
var emaillink_default = EmailLink;
var HoverTooltip = ({ label, btnRef }) => {
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
var hovertooltip_default = HoverTooltip;
var ToolBack = ({ icon, label = "Volver", onClick, variant = "light" }) => {
  const [hovered, setHovered] = useState(false);
  const btnRef = useRef(null);
  const variantStyles = variant === "light" ? "bg-theme-100 hover:bg-theme-200 text-theme-700 hover:text-theme-800" : "bg-white/10 hover:bg-white/15 text-white/80 hover:text-white";
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
                ${variantStyles}
                backdrop-blur-sm transition-all duration-200
                rounded-btn
            `,
      children: [
        /* @__PURE__ */ jsx(icon_default, { name: "ChevronLeft", size: 16, className: variant === "dark" ? "icon-shadow-sm" : "" }),
        /* @__PURE__ */ jsx(icon_default, { name: icon, size: 16, className: variant === "dark" ? "icon-shadow-sm" : "" }),
        hovered && /* @__PURE__ */ jsx(hovertooltip_default, { label, btnRef })
      ]
    }
  );
};
var toolback_default = ToolBack;
function DetailBar({ title, subtitle, email, icon, toolbar, extra, subtitlePrefix, variant = "light", onRename, onEmail, onBack }) {
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
    if (onBack) {
      return /* @__PURE__ */ jsxs("div", { className: "group/header bg-surface-2 border-b border-edge-subtle/20", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 px-4 pt-3 pb-1", children: [
          icon && /* @__PURE__ */ jsx(toolback_default, { icon, onClick: onBack, variant: "dark" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 flex flex-col items-start", children: [
            renderTitle("text-base font-medium text-ink-primary"),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 min-w-0 mt-0.5", children: [
              subtitlePrefix && /* @__PURE__ */ jsx("span", { className: "text-sm text-ink-tertiary flex-shrink-0 hidden xl:inline", children: subtitlePrefix }),
              renderSubtitle("text-sm text-ink-secondary"),
              extra && subtitle && /* @__PURE__ */ jsx("span", { className: "text-ink-tertiary", children: "\xB7" }),
              extra
            ] })
          ] })
        ] }),
        toolbar && /* @__PURE__ */ jsx("div", { className: "flex justify-end px-4 pb-2", children: toolbar })
      ] });
    }
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 px-4 py-3", children: [
      icon && /* @__PURE__ */ jsx(icon_default, { name: icon, size: 22, className: "text-ink-secondary" }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 flex flex-col items-start", children: [
        renderTitle("text-token-h3 font-semibold text-ink-primary"),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 min-w-0 mt-0.5", children: [
          subtitlePrefix && /* @__PURE__ */ jsx("span", { className: "text-sm text-ink-tertiary hidden xl:inline", children: subtitlePrefix }),
          renderSubtitle("text-sm text-ink-secondary"),
          extra && subtitle && /* @__PURE__ */ jsx("span", { className: "text-ink-tertiary", children: "\xB7" }),
          extra
        ] })
      ] }),
      toolbar && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: toolbar })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative border-b border-edge-subtle/15 bg-surface-1", children: [
    icon && /* @__PURE__ */ jsx("div", { className: "absolute -right-3 -bottom-6 opacity-[0.04] pointer-events-none", children: /* @__PURE__ */ jsx(icon_default, { name: icon, size: 120, className: "text-brand" }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center justify-between px-6 py-4 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
        icon && /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(icon_default, { name: icon, size: 18, className: "text-brand" }) }),
        /* @__PURE__ */ jsxs("div", { className: "group flex flex-col min-w-0", children: [
          renderTitle("text-base font-semibold text-ink-primary"),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
            subtitlePrefix && /* @__PURE__ */ jsx("span", { className: "text-xs text-ink-tertiary hidden xl:inline", children: subtitlePrefix }),
            renderSubtitle("text-xs text-ink-secondary"),
            extra && subtitle && /* @__PURE__ */ jsx("span", { className: "text-ink-tertiary", children: "\xB7" }),
            extra
          ] })
        ] })
      ] }),
      toolbar && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: toolbar })
    ] })
  ] });
}
var Card2 = ({ title, subtitle, children, colSpan = 6, variant = "light" }) => {
  const isDark = variant === "dark";
  const root = isDark ? "bg-surface-1 border border-edge-subtle/15 transition-colors duration-300" : "bg-white shadow-lg hover:shadow-xl transition-all duration-300";
  const titleCls = isDark ? "text-ink-primary" : "text-theme-700";
  const subtitleCls = isDark ? "text-ink-tertiary" : "text-theme-500";
  return /* @__PURE__ */ jsxs("div", { className: `flex flex-col h-96 rounded-2xl p-6 ${root} ${colClass(colSpan)}`, children: [
    /* @__PURE__ */ jsxs("div", { className: `flex-shrink-0 text-lg sm:text-xl md:text-xl lg:text-xl xl:text-2xl font-bold mb-4 whitespace-nowrap overflow-hidden text-ellipsis ${titleCls}`, children: [
      title,
      subtitle && /* @__PURE__ */ jsx("div", { className: `text-base sm:text-md md:text-md lg:text-base xl:text-lg font-semibold mt-1 whitespace-nowrap overflow-hidden text-ellipsis ${subtitleCls}`, children: subtitle })
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
      children: /* @__PURE__ */ jsx("div", { className: "\n        px-4 py-2 rounded-full whitespace-nowrap w-fit\n        bg-surface-2 border border-edge-subtle/20\n        text-ink-secondary text-sm font-medium\n      ", children: text })
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
        return { iconBg: "bg-status-ok/15", text: "text-status-ok", icon: "CircleCheck" };
      case "error":
        return { iconBg: "bg-status-pending/15", text: "text-status-pending", icon: "CircleX" };
      case "warning":
        return { iconBg: "bg-status-warn/15", text: "text-status-warn", icon: "TriangleAlert" };
      default:
        return { iconBg: "bg-status-info/15", text: "text-status-info", icon: "Info" };
    }
  };
  const styles = getToastStyles();
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        bg-surface-2 border border-edge-subtle/40 shadow-2xl rounded-xl
        p-4 min-w-[300px] max-w-[400px] relative overflow-hidden
      `,
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: `shrink-0 flex items-center justify-center rounded-xl w-8 h-8 ${styles.iconBg}`, children: /* @__PURE__ */ jsx(icon_default, { name: styles.icon, size: 18, className: styles.text }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          toast.title && /* @__PURE__ */ jsx("div", { className: `font-medium text-sm mb-0.5 uppercase ${styles.text}`, children: toast.title }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-ink-secondary", children: toast.message }),
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
            className: "flex-shrink-0 p-1 rounded-xl hover:bg-surface-2 transition-colors text-ink-tertiary hover:text-ink-primary",
            children: /* @__PURE__ */ jsx(icon_default, { name: "X", size: 16 })
          }
        )
      ] })
    }
  );
};
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
var DEFAULT_COLORS2 = { bg: "bg-surface-2", text: "text-ink-secondary", iconBg: "bg-surface-3" };
function buildAccordionKey(sections, storageKey) {
  if (storageKey) return storageKey;
  const ids = sections.map((s) => s.id).join(",");
  return `jogi_accordion_${ids}`;
}
var Accordion = ({ sections, forceExpanded = false, rememberOpen = true, storageKey, onChange }) => {
  const key = rememberOpen ? buildAccordionKey(sections, storageKey) : null;
  const storedOnMountRef = useRef(void 0);
  const [openId, setOpenId] = useState(() => {
    if (key) {
      try {
        const stored = localStorage.getItem(key);
        if (stored === "__closed__") {
          storedOnMountRef.current = null;
          return null;
        }
        if (stored && sections.some((s) => s.id === stored)) {
          storedOnMountRef.current = stored;
          return stored;
        }
      } catch {
      }
    }
    const first = sections[0]?.id ?? null;
    storedOnMountRef.current = first;
    return first;
  });
  useLayoutEffect(() => {
    if (storedOnMountRef.current !== void 0 && onChange) {
      onChange(storedOnMountRef.current);
    }
  }, []);
  useEffect(() => {
    if (!key) return;
    try {
      localStorage.setItem(key, openId ?? "__closed__");
    } catch {
    }
  }, [openId, key]);
  const handleToggle = (sectionId) => {
    if (forceExpanded) return;
    setOpenId((prev) => {
      const next = prev === sectionId ? null : sectionId;
      onChange?.(next);
      return next;
    });
  };
  return /* @__PURE__ */ jsx("div", { className: "rounded-xl overflow-hidden border border-slate-700 flex-1 flex flex-col min-h-0", children: sections.map((section) => {
    const colors = section.colors ?? DEFAULT_COLORS2;
    const isExpanded = forceExpanded || openId === section.id;
    const contentId = `section-content-${section.id}`;
    return /* @__PURE__ */ jsxs("div", { className: `border-b border-slate-700 last:border-b-0 flex flex-col ${isExpanded ? "flex-1 min-h-0" : ""}`, children: [
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
          className: `${section.contentClassName ?? "p-2.5 sm:p-4 bg-transparent"} ${isExpanded ? "flex-1 min-h-0 overflow-y-auto" : "hidden print:block"}`,
          children: section.content
        }
      )
    ] }, section.id);
  }) });
};
var section_default = Accordion;
var colorStyles = {
  default: "",
  amber: "text-status-warn hover:text-status-warn/80 hover:bg-status-warn/30",
  red: "text-status-pending hover:text-status-pending/80 hover:bg-status-pending/30"
};
var ToolbarButton = ({
  icon,
  label,
  onClick,
  active = false,
  variant = "dark",
  color,
  disabled,
  ...rest
}) => {
  const [hovered, setHovered] = useState(false);
  const btnRef = useRef(null);
  const disabledStyle = disabled ? disabledEffect : "";
  const isIconOnly = color !== void 0;
  const variantStyles = color && color !== "default" ? colorStyles[color] : variant === "light" ? "bg-white hover:bg-gray-50 text-theme-700 hover:text-theme-800" : isIconOnly ? "text-white/80 hover:text-white hover:bg-surface-3" : "bg-surface-3 hover:bg-surface-4 text-white/80 hover:text-white";
  const activeStyles = variant === "light" ? "bg-gray-100 text-theme-600" : "bg-surface-4 text-white";
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
                flex items-center justify-center ${isIconOnly ? "p-2 rounded-btn-sm" : "h-9 px-3 first:rounded-l-btn last:rounded-r-btn"}
                ${variantStyles}
                ${isIconOnly ? "" : "backdrop-blur-sm"} transition-all duration-200
                ${active ? activeStyles : ""}
                ${disabled ? "cursor-not-allowed" : ""}
            `,
      children: [
        /* @__PURE__ */ jsx(icon_default, { name: icon, size: isIconOnly ? 15 : 16, className: `${variant === "dark" && !isIconOnly ? "icon-shadow-sm" : ""} ${disabledStyle}` }),
        hovered && /* @__PURE__ */ jsx(hovertooltip_default, { label, btnRef })
      ]
    }
  );
};
var toolbarbutton_default = ToolbarButton;
var ButtonGroup = ({ children, className = "", variant = "dark" }) => {
  const bg = variant === "dark" ? "bg-surface-2" : "bg-gray-200 shadow-sm";
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
var SIZE_CONFIG2 = {
  xs: { button: "px-2 py-1.5 text-xs gap-1", icon: 14 },
  sm: { button: "px-3 py-2 text-xs gap-1.5", icon: 16 },
  md: { button: "px-4 py-2.5 text-sm gap-1.5", icon: 18 }
};
function buildTabsKey(tabs, storageKey) {
  if (storageKey) return storageKey;
  return `jogi_tabs_${tabs.map((t) => t.id).join(",")}`;
}
var Tabs = ({
  tabs,
  activeTab: controlledActive,
  onChange,
  onRefresh,
  storageKey: explicitStorageKey,
  children,
  className = "",
  suffix,
  dark = true,
  size = "sm"
}) => {
  const storageKey = buildTabsKey(tabs, explicitStorageKey);
  const storedOnMountRef = useRef(null);
  const [internalActive, setInternalActive] = useState(() => {
    if (storageKey) {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored && tabs.some((t) => t.id === stored)) {
          storedOnMountRef.current = stored;
          if (controlledActive === void 0) return stored;
        }
      } catch {
      }
    }
    return tabs[0]?.id || "";
  });
  const activeId = controlledActive ?? internalActive;
  useLayoutEffect(() => {
    const stored = storedOnMountRef.current;
    if (!stored || controlledActive === void 0) return;
    if (stored !== controlledActive) onChange?.(stored);
  }, []);
  useLayoutEffect(() => {
    const stored = storedOnMountRef.current;
    if (!stored || controlledActive !== void 0) return;
    if (stored !== tabs[0]?.id) onChange?.(stored);
  }, []);
  useEffect(() => {
    if (!storageKey) return;
    const value = controlledActive ?? internalActive;
    try {
      localStorage.setItem(storageKey, value);
    } catch {
    }
  }, [controlledActive, internalActive, storageKey]);
  useEffect(() => {
    if (tabs.length > 0 && !tabs.some((t) => t.id === activeId)) {
      const newActive = tabs[0].id;
      setInternalActive(newActive);
      onChange?.(newActive);
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, newActive);
        } catch {
        }
      }
    }
  }, [tabs, activeId]);
  const handleTabClick = (tabId) => {
    if (tabId === activeId) {
      onRefresh?.(tabId);
    } else {
      if (controlledActive === void 0) {
        setInternalActive(tabId);
        if (storageKey) {
          try {
            localStorage.setItem(storageKey, tabId);
          } catch {
          }
        }
      }
      onChange?.(tabId);
    }
  };
  if (tabs.length === 0) return null;
  const hasContent = children !== void 0;
  const sizeConfig3 = SIZE_CONFIG2[size];
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto overflow-y-hidden mx-3 sm:mx-6 my-2.5 scrollbar-none", children: /* @__PURE__ */ jsx("div", { className: "flex w-fit gap-1.5", children: tabs.map((tab) => {
      const isActive = activeId === tab.id;
      const sfx = suffix?.(tab.id);
      return /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: (e) => {
            e.stopPropagation();
            handleTabClick(tab.id);
          },
          className: [
            "flex items-center justify-center min-w-[7.5rem] rounded-lg",
            "font-semibold transition-all duration-200 cursor-pointer select-none",
            "truncate whitespace-nowrap overflow-hidden",
            sizeConfig3.button,
            dark ? isActive ? "bg-brand text-brand-contrast shadow-sm border border-transparent" : "text-ink-tertiary hover:text-ink-primary border border-edge-subtle/15" : isActive ? "bg-white text-theme-700 shadow-sm border border-transparent" : "text-gray-500 hover:text-gray-700 border border-gray-200"
          ].join(" "),
          children: [
            tab.icon && /* @__PURE__ */ jsx(icon_default, { name: tab.icon, size: sizeConfig3.icon, className: `flex-shrink-0 ${dark ? isActive ? "text-brand-contrast" : "text-ink-tertiary" : isActive ? "text-theme-500" : "text-gray-400"}` }),
            /* @__PURE__ */ jsxs("span", { className: "truncate", title: tab.label, children: [
              tab.label,
              sfx || ""
            ] })
          ]
        },
        tab.id
      );
    }) }) }),
    hasContent && /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 flex flex-col", children })
  ] });
};
var tabs_default = Tabs;
var Panel = ({ open, onToggle, width = 280, icon, title, subtitle, children }) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative h-full bg-surface-1 border-l border-edge-subtle/15 flex flex-shrink-0",
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
            className: "group w-5 h-full flex-shrink-0 flex items-center justify-center cursor-pointer hover:bg-surface-2/40 transition-colors",
            title: open ? "Ocultar panel" : "Mostrar panel",
            children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 opacity-40 group-hover:opacity-70 transition-opacity", children: [
              /* @__PURE__ */ jsx("div", { className: "w-1 h-1 rounded-full bg-ink-tertiary" }),
              /* @__PURE__ */ jsx("div", { className: "w-1 h-1 rounded-full bg-ink-tertiary" }),
              /* @__PURE__ */ jsx("div", { className: "w-1 h-1 rounded-full bg-ink-tertiary" })
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
              icon && /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-xl bg-surface-2/60 border border-edge-subtle/10 flex items-center justify-center overflow-hidden", children: typeof icon === "string" ? /* @__PURE__ */ jsx(icon_default, { name: icon, size: 48, className: "text-brand" }) : icon }) }),
              title && /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-ink-primary text-center mb-1 break-words", children: title }),
              subtitle && /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-tertiary text-center mb-4 break-words", children: subtitle }),
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
  iconColor = "text-ink-tertiary",
  defaultOpen = true,
  maxHeight,
  children
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return /* @__PURE__ */ jsxs("div", { className: "bg-surface-2/40 border border-edge-subtle/10 rounded-xl overflow-hidden mb-3", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((o) => !o),
        className: "w-full flex items-center justify-between px-3 py-2.5 bg-surface-2/60 hover:bg-surface-2 transition-colors cursor-pointer",
        children: [
          /* @__PURE__ */ jsxs("h4", { className: "text-xs font-semibold text-ink-secondary flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(icon_default, { name: icon, size: 12, className: iconColor }),
            title
          ] }),
          /* @__PURE__ */ jsx(icon_default, { name: open ? "ChevronUp" : "ChevronDown", size: 14, className: "text-ink-tertiary" })
        ]
      }
    ),
    open && /* @__PURE__ */ jsx("div", { className: "p-3 overflow-y-auto", style: maxHeight ? { maxHeight } : void 0, children })
  ] });
};
var DataRow = ({ label, value }) => {
  const displayValue = value ?? "\u2014";
  const titleValue = typeof value === "string" ? value : void 0;
  return /* @__PURE__ */ jsxs("div", { className: "py-1.5 border-b border-edge-subtle/10 last:border-0", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[10px] text-ink-tertiary capitalize", children: label.replace(/_/g, " ") }),
    /* @__PURE__ */ jsx("div", { className: "text-xs text-ink-primary truncate", title: titleValue, children: displayValue || /* @__PURE__ */ jsx("span", { className: "text-ink-tertiary", children: "\u2014" }) })
  ] });
};
var TablePanel = ({
  title,
  icon,
  iconColor = "text-ink-tertiary",
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
    children: data.length > 0 ? data.map((row, i) => /* @__PURE__ */ jsx(DataRow, { label: row.label, value: row.value }, i)) : emptyContent || /* @__PURE__ */ jsx("p", { className: "text-xs text-ink-tertiary", children: "Sin datos" })
  }
);
var tablepanel_default = TablePanel;
var Scroll = ({ children, className = "", grid = false }) => {
  const layout = grid ? "grid gap-[3%] p-[3%] lg:grid-cols-12" : "";
  return /* @__PURE__ */ jsx("div", { className: `flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col ${layout} ${className}`, children });
};
var scroll_default = Scroll;
var Container = ({ title, icon, children }) => {
  const horizontalr = "gap-2 sm:gap-4 px-4 sm:px-5 md:px-6";
  const verticalr = "py-2 short:py-3 mid:py-3 tall:py-4 xtall:py-5";
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full shadow-2xl lg:rounded-xl overflow-hidden", children: [
    /* @__PURE__ */ jsx("header", { className: `flex flex-col text-lg sm:text-xl ${horizontalr} ${verticalr} flex-shrink-0 bg-gradient-to-r from-theme-700 to-theme-600`, children: /* @__PURE__ */ jsx("div", { className: "group/header flex items-center gap-4 sm:gap-8", children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-3 whitespace-nowrap text-theme-100", children: [
      icon && /* @__PURE__ */ jsx(icon_default, { name: icon, className: "hidden sm:inline-block size-[20px] md:size-[22px] lg:size-[24px] text-theme-100 icon-shadow-md" }),
      /* @__PURE__ */ jsx("span", { className: "text-xl md:text-2xl font-bold uppercase tracking-wide text-theme-100 text-shadow-md", children: title })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 flex flex-col bg-white", children })
  ] });
};
var container_default = Container;
var sizeConfig = {
  xs: { spinner: 20, stroke: 2, text: "text-xs" },
  sm: { spinner: 28, stroke: 2.5, text: "text-sm" },
  md: { spinner: 36, stroke: 3, text: "text-base" },
  lg: { spinner: 48, stroke: 3.5, text: "text-lg" }
};
function Spinner({ size = "sm", message }) {
  const id = useId().replace(/:/g, "");
  const cfg = sizeConfig[size];
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
          style: { width: cfg.spinner, height: cfg.spinner },
          children: [
            /* @__PURE__ */ jsx(
              "circle",
              {
                cx: "25",
                cy: "25",
                r: "20",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: cfg.stroke,
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
                strokeWidth: cfg.stroke,
                strokeLinecap: "round",
                className: `text-theme-500 loading-dash-${id}`
              }
            )
          ]
        }
      ),
      message && /* @__PURE__ */ jsx("span", { className: `${cfg.text} text-theme-600 font-medium`, children: message })
    ] })
  ] });
}
var sizeConfig2 = {
  xs: { svg: 60, text: "text-xs" },
  sm: { svg: 80, text: "text-sm" },
  md: { svg: 100, text: "text-base" },
  lg: { svg: 120, text: "text-lg" },
  xl: { svg: 140, text: "text-xl" }
};
function DragHere2({ size = "lg" }) {
  const isMobile = useIsMobile();
  const cfg = sizeConfig2[size];
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
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-surface-0/60 backdrop-blur-sm pointer-events-none grid place-items-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxs(
        "svg",
        {
          width: cfg.svg,
          height: Math.round(cfg.svg * 0.83),
          viewBox: "0 0 120 100",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          className: "opacity-60",
          children: [
            /* @__PURE__ */ jsx("path", { d: "M20 35 L60 15 L100 35 L60 55 Z", className: "fill-surface-3 stroke-ink-tertiary", strokeWidth: "1.5" }),
            /* @__PURE__ */ jsx("path", { d: "M20 35 L20 65 L60 85 L60 55 Z", className: "fill-surface-2 stroke-ink-tertiary", strokeWidth: "1.5" }),
            /* @__PURE__ */ jsx("path", { d: "M100 35 L100 65 L60 85 L60 55 Z", className: "fill-surface-2 stroke-ink-tertiary", strokeWidth: "1.5" }),
            /* @__PURE__ */ jsx("g", { className: "drag-arrow-bounce", children: /* @__PURE__ */ jsx(
              "path",
              {
                d: "M60 0 L60 22 M52 14 L60 22 L68 14",
                className: "stroke-brand",
                strokeWidth: "2.5",
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            ) })
          ]
        }
      ),
      /* @__PURE__ */ jsx("p", { className: `${cfg.text} font-medium text-ink-secondary`, children: isMobile ? "Toca para subir documentos" : "Arrastre aqu\xED" })
    ] }) })
  ] });
}
var PillTag = ({ children, grip }) => /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-white border border-gray-200 text-gray-700", children: [
  grip && /* @__PURE__ */ jsx(icon_default, { name: "GripVertical", size: 12, className: "text-gray-400" }),
  /* @__PURE__ */ jsx("span", { className: "truncate", children })
] });
var pilltag_default = PillTag;
var defaultGetId = (item) => item?.id ?? "";
function useRecords({
  endpoint,
  sortList,
  fetchFn,
  onError,
  getId = defaultGetId,
  staticParams,
  filterId,
  limit = 10,
  initialState
}) {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(initialState?.page ?? 0);
  const [search, setSearch] = useState(initialState?.search ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(initialState?.search ?? "");
  const [sortBy, setSortBy] = useState(initialState?.sortBy || (sortList[0]?.value ?? ""));
  const [thenBy, setThenBy] = useState(sortList[1]?.value ?? "");
  const [sortDir, setSortDir] = useState(initialState?.sortDir ?? "desc");
  const [thenDir, setThenDir] = useState("desc");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);
  const staticParamsKey = useMemo(() => JSON.stringify(staticParams ?? {}), [staticParams]);
  const abortControllerRef = useRef(null);
  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    setLoading(true);
    try {
      const params = JSON.parse(staticParamsKey);
      const payload = filterId ? { filterId, ...params } : { search: debouncedSearch, offset: page * limit, limit: limit + 1, sortBy, thenBy, sortDir, thenDir, ...params };
      const data2 = await fetchFn(endpoint, payload);
      setRaw(Array.isArray(data2) ? data2 : []);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      onError?.(err, { module: "userecords", action: "fetch" });
      setRaw([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, filterId, debouncedSearch, page, sortBy, thenBy, sortDir, thenDir, limit, staticParamsKey, fetchFn, onError]);
  useEffect(() => {
    fetchData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);
  const matchId = useCallback(
    (h, id) => getId(h) === id,
    [getId]
  );
  const patchRaw = useCallback((id, changes) => {
    setRaw((prev) => {
      if (!Array.isArray(prev)) return prev;
      const isGrouped = Array.isArray(prev[0]);
      if (isGrouped) {
        return prev.map(
          (group) => group.map((h) => matchId(h, id) ? { ...h, ...changes } : h)
        );
      }
      return prev.map((h) => matchId(h, id) ? { ...h, ...changes } : h);
    });
  }, [matchId]);
  const removeRaw = useCallback((id) => {
    setRaw(
      (prev) => Array.isArray(prev[0]) ? prev.filter((group) => !matchId(group[0], id)).map((group) => group.filter((h) => !matchId(h, id))).filter((g) => g.length > 0) : prev.filter((h) => !matchId(h, id))
    );
  }, [matchId]);
  const refresh = useMemo(() => ({
    fetch: fetchData,
    patch: patchRaw,
    remove: removeRaw
  }), [fetchData, patchRaw, removeRaw]);
  const data = useMemo(() => Array.isArray(raw) ? raw.slice(0, limit) : [], [raw, limit]);
  const hasNext = raw.length > limit;
  return {
    data,
    loading,
    hasNext,
    refresh,
    page,
    setPage,
    search,
    setSearch,
    sortBy,
    setSortBy,
    thenBy,
    setThenBy,
    sortDir,
    setSortDir,
    thenDir,
    setThenDir,
    sortList
  };
}

// src/common/folderutils.ts
var IGNORED = /* @__PURE__ */ new Set([".DS_Store", "Thumbs.db", "desktop.ini"]);
function isHiddenOrIgnored(name) {
  return name.startsWith(".") || name.startsWith("__MACOSX") || IGNORED.has(name);
}
function readEntries(reader) {
  return new Promise((resolve, reject) => reader.readEntries(resolve, reject));
}
function fileFromEntry(entry) {
  return new Promise((resolve, reject) => entry.file(resolve, reject));
}
async function collectFiles(entry) {
  if (isHiddenOrIgnored(entry.name)) return [];
  if (entry.isFile) {
    const file = await fileFromEntry(entry);
    return [file];
  }
  if (entry.isDirectory) {
    const reader = entry.createReader();
    const files = [];
    let batch;
    do {
      batch = await readEntries(reader);
      for (const child of batch) {
        const childFiles = await collectFiles(child);
        files.push(...childFiles);
      }
    } while (batch.length > 0);
    return files;
  }
  return [];
}
function captureDataTransfer(dt) {
  if (dt.items && dt.items.length > 0) {
    const entries = [];
    for (let i = 0; i < dt.items.length; i++) {
      const entry = dt.items[i].webkitGetAsEntry?.();
      if (entry) entries.push(entry);
    }
    if (entries.length > 0) return { entries };
  }
  return { files: Array.from(dt.files) };
}
async function resolveFiles(captured) {
  if ("files" in captured) return captured.files;
  const allFiles = [];
  for (const entry of captured.entries) {
    const files = await collectFiles(entry);
    allFiles.push(...files);
  }
  return allFiles;
}

// src/common/filepicker.ts
function openFilePicker(opts) {
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = true;
  input.accept = opts.accept ?? "*";
  input.onchange = (e) => {
    const target = e.target;
    if (target.files) opts.onFiles(target.files);
  };
  input.click();
}
var DEFAULT_LABELS = {
  documentN: (i) => `Document ${i}`,
  unclassifiedType: "Unclassified",
  unclassifiedTitle: "Unclassified document",
  unclassifiedMessage: (name) => `${name}: saved as additional document.`,
  unknownError: "Unknown error",
  uploadErrorMessage: (name) => `Error uploading ${name}`,
  documentsUploaded: (count) => count === 1 ? "1 document uploaded" : `${count} documents uploaded`,
  partialUploadTitle: "Partial upload",
  completeUploadTitle: "Upload complete",
  filesWithError: (count) => `${count} file(s) with errors.`,
  successSuffix: "successfully"
};
var wait = (ms) => new Promise((r) => setTimeout(r, ms));
var shortName = (name, max = 30) => name.length > max ? name.slice(0, max - 3) + "..." : name;
function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}
function useUploadFlow(options) {
  const { uploadFn, onToast, concurrency = 3 } = options;
  const labels = { ...DEFAULT_LABELS, ...options.labels };
  const [active, setActive] = useState(false);
  const [items, setItems] = useState([]);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const labelsRef = useRef(labels);
  labelsRef.current = labels;
  const updateItem = useCallback((id, patch) => {
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, ...patch } : it));
  }, []);
  const compressIfImage = async (file) => {
    if (!file.type.startsWith("image/")) return file;
    const { default: imageCompression } = await import('browser-image-compression');
    const c = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1200, useWebWorker: true });
    return new File([c], file.name, { type: c.type });
  };
  const processSingleFile = useCallback(async (item, uploadOpts) => {
    const name = shortName(item.file.name);
    const l = labelsRef.current;
    let progressTimer = null;
    try {
      updateItem(item.id, { status: "compressing", progress: 5 });
      const compressed = await compressIfImage(item.file);
      updateItem(item.id, { status: "uploading", progress: 15 });
      let currentProgress = 15;
      progressTimer = setInterval(() => {
        currentProgress += (80 - currentProgress) * 0.08;
        updateItem(item.id, { status: "analyzing", progress: Math.min(Math.round(currentProgress), 78) });
      }, 300);
      await wait(200);
      updateItem(item.id, { status: "analyzing" });
      const params = {};
      if (uploadOpts?.requestId) params.requestId = uploadOpts.requestId;
      else if (optionsRef.current.requestId) params.requestId = optionsRef.current.requestId;
      if (uploadOpts?.docTypeId) params.docTypeId = uploadOpts.docTypeId;
      let res;
      const maxRetries = 4;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          res = await uploadFn(compressed, params);
          break;
        } catch (retryErr) {
          const is429 = retryErr?.status === 429 || /429|rate.?limit|too many/i.test(retryErr?.message || "");
          if (is429 && attempt < maxRetries) {
            await wait(2e3 * (attempt + 1));
            continue;
          }
          throw retryErr;
        }
      }
      if (progressTimer) clearInterval(progressTimer);
      progressTimer = null;
      if (res?.noclasificado) {
        updateItem(item.id, { status: "done", progress: 100, detectedTypes: [l.unclassifiedType], detectedCount: 1 });
        onToast?.({ type: "info", title: l.unclassifiedTitle, message: l.unclassifiedMessage(name) });
        return { done: true, detectedCount: 1 };
      }
      const docs = res?.detectedDocuments || [];
      const docLabels = docs.map((d) => d.label).filter(Boolean);
      const count = docs.length || res?.count || 1;
      if (count > 1) {
        updateItem(item.id, {
          status: "detected",
          progress: 85,
          detectedTypes: docLabels,
          detectedCount: count
        });
        await wait(900);
        const docItems = docs.map((d, i) => ({
          id: `${item.id}-doc-${i}`,
          file: item.file,
          filename: d.label || l.documentN(i + 1),
          status: "linking",
          progress: 90,
          detectedTypes: [],
          detectedCount: 1,
          isExpanded: true
        }));
        setItems((prev) => {
          const idx = prev.findIndex((it) => it.id === item.id);
          if (idx === -1) return [...prev, ...docItems];
          return [...prev.slice(0, idx), ...docItems, ...prev.slice(idx + 1)];
        });
        for (let i = 0; i < docItems.length; i++) {
          await wait(150);
          updateItem(docItems[i].id, { status: "done", progress: 100 });
        }
        return { done: true, detectedCount: docItems.length };
      }
      updateItem(item.id, {
        status: "detected",
        progress: 85,
        detectedTypes: docLabels,
        detectedCount: count
      });
      await wait(800);
      updateItem(item.id, { status: "linking", progress: 95 });
      await wait(400);
      updateItem(item.id, { status: "done", progress: 100 });
      return { done: true, detectedCount: 1 };
    } catch (err) {
      let msg = err?.message || l.unknownError;
      const parsed = safeJsonParse(msg);
      if (parsed?.msg) msg = parsed.msg;
      updateItem(item.id, {
        status: "error",
        error: msg
      });
      onToast?.({ type: "error", title: "Error", message: l.uploadErrorMessage(name) });
      return { done: false, detectedCount: 0 };
    } finally {
      if (progressTimer) clearInterval(progressTimer);
    }
  }, [updateItem, uploadFn, onToast]);
  const processFiles = useCallback(async (fileList, uploadOpts) => {
    if (!fileList.length) return;
    if (active) return;
    const files = Array.from(fileList);
    const newItems = files.map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      filename: f.name,
      status: "queued",
      progress: 0,
      detectedTypes: [],
      detectedCount: 0
    }));
    setItems(newItems);
    setActive(true);
    let nextIndex = 0;
    let processing = 0;
    const itemsCopy = [...newItems];
    let totalDone = 0;
    let totalErrors = 0;
    let totalDetected = 0;
    await new Promise((resolveAll) => {
      const tryNext = () => {
        while (processing < concurrency && nextIndex < itemsCopy.length) {
          const item = itemsCopy[nextIndex++];
          processing++;
          processSingleFile(item, uploadOpts).then((outcome) => {
            if (outcome.done) {
              totalDone++;
              totalDetected += outcome.detectedCount;
            } else totalErrors++;
          }).finally(() => {
            processing--;
            if (nextIndex >= itemsCopy.length && processing === 0) {
              resolveAll();
            } else {
              tryNext();
            }
          });
        }
        if (itemsCopy.length === 0) resolveAll();
      };
      tryNext();
    });
    const l = labelsRef.current;
    if (newItems.length > 1 && totalDone > 0) {
      const docWord = l.documentsUploaded(totalDetected);
      onToast?.({
        type: totalErrors > 0 ? "warning" : "success",
        title: totalErrors > 0 ? l.partialUploadTitle : l.completeUploadTitle,
        message: totalErrors > 0 ? `${docWord}. ${l.filesWithError(totalErrors)}` : `${docWord} ${l.successSuffix}`
      });
    }
    await wait(300);
    setActive(false);
    setItems([]);
    optionsRef.current.onComplete?.();
  }, [active, processSingleFile, onToast, concurrency]);
  const summary = {
    total: items.length,
    done: items.filter((it) => it.status === "done").length,
    errors: items.filter((it) => it.status === "error").length
  };
  const processDataTransfer = useCallback(async (captured, uploadOpts) => {
    const files = await resolveFiles(captured);
    if (files.length) await processFiles(files, uploadOpts);
  }, [processFiles]);
  return { active, items, summary, processFiles, processDataTransfer };
}
var DEFAULT_STATUS_LABELS = {
  queued: "Queued",
  compressing: "Compressing...",
  uploading: "Uploading...",
  analyzing: "Analyzing...",
  done: "Done"
};
var statusConfig = {
  queued: { icon: "Clock", color: "text-ink-tertiary" },
  compressing: { icon: "FileDown", color: "text-theme-400", spin: true },
  uploading: { icon: "Upload", color: "text-theme-400", spin: true },
  analyzing: { icon: "Sparkles", color: "text-theme-400", spin: true },
  detected: { icon: "Sparkles", color: "text-theme-300" },
  linking: { icon: "Link", color: "text-theme-400" },
  done: { icon: "Check", color: "text-status-ok" },
  error: { icon: "X", color: "text-status-pending" }
};
var fileIcon = (filename) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "FileText";
  if (["jpg", "jpeg", "png", "webp", "gif", "heic"].includes(ext || "")) return "Image";
  return "File";
};
var truncate = (s, max = 32) => s.length > max ? s.slice(0, max - 3) + "..." : s;
function defaultLinkingLabel(requestLabel, role) {
  if (requestLabel) {
    const short = requestLabel.length > 20 ? requestLabel.slice(0, 18) + "..." : requestLabel;
    return `Linking to ${short}`;
  }
  if (role === "analyst") return "Linking to request";
  if (role === "client") return "Linking to your requests";
  return "Saving to library";
}
function defaultDetectedLabel(types, count) {
  if (types.length === 0) return count > 1 ? `${count} documents found` : "Document found";
  if (types.length === 1) return `${types[0]}`;
  return types.slice(0, 2).join(", ") + (types.length > 2 ? ` +${types.length - 2}` : "");
}
function defaultHeaderLabel(items, summary) {
  const allDone = items.length > 0 && items.every((it) => it.status === "done" || it.status === "error");
  if (allDone) {
    const totalDetected = items.reduce((sum, it) => sum + (it.detectedCount || 0), 0);
    if (totalDetected > 0) {
      return `${totalDetected} document${totalDetected !== 1 ? "s" : ""} uploaded`;
    }
    return summary.errors === summary.total ? "Upload error" : "Done";
  }
  if (items.length === 1) return items[0]?.filename || "Uploading...";
  const stillUploading = items.some((it) => ["queued", "compressing", "uploading", "analyzing"].includes(it.status));
  if (!stillUploading) {
    const detected = items.reduce((sum, it) => sum + (it.detectedCount || 0), 0);
    return `${detected} document${detected !== 1 ? "s" : ""} found`;
  }
  return "Uploading files...";
}
function StatusLabel({ item, requestLabel, role, labels }) {
  const getLinkingLabel = labels.linkingLabel ?? defaultLinkingLabel;
  const getDetectedLabel = labels.detectedLabel ?? defaultDetectedLabel;
  if (item.status === "error") return /* @__PURE__ */ jsx("span", { className: "text-xs text-status-pending", children: item.error || "Error" });
  if (item.status === "detected") return /* @__PURE__ */ jsx("span", { className: "text-xs text-theme-300 font-medium", children: getDetectedLabel(item.detectedTypes, item.detectedCount) });
  if (item.status === "linking") return /* @__PURE__ */ jsx("span", { className: "text-xs text-theme-400", children: getLinkingLabel(requestLabel, role) });
  if (item.status === "done" && item.detectedTypes.length > 0) return /* @__PURE__ */ jsx("span", { className: "text-xs text-status-ok", children: getDetectedLabel(item.detectedTypes, item.detectedCount) });
  const statusLabel = labels[item.status] ?? "";
  return /* @__PURE__ */ jsx("span", { className: "text-xs text-ink-tertiary", children: statusLabel });
}
function ProgressBar({ item }) {
  const isActive = ["compressing", "uploading", "analyzing"].includes(item.status);
  const isDone = item.status === "done";
  const isError = item.status === "error";
  const barColor = isError ? "bg-status-pending" : isDone ? "bg-status-ok" : "bg-theme-400";
  const trackColor = isError ? "bg-status-pending/20" : isDone ? "bg-status-ok/20" : "bg-theme-950/40";
  return /* @__PURE__ */ jsx("div", { className: `h-1 rounded-full overflow-hidden ${trackColor}`, children: /* @__PURE__ */ jsx(
    "div",
    {
      className: `h-full rounded-full transition-all duration-300 ease-out ${barColor} ${isActive ? "upload-progress-shimmer" : ""}`,
      style: { width: `${item.progress}%` }
    }
  ) });
}
function StatusIcon({ item }) {
  const id = useId().replace(/:/g, "");
  const cfg = statusConfig[item.status];
  if (cfg.spin) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("style", { children: `
          @keyframes upload-spin-${id} { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .upload-spin-${id} { animation: upload-spin-${id} 2s linear infinite; }
        ` }),
      /* @__PURE__ */ jsx("div", { className: `upload-spin-${id} ${cfg.color}`, children: /* @__PURE__ */ jsx(icon_default, { name: cfg.icon, size: 16 }) })
    ] });
  }
  if (item.status === "done") {
    return /* @__PURE__ */ jsx("div", { className: `animate-upload-check ${cfg.color}`, children: /* @__PURE__ */ jsx(icon_default, { name: cfg.icon, size: 16 }) });
  }
  return /* @__PURE__ */ jsx("div", { className: cfg.color, children: /* @__PURE__ */ jsx(icon_default, { name: cfg.icon, size: 16 }) });
}
function DetectedPills({ types }) {
  if (types.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1 mt-1", children: [
    types.slice(0, 4).map((label, i) => /* @__PURE__ */ jsx(
      "span",
      {
        className: "px-1.5 py-0.5 text-[10px] rounded-full bg-theme-900/40 text-theme-300 font-medium animate-fade-in-up",
        style: { animationDelay: `${i * 100}ms` },
        children: label
      },
      `${i}-${label}`
    )),
    types.length > 4 && /* @__PURE__ */ jsxs(
      "span",
      {
        className: "px-1.5 py-0.5 text-[10px] rounded-full bg-surface-2 text-ink-tertiary font-medium animate-fade-in-up",
        style: { animationDelay: `${4 * 100}ms` },
        children: [
          "+",
          types.length - 4
        ]
      }
    )
  ] });
}
function UploadCard({ item, index, requestLabel, role, labels }) {
  const isDone = item.status === "done";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `flex items-start gap-3 px-3 py-2.5 rounded-xl transition-opacity duration-700 animate-upload-slide-in ${isDone ? "opacity-50" : "opacity-100"}`,
      style: { animationDelay: `${index * 80}ms` },
      children: [
        /* @__PURE__ */ jsx("div", { className: `flex-shrink-0 mt-0.5 ${isDone ? "text-status-ok" : "text-theme-300"}`, children: /* @__PURE__ */ jsx(icon_default, { name: isDone ? "Check" : item.isExpanded ? "FileText" : fileIcon(item.filename), size: 18 }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: `text-sm font-medium truncate ${isDone ? "text-ink-tertiary" : "text-ink-primary"}`, children: item.isExpanded ? item.filename : truncate(item.filename) }),
            /* @__PURE__ */ jsx(StatusIcon, { item })
          ] }),
          !item.isExpanded && /* @__PURE__ */ jsx(StatusLabel, { item, requestLabel, role, labels }),
          !item.isExpanded && /* @__PURE__ */ jsx("div", { className: "mt-1.5", children: /* @__PURE__ */ jsx(ProgressBar, { item }) }),
          item.status === "detected" && /* @__PURE__ */ jsx(DetectedPills, { types: item.detectedTypes })
        ] })
      ]
    }
  );
}
function UploadCards({ items, summary, requestLabel, role, labels: userLabels }) {
  const labels = { ...DEFAULT_STATUS_LABELS, ...userLabels };
  const getHeaderLabel = labels.headerLabel ?? defaultHeaderLabel;
  const allDone = items.length > 0 && items.every((it) => it.status === "done" || it.status === "error");
  const overallProgress = items.length > 0 ? Math.round(items.reduce((sum, it) => sum + it.progress, 0) / items.length) : 0;
  const isSingle = items.length === 1;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-surface-0/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3 px-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: `text-theme-400 ${!allDone ? "animate-pulse" : ""}`, children: /* @__PURE__ */ jsx(icon_default, { name: allDone ? "CircleCheck" : "Upload", size: 18 }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-ink-secondary truncate", children: getHeaderLabel(items, summary) })
      ] }),
      !isSingle && /* @__PURE__ */ jsxs("span", { className: "text-xs text-ink-tertiary tabular-nums", children: [
        overallProgress,
        "%"
      ] })
    ] }),
    !isSingle && /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full bg-theme-950/40 mb-3 overflow-hidden", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: `h-full rounded-full transition-all duration-500 ease-out ${allDone ? "bg-status-ok" : "bg-theme-400"}`,
        style: { width: `${overallProgress}%` }
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "bg-surface-1/80 rounded-2xl shadow-token-md border border-edge-subtle/20 divide-y divide-edge-subtle/20 max-h-[60vh] overflow-y-auto", children: items.map((item, i) => /* @__PURE__ */ jsx(
      UploadCard,
      {
        item,
        index: i,
        requestLabel,
        role,
        labels
      },
      item.id
    )) })
  ] }) });
}

export { section_default as Accordion, anchor_default as Anchor, button_default as Button, buttongroup_default as ButtonGroup, card_default as Card, CardList, checkbox_default as Checkbox, colorpicker_default as ColorPicker, computedfield_default as ComputedField, confirm_default as Confirm, container_default as Container, contextmenu_default as ContextMenu, DetailBar, DetailContent, dragherehint_default as DragHereHint, DragHere2 as DragHereOverlay, editabletitle_default as EditableTitle, emaillink_default as EmailLink, emptystate_default as EmptyState, FieldWrapper, icon_default as Icon, input_default as Input, label_default as Label, MasterDetail, modal_default as Modal, modalformlayout_default as ModalFormLayout, modaloverlaypanel_default as ModalOverlayPanel, modaltoolbar_default as ModalToolbar, numberfield_default as NumberField, panel_default as Panel, pilltag_default as PillTag, progressring_default as ProgressRing, prompt_default as Prompt, radio_default as Radio, scroll_default as Scroll, SectionSeparator, select_default as Select, selectfield_default as SelectField, SidebarFilter, SidebarPaginator, SidebarSort, skeleton_default as Skeleton, Spinner, statcard_default as StatCard, tablepanel_default as TablePanel, tabs_default as Tabs, textfield_default as TextField, ToastContainer, ToastProvider, toolback_default as ToolBack, toolbarbutton_default as ToolbarButton, tooltip_default as Tooltip, UploadCards, captureDataTransfer, createDialogContext, openFilePicker, resolveFiles, useIsDesktop, useIsMobile, useRecords, useToast, useUploadFlow };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map