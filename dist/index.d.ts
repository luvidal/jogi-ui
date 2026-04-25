import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React$1 from 'react';
import React__default, { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEventHandler } from 'react';
import { LucideProps } from 'lucide-react';

declare const useIsMobile: () => boolean;
declare const useIsDesktop: () => boolean;

type ToastType = 'success' | 'error' | 'warning' | 'info';
interface ToastData {
    id: string;
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}
declare const ToastContainer: () => react_jsx_runtime.JSX.Element | null;

interface ToastContextType {
    toasts: ToastData[];
    addToast: (toast: Omit<ToastData, 'id'>) => string;
    removeToast: (id: string) => void;
    clearToasts: () => void;
    showSuccess: (message: string, options?: Partial<ToastData>) => string;
    showError: (message: string, options?: Partial<ToastData>) => string;
    showWarning: (message: string, options?: Partial<ToastData>) => string;
    showInfo: (message: string, options?: Partial<ToastData>) => string;
}
declare const useToast: () => ToastContextType;
declare const ToastProvider: ({ children }: {
    children: React__default.ReactNode;
}) => react_jsx_runtime.JSX.Element;

/**
 * Factory that creates a dialog context (Provider + hook) from a dialog component.
 *
 * All dialog contexts follow the same pattern:
 * - Provider holds state (options + resolve promise)
 * - Trigger function opens the dialog and returns a promise
 * - Dialog component receives { state, onDone }
 *
 * @param Dialog - Component that renders the dialog UI
 * @param name - Hook name for error messages (e.g. "useConfirm")
 * @param normalizeInput - Optional function to normalize shorthand input (e.g. string → options object)
 */
declare function createDialogContext<TOptions extends object, TResult>(Dialog: React__default.ComponentType<{
    state: TOptions & {
        resolve: (value: TResult) => void;
    };
    onDone: () => void;
}>, name: string, normalizeInput?: (input: any) => TOptions): readonly [({ children }: {
    children: React__default.ReactNode;
}) => React__default.FunctionComponentElement<React__default.ProviderProps<{
    trigger: (options: TOptions | string) => Promise<TResult>;
} | undefined>>, () => (options: TOptions | string) => Promise<TResult>];

/** Section definition for the Accordion component */
interface Section {
    /** Unique section ID */
    id: string;
    /** Section title */
    title: string;
    /** Icon name from lucide-react */
    icon: string;
    /** Optional subtitle (e.g., "3 documentos") */
    subtitle?: string;
    /** Optional number prefix (e.g., "I", "II") */
    number?: string;
    /** Content to render when expanded */
    content: ReactNode;
    /** Color scheme for header. Falls back to neutral gray if not provided. */
    colors?: {
        bg: string;
        text: string;
        iconBg: string;
    };
    /** Override the default content wrapper classes (replaces default padding + bg) */
    contentClassName?: string;
}
interface CardItem {
    id: string;
    title: string | ReactNode;
    subtitle?: string | ReactNode;
    /** Icon name or ReactNode for custom rendering (e.g. ProgressRing) */
    icon?: string | ReactNode;
    /** Right-side element (e.g. ProgressRing, ChevronRight) */
    right?: ReactNode;
}

interface Props$h extends LucideProps {
    name?: string;
}
declare const Icon: ({ name, ...props }: Props$h) => react_jsx_runtime.JSX.Element;

interface ButtonProps$1 extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: string;
    text?: string;
    /** Shows inline spinner and disables interaction */
    loading?: boolean;
}
declare const Button: ({ icon, text, loading, className, ...props }: ButtonProps$1) => react_jsx_runtime.JSX.Element;

interface Props$g {
    label: string;
    checked: boolean;
    className?: string;
    onChange: (checked: boolean) => void;
}
declare const Checkbox: ({ label, checked, className, onChange }: Props$g) => react_jsx_runtime.JSX.Element;

interface Props$f {
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    visible?: boolean;
}
declare const ColorPicker: ({ label, value, onChange, className, visible }: Props$f) => react_jsx_runtime.JSX.Element;

interface FieldWrapperProps {
    label?: string;
    /** Optional tooltip — renders a "?" icon next to the label */
    tooltip?: string;
    className?: string;
    visible?: boolean;
    children: ReactNode;
}
declare function FieldWrapper({ label, tooltip, className, visible, children }: FieldWrapperProps): react_jsx_runtime.JSX.Element | null;

interface Props$e<T extends string = string> {
    label: string;
    value: T;
    selected: T;
    onChange?: (value: T) => void;
    className?: string;
}
declare const Radio: <T extends string = string>({ label, value, selected, onChange, className }: Props$e<T>) => react_jsx_runtime.JSX.Element;

interface Props$d {
    label?: string;
    value: string;
    placeholder?: string;
    options: {
        label: string;
        value: string;
    }[];
    className?: string;
    tooltip?: string;
    onChange: (value: string) => void;
}
declare const Select: ({ label, value, placeholder, options, className, onChange }: Props$d) => react_jsx_runtime.JSX.Element;

interface ComputedFieldProps {
    label: string;
    value: string;
    suffix?: string;
    className?: string;
}
declare const ComputedField: ({ label, value, suffix, className }: ComputedFieldProps) => react_jsx_runtime.JSX.Element;

interface NumberFieldProps {
    label: string;
    value: number | undefined;
    onChange?: (v: number | undefined) => void;
    suffix?: string;
    step?: string;
    readOnly?: boolean;
}
declare const NumberField: ({ label, value, onChange, suffix, step, readOnly }: NumberFieldProps) => react_jsx_runtime.JSX.Element;

interface Props$c {
    label?: string;
    tooltip?: string;
    value?: string;
    onChange?: (v: string) => void;
    readOnly?: boolean;
    placeholder?: string;
    className?: string;
    visible?: boolean;
    fullWidth?: boolean;
    icon?: string;
    onIconClick?: () => void;
}
type TextFieldProps = Props$c & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'readOnly'>;
declare const TextField: ({ label, tooltip, value, onChange, readOnly, placeholder, className, visible, fullWidth, icon, onIconClick, ...rest }: TextFieldProps) => react_jsx_runtime.JSX.Element;

interface SelectFieldProps {
    label: string;
    value: string | undefined;
    options: {
        label: string;
        value: string;
    }[];
    onChange?: (v: string | undefined) => void;
    readOnly?: boolean;
}
declare const SelectField: ({ label, value, options, onChange, readOnly }: SelectFieldProps) => react_jsx_runtime.JSX.Element;

interface Props$b {
    label?: string;
    value?: string | null;
    onChange?: (url: string | null) => void;
    onUpload?: (file: File) => Promise<string>;
    className?: string;
    visible?: boolean;
    maxFileSizeMB?: number;
    compressedSizeMB?: number;
    compressedMaxDim?: number;
}
declare const LogoUpload: ({ label, value, onChange, onUpload, className, visible, maxFileSizeMB, compressedSizeMB, compressedMaxDim, }: Props$b) => react_jsx_runtime.JSX.Element;

interface RTFEditorProps {
    label?: string;
    value: string;
    onChange: (content: string) => void;
    tooltip?: string;
    className?: string;
    editorClassName?: string;
    style?: React.CSSProperties;
    stretch?: boolean;
    /** Resolver for the "insert link" toolbar button. Return the URL, or null/undefined to cancel. Defaults to window.prompt. */
    onInsertLink?: () => Promise<string | null | undefined> | string | null | undefined;
}
declare const RTFEditor: ({ value, label, onChange, className, tooltip, editorClassName, style, stretch, onInsertLink, }: RTFEditorProps) => react_jsx_runtime.JSX.Element;

type ModalSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs';
interface Props$a {
    title?: string;
    icon?: string;
    children?: React.ReactNode;
    onClose: () => void;
    size?: ModalSize;
    headerActions?: React.ReactNode;
}
declare const Modal: ({ title, icon, children, onClose, size: sizeProp, headerActions }: Props$a) => react_jsx_runtime.JSX.Element;

interface Props$9 {
    open: boolean;
    width?: string;
    className?: string;
    children: React.ReactNode;
}
declare const ModalOverlayPanel: ({ open, width, className, children }: Props$9) => react_jsx_runtime.JSX.Element | null;

interface ToolbarProps {
    position?: 'left' | 'right';
    offset?: string;
    variant?: 'transparent' | 'dark';
    className?: string;
    children: React.ReactNode;
}
declare const ModalToolbar: {
    ({ position, offset, variant, className, children }: ToolbarProps): react_jsx_runtime.JSX.Element;
    Group: ({ children, className }: {
        children: React.ReactNode;
        className?: string;
    }) => react_jsx_runtime.JSX.Element;
    Divider: () => react_jsx_runtime.JSX.Element;
};

interface Props$8 {
    footer: React.ReactNode;
    className?: string;
    children: React.ReactNode;
}
declare const ModalFormLayout: ({ footer, className, children }: Props$8) => react_jsx_runtime.JSX.Element;

type TooltipProps = {
    text: string;
};
declare const Tooltip: ({ text }: TooltipProps) => react_jsx_runtime.JSX.Element;

interface LabelProps {
    /** The text of the label */
    text: string;
    /** Optional tooltip — renders a "?" icon that opens a tooltip on click */
    tooltip?: string;
    /** Extra classes appended after the defaults */
    className?: string;
}
declare const Label: ({ text, tooltip, className }: LabelProps) => react_jsx_runtime.JSX.Element;

type Props$7 = {
    label: string;
    first?: boolean;
    className?: string;
};
declare function SectionSeparator({ label, first, className }: Props$7): react_jsx_runtime.JSX.Element;

interface Props$6 {
    className?: string;
    variant?: 'light' | 'dark';
}
/** Shimmer placeholder block for loading states. Uses theme-colored sweep animation. */
declare const Skeleton: {
    ({ className, variant }: Props$6): react_jsx_runtime.JSX.Element;
    Card({ variant, compact }: {
        variant?: "light" | "dark";
        compact?: boolean;
    }): react_jsx_runtime.JSX.Element;
    List({ count, variant, compact, className }: {
        count?: number;
        variant?: "light" | "dark";
        compact?: boolean;
        className?: string;
    }): react_jsx_runtime.JSX.Element;
    FileGrid({ count }: {
        count?: number;
    }): react_jsx_runtime.JSX.Element;
    DocGrid({ count, variant }: {
        count?: number;
        variant?: "light" | "dark";
    }): react_jsx_runtime.JSX.Element;
    StatCard(): react_jsx_runtime.JSX.Element;
    StatRow({ className }: {
        className?: string;
    }): react_jsx_runtime.JSX.Element;
    DashCard({ colSpan }: {
        colSpan?: number;
    }): react_jsx_runtime.JSX.Element;
    Form({ rows, variant }: {
        rows?: number;
        variant?: "light" | "dark";
    }): react_jsx_runtime.JSX.Element;
    Activity({ variant }: {
        variant?: "light" | "dark";
    }): react_jsx_runtime.JSX.Element;
    Preview({ variant }: {
        variant?: "light" | "dark";
    }): react_jsx_runtime.JSX.Element;
    Table({ rows, variant }: {
        rows?: number;
        variant?: "light" | "dark";
    }): react_jsx_runtime.JSX.Element;
    Welcome({ className }: {
        className?: string;
    }): react_jsx_runtime.JSX.Element;
    DetailBar({ variant, icon, }: {
        variant?: "light" | "dark";
        icon?: boolean;
    }): react_jsx_runtime.JSX.Element;
};

interface Props$5 {
    title?: string;
    description?: string;
    className?: string;
    variant?: 'light' | 'dark';
    /** Lucide icon name or custom ReactNode to display instead of the default box illustration */
    icon?: string | ReactNode;
    /** Optional action button */
    action?: {
        label: string;
        onClick: () => void;
        /** Lucide icon name shown before the label */
        icon?: string;
        /** Shows a spinner and disables the button */
        loading?: boolean;
    };
}
declare const EmptyState: ({ title, description, className, variant, icon, action }: Props$5) => react_jsx_runtime.JSX.Element;

interface ConfirmOptions {
    title?: string;
    message: string;
    variant?: 'danger' | 'warning' | 'info';
}
interface ConfirmState extends ConfirmOptions {
    resolve: (value: boolean) => void;
}
declare const ConfirmDialog: ({ state, onDone }: {
    state: ConfirmState;
    onDone: () => void;
}) => React$1.ReactPortal;

interface PromptOptions {
    title?: string;
    message: string;
    icon?: string;
    variant?: 'danger' | 'warning' | 'info';
    defaultValue?: string;
}
interface PromptState extends PromptOptions {
    resolve: (value: string | null) => void;
}
declare const PromptDialog: ({ state, onDone }: {
    state: PromptState;
    onDone: () => void;
}) => React$1.ReactPortal;

type MenuItem = {
    icon?: string;
    label?: string;
    action?: () => void;
    type?: 'separator';
    disabled?: boolean;
    variant?: 'default' | 'amber' | 'red';
};
type Props$4 = {
    open: boolean;
    position: {
        x: number;
        y: number;
    };
    items: MenuItem[];
    onClose: () => void;
};
declare const ContextMenu: ({ open, position, items, onClose }: Props$4) => React$1.ReactPortal | null;

interface Props$3 {
    items: CardItem[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    /** Set of checked item IDs for multi-select mode */
    checkedIds?: Set<string>;
    /** Callback when an item's checkbox is toggled */
    onCheck?: (id: string, checked: boolean) => void;
}
declare function CardList({ items, selectedId, onSelect, checkedIds, onCheck }: Props$3): react_jsx_runtime.JSX.Element | null;

interface MasterDetailProps {
    /** Page title */
    title: string;
    /** Page icon name */
    icon?: string;
    /** The list/master panel content */
    list: ReactNode;
    /** The detail panel content (shown when item selected) */
    detail: ReactNode | null;
    /** Whether an item is currently selected */
    hasSelection: boolean;
    /** Width of sidebar on desktop (default: 280px) */
    sidebarWidth?: number;
    /** Action buttons shown in sidebar title area (desktop) - e.g., "Add new" button */
    actions?: ReactNode;
    /** Header content for the sidebar (filter, sort, etc) - only shown on desktop */
    sidebarHeader?: ReactNode;
    /** Footer content for the sidebar (paginator, etc) - only shown on desktop */
    sidebarFooter?: ReactNode;
    /** Toolbar content for mobile header */
    mobileTbar?: ReactNode;
    /** Extension content for mobile (sort options, etc) */
    mobileExtension?: ReactNode;
    /** Items array for auto-selection. Must have 'id' field. First item auto-selected on desktop. */
    items?: readonly {
        id: string | number;
    }[];
    /** Called when an item is auto-selected (first item on desktop load) */
    onSelect?: (id: string | number) => void;
    /** Detail loading placeholder */
    detailLoading?: ReactNode;
}
/**
 * Responsive master-detail layout component.
 *
 * Desktop (≥1024px landscape): Full left-to-right layout
 *   - Sidebar with title, controls, list, paginator
 *   - Detail panel with rounded corners
 *
 * Mobile/Tablet: Traditional header + full-page switching
 *
 * Auto-selection: Pass `items` and `onSelect` to automatically select the first
 * item on desktop. The detail panel should never be empty if data exists.
 */
declare function MasterDetail({ title, icon, list, detail, hasSelection, sidebarWidth, actions, sidebarHeader, sidebarFooter, mobileTbar, mobileExtension, items, onSelect, detailLoading, }: MasterDetailProps): react_jsx_runtime.JSX.Element;

type Color = 'default' | 'success' | 'warning' | 'danger';
interface Props$2 {
    label: string;
    value: string | number;
    icon?: string;
    subtitle?: string;
    color?: Color;
}
declare const StatCard: ({ label, value, icon, subtitle, color }: Props$2) => react_jsx_runtime.JSX.Element;

interface SidebarFilterProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}
/** Compact filter input for dark sidebar */
declare function SidebarFilter({ value, onChange, placeholder }: SidebarFilterProps): react_jsx_runtime.JSX.Element;
interface SidebarSortProps {
    options: {
        value: string;
        label: string;
    }[];
    value: string;
    onChange: (value: string) => void;
    direction: 'asc' | 'desc';
    onDirectionChange: (dir: 'asc' | 'desc') => void;
}
/** Compact sort dropdown for dark sidebar */
declare function SidebarSort({ options, value, onChange, direction, onDirectionChange }: SidebarSortProps): react_jsx_runtime.JSX.Element;
interface SidebarPaginatorProps {
    page: number;
    setPage: (page: number) => void;
    hasNext: boolean;
}
/** Compact paginator for dark sidebar - auto-hides when only one page */
declare function SidebarPaginator({ page, setPage, hasNext }: SidebarPaginatorProps): react_jsx_runtime.JSX.Element | null;

interface DetailBarProps {
    title: string | ReactNode;
    subtitle?: string | ReactNode;
    /** Static label shown before the subtitle (e.g. "Cliente:", "Analista:") */
    subtitlePrefix?: string;
    email?: string;
    icon?: string;
    toolbar?: ReactNode;
    /** Extra content rendered inline after the subtitle (e.g. credit badge) */
    extra?: ReactNode;
    /** 'light' = detail header with own bg-surface-1 + icon chip + decorative bg icon.
     *  'dark'  = chrome header for AppShell list panels (no own bg, parent supplies).
     *  With onBack (mobile drill-in), dark variant switches to a flat bg-surface-2 with two-row layout. */
    variant?: 'light' | 'dark';
    /** When provided, title becomes editable inline */
    onRename?: (value: string) => void;
    /** When provided, subtitle becomes a clickable email link */
    onEmail?: () => void;
    /** When provided, renders a ToolBack button and switches dark variant to the two-row mobile layout */
    onBack?: () => void;
}
declare function DetailBar({ title, subtitle, email, icon, toolbar, extra, subtitlePrefix, variant, onRename, onEmail, onBack }: DetailBarProps): react_jsx_runtime.JSX.Element;

interface PropsCard {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    colSpan?: number;
    /**
     * Visual variant.
     * - `'light'` (default, legacy): paper-white surface with theme-colored title/subtitle.
     * - `'dark'`: token-driven surface for dark-mode dashboards. `bg-surface-1` with
     *   an `edge-subtle` border; title/subtitle read from `ink-*` tokens.
     *
     * `light` preserved for any legacy consumer that has not yet migrated.
     */
    variant?: 'light' | 'dark';
}
declare const Card: ({ title, subtitle, children, colSpan, variant }: PropsCard) => react_jsx_runtime.JSX.Element;

interface Props$1 extends AnchorHTMLAttributes<HTMLAnchorElement> {
    children: React.ReactNode;
}
declare const Anchor: ({ children, className, onClick, ...props }: Props$1) => react_jsx_runtime.JSX.Element;

interface Props {
    progress: number;
    size?: number;
    /** Light variant for dark backgrounds (sidebar) */
    light?: boolean;
}
declare const ProgressRing: ({ progress, size, light }: Props) => react_jsx_runtime.JSX.Element;

interface DetailContentProps {
    children: ReactNode;
    className?: string;
}
declare function DetailContent({ children, className }: DetailContentProps): react_jsx_runtime.JSX.Element;

declare const DragHere$1: () => react_jsx_runtime.JSX.Element | null;

interface AccordionProps {
    /** Array of sections to render */
    sections: Section[];
    /** Force all sections expanded (useful for PDF generation) */
    forceExpanded?: boolean;
    /** Persist open section in localStorage. Default true. */
    rememberOpen?: boolean;
    /** Explicit localStorage key. Auto-generated from section IDs if omitted. */
    storageKey?: string;
    /** Called when the open section changes (including on mount restore) */
    onChange?: (sectionId: string | null) => void;
}
/**
 * DIRECTIVE: Internal state memory — Accordion MUST remember the open section
 * across unmounts via localStorage (when rememberOpen is true, default).
 * On mount, the stored section is restored internally. If onChange is provided,
 * it is notified of the restored value before first paint.
 * This behavior is a contract — do NOT remove or weaken it.
 *
 * Colors are provided per section via `section.colors`. Falls back to neutral gray.
 * Only one section can be open at a time (mutual exclusivity).
 */
declare const Accordion: ({ sections, forceExpanded, rememberOpen, storageKey, onChange }: AccordionProps) => react_jsx_runtime.JSX.Element;

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
    icon: string;
    label: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    active?: boolean;
    variant?: 'dark' | 'light';
    /** Color accent for icon-only floating toolbar buttons (e.g. destructive actions) */
    color?: 'default' | 'amber' | 'red';
}
declare const ToolbarButton: ({ icon, label, onClick, active, variant, color, disabled, ...rest }: ButtonProps) => react_jsx_runtime.JSX.Element;

interface ToolBackProps {
    icon: string;
    label?: string;
    onClick: () => void;
    variant?: 'dark' | 'light';
}
declare const ToolBack: ({ icon, label, onClick, variant }: ToolBackProps) => react_jsx_runtime.JSX.Element;

interface EditableTitleProps {
    value: string;
    onChange?: (value: string) => void;
    className?: string;
}
declare const EditableTitle: ({ value, onChange, className }: EditableTitleProps) => react_jsx_runtime.JSX.Element;

interface EmailLinkProps {
    label: string;
    email?: string;
    onClick?: () => void;
    className?: string;
}
declare const EmailLink: ({ label, email, onClick, className }: EmailLinkProps) => react_jsx_runtime.JSX.Element;

interface ButtonGroupProps {
    children?: React.ReactNode;
    className?: string;
    /** Visual variant — dark for teal/colored headers, light for white backgrounds */
    variant?: 'dark' | 'light';
}
declare const ButtonGroup: ({ children, className, variant }: ButtonGroupProps) => react_jsx_runtime.JSX.Element;

interface Tab {
    id: string;
    label: string;
    icon?: string;
}

type TabSize = 'xs' | 'sm' | 'md';
interface TabsProps {
    tabs: Tab[];
    activeTab?: string;
    onChange?: (tabId: string) => void;
    onRefresh?: (tabId: string) => void;
    storageKey?: string;
    /**
     * Content below the tab bar. Pass a function to receive the live active id
     * (including the localStorage-restored value on mount) — this is the only
     * way to render panels in sync with the tab highlight without the consumer
     * duplicating state.
     */
    children?: ReactNode | ((activeId: string) => ReactNode);
    className?: string;
    suffix?: (tabId: string) => string | undefined;
    dark?: boolean;
    size?: TabSize;
}
/**
 * DIRECTIVE: Internal state memory — Tabs MUST remember the selected tab
 * across unmounts via localStorage. Both controlled (activeTab prop) and
 * uncontrolled modes persist. On mount, the stored value is restored:
 * - Uncontrolled: restored internally (useState initializer)
 * - Controlled: parent notified via onChange before first paint
 * This behavior is a contract — do NOT remove or weaken it.
 */
declare const Tabs: ({ tabs, activeTab: controlledActive, onChange, onRefresh, storageKey: explicitStorageKey, children, className, suffix, dark, size }: TabsProps) => react_jsx_runtime.JSX.Element | null;

interface PanelProps {
    open: boolean;
    onToggle: (open: boolean) => void;
    width?: number;
    /** Lucide icon name, or ReactNode for custom icon content */
    icon?: string | ReactNode;
    title?: string;
    subtitle?: string;
    children: ReactNode;
}
/**
 * Panel - Collapsible sidebar panel
 *
 * Owns the chrome: bg, border, 3-dot toggle handle, width/opacity animation,
 * icon container, title, and subtitle. Content is passed as children.
 */
declare const Panel: ({ open, onToggle, width, icon, title, subtitle, children }: PanelProps) => react_jsx_runtime.JSX.Element;

type TablePanelProps = {
    title: string;
    icon: string;
    iconColor?: string;
    defaultOpen?: boolean;
    maxHeight?: number;
    data: Array<{
        label: string;
        value: string | React__default.ReactNode;
    }>;
    emptyContent?: React__default.ReactNode;
};
declare const TablePanel: ({ title, icon, iconColor, defaultOpen, maxHeight, data, emptyContent, }: TablePanelProps) => react_jsx_runtime.JSX.Element;

interface ScrollProps {
    children?: React.ReactNode;
    className?: string;
    grid?: boolean;
}
declare const Scroll: ({ children, className, grid }: ScrollProps) => react_jsx_runtime.JSX.Element;

interface ContainerProps {
    title?: string;
    icon?: string;
    children: React__default.ReactNode;
}
declare const Container: ({ title, icon, children }: ContainerProps) => react_jsx_runtime.JSX.Element;

type Size$1 = 'xs' | 'sm' | 'md' | 'lg';
interface SpinnerProps {
    size?: Size$1;
    message?: string;
}
declare function Spinner({ size, message }: SpinnerProps): react_jsx_runtime.JSX.Element;

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
interface DragHereProps {
    size?: Size;
}
declare function DragHere({ size }: DragHereProps): react_jsx_runtime.JSX.Element;

interface PillTagProps {
    children: React.ReactNode;
    grip?: boolean;
}
declare const PillTag: ({ children, grip }: PillTagProps) => react_jsx_runtime.JSX.Element;

interface SortOption {
    value: string;
    label: string;
}
interface UseRecordsOptions {
    endpoint: string;
    sortList: SortOption[];
    /** Function to fetch data — receives endpoint + payload, returns data array */
    fetchFn: (endpoint: string, payload: Record<string, any>) => Promise<any>;
    /** Error handler for failed fetches */
    onError?: (error: unknown, context: {
        module: string;
        action: string;
    }) => void;
    /** Function to extract ID from a record (default: item.id) */
    getId?: (item: any) => string;
    staticParams?: Record<string, any>;
    filterId?: string;
    limit?: number;
    initialState?: {
        page?: number;
        search?: string;
        sortBy?: string;
        sortDir?: 'asc' | 'desc';
    };
}
interface RefreshActions<T> {
    fetch: () => void;
    patch: (id: string, changes: Partial<T>) => void;
    remove: (id: string) => void;
}
interface UseRecordsReturn<T> {
    data: T[];
    loading: boolean;
    hasNext: boolean;
    refresh: RefreshActions<T>;
    page: number;
    setPage: (p: number) => void;
    search: string;
    setSearch: (s: string) => void;
    sortBy: string;
    setSortBy: (s: string) => void;
    thenBy: string;
    setThenBy: (s: string) => void;
    sortDir: 'asc' | 'desc';
    setSortDir: (d: 'asc' | 'desc') => void;
    thenDir: 'asc' | 'desc';
    setThenDir: (d: 'asc' | 'desc') => void;
    sortList: SortOption[];
}
declare function useRecords<T = any>({ endpoint, sortList, fetchFn, onError, getId, staticParams, filterId, limit, initialState, }: UseRecordsOptions): UseRecordsReturn<T>;

interface UseMultiSelectOptions {
    /** Array of all visible item IDs */
    itemIds: string[];
    /** Called with array of checked IDs when user confirms bulk delete */
    onBulkDelete: (ids: string[]) => void | Promise<void>;
    /** Called with array of checked IDs when user clicks bulk mark-as-read (optional, notifications only) */
    onBulkRead?: (ids: string[]) => void | Promise<void>;
}
interface MultiSelectState {
    /** Whether multi-select mode is active */
    selectMode: boolean;
    /** Set of currently checked IDs — pass to CardList as checkedIds when selectMode is true */
    checkedIds: Set<string>;
    /** Whether all visible items are currently checked */
    allChecked: boolean;
    /** Whether the Seleccionar button should be visible (items exist) */
    showButton: boolean;
    /** Whether bulk read action is available (onBulkRead was provided) */
    hasBulkRead: boolean;
    /** Callback for CardList onCheck */
    handleCheck: (id: string, checked: boolean) => void;
    /** Toggle select mode on/off */
    toggleSelectMode: () => void;
    /** Toggle "select all" / "deselect all" over visible items */
    handleSelectAll: () => void;
    /** Fire bulk delete with currently checked IDs */
    handleBulkDelete: () => void;
    /** Fire bulk read with currently checked IDs (no-op when onBulkRead not provided) */
    handleBulkRead: () => void;
}
declare function useMultiSelect({ itemIds, onBulkDelete, onBulkRead }: UseMultiSelectOptions): MultiSelectState;

interface FenceRect {
    left: number;
    top: number;
    width: number;
    height: number;
}
interface UseFenceSelectOptions<T> {
    /** Ref map of item id → element. Caller populates via `onEl` on each tile. */
    elements: React.MutableRefObject<Record<string, HTMLElement | null>>;
    /** Current list of items (used to iterate ids on mousemove). */
    items: T[];
    /** Extract an id from an item. */
    getId: (item: T) => string;
    /** Currently selected ids — read-only snapshot for ctrl/meta additive drags. */
    selectedIds: Set<string>;
    /** Push a new selection set (called on every mousemove during fence). */
    setSelected: (next: Set<string>) => void;
}
interface UseFenceSelectResult {
    fencing: boolean;
    fenceRect: FenceRect | null;
    /** True for ~100ms after the fence ended if it actually moved (>5px). Lets
     *  callers suppress the background click that would otherwise clear selection. */
    justFencedRef: React.MutableRefObject<boolean>;
    /** Call from onMouseDown on the background. Handles modifier keys + initial rect. */
    beginFence: (e: React.MouseEvent) => void;
}
declare function useFenceSelect<T>({ elements, items, getId, selectedIds, setSelected }: UseFenceSelectOptions<T>): UseFenceSelectResult;

interface MultiselectToolbarProps {
    state: MultiSelectState;
    /** 'secondary' = desktop sidebar controls bar · 'mobile' = mobile header toolbar */
    variant: 'secondary' | 'mobile';
}
/**
 * Renders the multi-select toolbar UI.
 * Pair with `useMultiSelect` to get state + handlers.
 */
declare function MultiselectToolbar({ state, variant }: MultiselectToolbarProps): react_jsx_runtime.JSX.Element | null;

/** Captured state from a DataTransfer — safe to use after the event handler returns */
type CapturedTransfer = {
    entries: FileSystemEntry[];
} | {
    files: File[];
};
/**
 * Synchronously capture entries/files from a DataTransfer.
 * MUST be called synchronously within the drop event handler,
 * because browsers clear DataTransfer after the handler returns.
 */
declare function captureDataTransfer(dt: DataTransfer): CapturedTransfer;
/**
 * Resolve a captured transfer into a flat list of files.
 * Recursively reads folders. Safe to call asynchronously.
 */
declare function resolveFiles(captured: CapturedTransfer): Promise<File[]>;

/**
 * Opens a native file chooser programmatically.
 * Creates a hidden file input and triggers click.
 */
declare function openFilePicker(opts: {
    accept?: string;
    onFiles: (files: FileList) => void;
}): void;

type FileStatus = 'queued' | 'compressing' | 'uploading' | 'analyzing' | 'detected' | 'linking' | 'done' | 'error';
interface FileUploadItem {
    id: string;
    file: File;
    filename: string;
    status: FileStatus;
    progress: number;
    detectedTypes: string[];
    detectedCount: number;
    error?: string;
    /** true for items created from multi-doc PDF expansion */
    isExpanded?: boolean;
}
interface UploadFlowLabels {
    /** Fallback label for expanded multi-doc cards (receives 1-based index) */
    documentN?: (index: number) => string;
    unclassifiedType?: string;
    unclassifiedTitle?: string;
    /** Receives short filename */
    unclassifiedMessage?: (name: string) => string;
    unknownError?: string;
    /** Receives short filename */
    uploadErrorMessage?: (name: string) => string;
    /** Receives detected count */
    documentsUploaded?: (count: number) => string;
    partialUploadTitle?: string;
    completeUploadTitle?: string;
    /** Receives error count */
    filesWithError?: (count: number) => string;
    successSuffix?: string;
}
interface UploadToast {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
}
interface UploadFlowOptions {
    /** Upload function — receives file + params, returns response object */
    uploadFn: (file: File, params: Record<string, string>) => Promise<any>;
    /** Toast callback for notifications */
    onToast?: (toast: UploadToast) => void;
    /** Request ID to attach uploads to */
    requestId?: string;
    requestLabel?: string;
    role?: 'client' | 'analyst';
    /** Called after all uploads settle and display delay */
    onComplete?: () => void;
    /** Concurrency limit (default: 3) */
    concurrency?: number;
    /** UI labels — defaults to English */
    labels?: UploadFlowLabels;
}
interface UploadSummary {
    total: number;
    done: number;
    errors: number;
}
declare function useUploadFlow(options: UploadFlowOptions): {
    active: boolean;
    items: FileUploadItem[];
    summary: UploadSummary;
    processFiles: (fileList: FileList | File[], uploadOpts?: {
        docTypeId?: string;
        requestId?: string;
    }) => Promise<void>;
    processDataTransfer: (captured: CapturedTransfer, uploadOpts?: {
        docTypeId?: string;
        requestId?: string;
    }) => Promise<void>;
};

interface UploadCardsLabels {
    queued?: string;
    compressing?: string;
    uploading?: string;
    analyzing?: string;
    done?: string;
    /** Receives request label or undefined */
    linkingLabel?: (requestLabel?: string, role?: string) => string;
    /** Receives types + count */
    detectedLabel?: (types: string[], count: number) => string;
    /** Receives items + summary */
    headerLabel?: (items: FileUploadItem[], summary: {
        total: number;
        done: number;
        errors: number;
    }) => string;
}
interface UploadCardsProps {
    items: FileUploadItem[];
    summary: {
        total: number;
        done: number;
        errors: number;
    };
    requestLabel?: string;
    role?: 'client' | 'analyst';
    labels?: UploadCardsLabels;
}
declare function UploadCards({ items, summary, requestLabel, role, labels: userLabels }: UploadCardsProps): react_jsx_runtime.JSX.Element;

export { Accordion, Anchor, Button, ButtonGroup, type CapturedTransfer, Card, type CardItem, CardList, Checkbox, ColorPicker, ComputedField, ConfirmDialog as Confirm, type ConfirmOptions, Container, ContextMenu, DetailBar, DetailContent, DragHere$1 as DragHereHint, DragHere as DragHereOverlay, EditableTitle, EmailLink, EmptyState, type FenceRect, FieldWrapper, type FileStatus, type FileUploadItem, Icon, Label, LogoUpload, MasterDetail, Modal, ModalFormLayout, ModalOverlayPanel, ModalToolbar, type MultiSelectState, MultiselectToolbar, NumberField, Panel, PillTag, ProgressRing, PromptDialog as Prompt, type PromptOptions, RTFEditor, Radio, type RefreshActions, Scroll, type Section, SectionSeparator, Select, SelectField, SidebarFilter, SidebarPaginator, SidebarSort, Skeleton, type SortOption, Spinner, StatCard, TablePanel, Tabs, TextField, ToastContainer, type ToastData, ToastProvider, ToolBack, ToolbarButton, Tooltip, UploadCards, type UploadCardsLabels, type UploadFlowLabels, type UploadFlowOptions, type UploadSummary, type UploadToast, type UseFenceSelectOptions, type UseFenceSelectResult, type UseRecordsOptions, type UseRecordsReturn, captureDataTransfer, createDialogContext, openFilePicker, resolveFiles, useFenceSelect, useIsDesktop, useIsMobile, useMultiSelect, useRecords, useToast, useUploadFlow };
