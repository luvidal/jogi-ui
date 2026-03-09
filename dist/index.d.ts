import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React$1 from 'react';
import React__default, { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEventHandler } from 'react';
import { LucideProps } from 'lucide-react';

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
interface ToastProps {
    toast: ToastData;
    onClose: (id: string) => void;
}
declare const Toast: ({ toast, onClose }: ToastProps) => react_jsx_runtime.JSX.Element;

declare const ToastContainer: () => react_jsx_runtime.JSX.Element | null;

declare const useIsMobile: () => boolean;
declare const useIsDesktop: () => boolean;

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

interface Props$d extends LucideProps {
    name?: string;
}
declare const Icon: ({ name, ...props }: Props$d) => react_jsx_runtime.JSX.Element;

type Variant = 'primary' | 'glass' | 'danger' | 'outline' | 'ghost';
type Size$2 = 'sm' | 'md' | 'lg';
interface ButtonProps$1 extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: string;
    text?: string;
    variant?: Variant;
    size?: Size$2;
    active?: boolean;
    /** Shows inline spinner and disables interaction */
    loading?: boolean;
}
declare const Button: ({ icon, text, variant, size, active, loading, className, ...props }: ButtonProps$1) => react_jsx_runtime.JSX.Element;

interface Props$c {
    label: string;
    checked: boolean;
    className?: string;
    onChange: (checked: boolean) => void;
}
declare const Checkbox: ({ label, checked, className, onChange }: Props$c) => react_jsx_runtime.JSX.Element;

interface Props$b {
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    visible?: boolean;
}
declare const ColorPicker: ({ label, value, onChange, className, visible }: Props$b) => react_jsx_runtime.JSX.Element;

interface FieldWrapperProps {
    label?: string;
    tooltip?: string;
    className?: string;
    visible?: boolean;
    children: ReactNode;
}
declare function FieldWrapper({ label, tooltip, className, visible, children }: FieldWrapperProps): react_jsx_runtime.JSX.Element | null;

interface Props$a {
    label?: string;
    readOnly?: boolean;
    onChange?: (value: string) => void;
    value?: string;
    className?: string;
    tooltip?: string;
    visible?: boolean;
}
type InputProps = Props$a & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'readOnly'>;
declare const Input: ({ label, className, readOnly, onChange, value, tooltip, visible, ...rest }: InputProps) => react_jsx_runtime.JSX.Element;

interface Props$9<T extends string = string> {
    label: string;
    value: T;
    selected: T;
    onChange?: (value: T) => void;
    className?: string;
}
declare const Radio: <T extends string = string>({ label, value, selected, onChange, className }: Props$9<T>) => react_jsx_runtime.JSX.Element;

interface Props$8 {
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
declare const Select: ({ label, value, placeholder, options, className, onChange, tooltip }: Props$8) => react_jsx_runtime.JSX.Element;

type ModalSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs';
interface Props$7 {
    title?: string;
    icon?: string;
    children?: React.ReactNode;
    onClose: () => void;
    className?: string;
    size?: ModalSize;
    headerActions?: React.ReactNode;
    resizable?: boolean;
}
declare const Modal: ({ title, icon, children, onClose, className, size: sizeProp, headerActions, resizable }: Props$7) => react_jsx_runtime.JSX.Element;

type TooltipProps = {
    text: string;
    icon?: string;
    iconColor?: string;
    className?: string;
    html?: boolean;
};
declare const Tooltip: ({ text, icon, iconColor, className, html }: TooltipProps) => react_jsx_runtime.JSX.Element;

interface Props$6 {
    className?: string;
}
/** Shimmer placeholder block for loading states. Uses theme-colored sweep animation. */
declare const Skeleton: {
    ({ className }: Props$6): react_jsx_runtime.JSX.Element;
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
    DocGrid({ count }: {
        count?: number;
    }): react_jsx_runtime.JSX.Element;
    StatCard(): react_jsx_runtime.JSX.Element;
    StatRow({ className }: {
        className?: string;
    }): react_jsx_runtime.JSX.Element;
    DashCard({ colSpan }: {
        colSpan?: number;
    }): react_jsx_runtime.JSX.Element;
    Form({ rows }: {
        rows?: number;
    }): react_jsx_runtime.JSX.Element;
    Activity(): react_jsx_runtime.JSX.Element;
    Preview(): react_jsx_runtime.JSX.Element;
    Table({ rows }: {
        rows?: number;
    }): react_jsx_runtime.JSX.Element;
    Welcome({ className }: {
        className?: string;
    }): react_jsx_runtime.JSX.Element;
};

interface Props$5 {
    title?: string;
    description?: string;
    className?: string;
    variant?: 'light' | 'dark';
    /** Lucide icon name to display instead of the default box illustration */
    icon?: string;
    /** Optional action button */
    action?: {
        label: string;
        onClick: () => void;
    };
}
declare const EmptyState: ({ title, description, className, variant, icon, action }: Props$5) => react_jsx_runtime.JSX.Element;

interface ConfirmOptions {
    title?: string;
    message: string;
    icon?: string;
    confirmText?: string;
    cancelText?: string;
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
    defaultValue?: string;
    placeholder?: string;
    icon?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    type?: 'text' | 'number';
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

/**
 * SectionIcon - Icon with colored background container
 *
 * Design: Mono-color icon with solid lighter background
 * Creates a clean, professional look consistent across the app
 *
 * Colors must be provided explicitly — no domain-specific lookups.
 * In Jogi, callers typically pass colors from getSectionColors().
 */
interface SectionIconColors {
    iconBg: string;
    text: string;
}
interface Props$3 {
    /** Color scheme for icon container and icon */
    colors?: SectionIconColors;
    /** Icon name from Lucide */
    icon: string;
    /** Icon size in pixels (default: 18) */
    size?: number;
    /** Container size: 'sm' (24px), 'md' (32px), 'lg' (40px) */
    containerSize?: 'sm' | 'md' | 'lg';
    /** Additional class names for the container */
    className?: string;
}
declare const SectionIcon: ({ colors, icon, size, containerSize, className, }: Props$3) => react_jsx_runtime.JSX.Element;

interface Props$2 {
    items: CardItem[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    compact?: boolean;
    /** Set of checked item IDs for multi-select mode */
    checkedIds?: Set<string>;
    /** Callback when an item's checkbox is toggled */
    onCheck?: (id: string, checked: boolean) => void;
}
declare function CardList({ items, selectedId, onSelect, compact, checkedIds, onCheck }: Props$2): react_jsx_runtime.JSX.Element | null;

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

interface StatCardProps {
    label: string;
    value: string | number;
    icon: string;
    subtitle?: string;
    trend?: {
        value: number;
        label: string;
    };
    color?: 'default' | 'success' | 'warning' | 'danger';
    onClick?: () => void;
}
declare function StatCard({ label, value, icon, subtitle, trend, color, onClick }: StatCardProps): react_jsx_runtime.JSX.Element;

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
interface SidebarControlsProps {
    search: string;
    onSearchChange: (value: string) => void;
    sortOptions: {
        value: string;
        label: string;
    }[];
    sortBy: string;
    onSortChange: (value: string) => void;
    sortDir: 'asc' | 'desc';
    onSortDirChange: (dir: 'asc' | 'desc') => void;
}
/** Collapsible sidebar controls - filter and sort */
declare function SidebarControls({ search, onSearchChange, sortOptions, sortBy, onSortChange, sortDir, onSortDirChange }: SidebarControlsProps): react_jsx_runtime.JSX.Element;

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
    variant?: 'light' | 'dark';
    /** When provided, title becomes editable inline */
    onRename?: (value: string) => void;
    /** When provided, subtitle becomes a clickable email link */
    onEmail?: () => void;
}
declare function DetailBar({ title, subtitle, email, icon, toolbar, extra, subtitlePrefix, variant, onRename, onEmail }: DetailBarProps): react_jsx_runtime.JSX.Element;

interface PropsCard {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    colSpan?: number;
}
declare const Card: ({ title, subtitle, children, colSpan }: PropsCard) => react_jsx_runtime.JSX.Element;

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
    /** Default open section ID. Omit to auto-open first section, pass null to start all closed */
    defaultOpenId?: string | null;
    /** Remove container wrapper (use raw accordion without rounded bg-gray-100 container) */
    bare?: boolean;
}
/**
 * Accordion — collapsible sections with colored headers.
 *
 * Colors are provided per section via `section.colors`. Falls back to neutral gray.
 * Only one section can be open at a time (mutual exclusivity).
 *
 * @example
 * <Accordion sections={[
 *   { id: 'ingresos', title: 'Ingresos', icon: 'TrendingUp',
 *     colors: { bg: 'bg-emerald-50', text: 'text-emerald-700', iconBg: 'bg-emerald-100' },
 *     content: <IncomeTable /> },
 * ]} />
 */
declare const Accordion: ({ sections, forceExpanded, defaultOpenId, bare }: AccordionProps) => react_jsx_runtime.JSX.Element;

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
    icon: string;
    label: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    visible?: boolean;
    active?: boolean;
    blink?: boolean;
    variant?: 'dark' | 'light';
}
declare const ToolbarButton: ({ icon, label, visible, onClick, active, blink, variant, className, disabled, ...rest }: ButtonProps) => react_jsx_runtime.JSX.Element | null;

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
    visible?: boolean;
    /** Visual variant — dark for teal/colored headers, light for white backgrounds */
    variant?: 'dark' | 'light';
}
declare const ButtonGroup: ({ children, className, visible, variant }: ButtonGroupProps) => react_jsx_runtime.JSX.Element | null;

interface LabelProps {
    text: string;
    className?: string;
    visible?: boolean;
}
declare const Label: ({ text, className, visible }: LabelProps) => react_jsx_runtime.JSX.Element | null;

interface PaginatorProps {
    page: number;
    setPage: (page: number) => void;
    hasNext: boolean;
    className?: string;
    visible?: boolean;
    compact?: boolean;
}
declare const Paginator: ({ page, setPage, hasNext, className, visible, compact }: PaginatorProps) => react_jsx_runtime.JSX.Element | null;

interface Tab {
    id: string;
    label: string;
    /** Shorter label shown on mobile (sm breakpoint and below) */
    shortLabel?: string;
    icon?: string;
    content?: ReactNode;
    /** Custom background color when this tab is selected */
    selectedBackground?: string;
    /** Custom foreground (text) color when this tab is selected */
    selectedForeground?: string;
}

interface TabsProps {
    tabs: Tab[];
    activeTab?: string;
    onChange?: (tabId: string) => void;
    onRefresh?: (tabId: string) => void;
    children?: ReactNode;
    className?: string;
    /** Render style: 'underline' (default) or 'pill' */
    variant?: 'underline' | 'pill';
    /** Custom background color for selected tab */
    selectedBackground?: string;
    /** Custom foreground (text) color for selected tab */
    selectedForeground?: string;
    /** Custom background color for inactive tabs */
    inactiveBackground?: string;
    /** Custom foreground (text) color for inactive tabs */
    inactiveForeground?: string;
    /** Whether to show rounded corners on first/last tabs (default: true) */
    rounded?: boolean;
}
/**
 * Shared Tabs component for switching between views.
 *
 * Usage with content prop:
 * ```tsx
 * <Tabs
 *   tabs={[
 *     { id: 'renta', label: 'Informe de Renta', content: <RentaReport /> },
 *     { id: 'reporte', label: 'Reporte', content: <ReporteView /> }
 *   ]}
 * />
 * ```
 *
 * Usage with children (controlled):
 * ```tsx
 * <Tabs
 *   tabs={[{ id: 'tab1', label: 'Tab 1' }, { id: 'tab2', label: 'Tab 2' }]}
 *   activeTab={activeTab}
 *   onChange={setActiveTab}
 * >
 *   {activeTab === 'tab1' && <Content1 />}
 *   {activeTab === 'tab2' && <Content2 />}
 * </Tabs>
 * ```
 */
declare const Tabs: ({ tabs, activeTab: controlledActive, onChange, onRefresh, children, className, variant, selectedBackground, selectedForeground, inactiveBackground, inactiveForeground, rounded }: TabsProps) => react_jsx_runtime.JSX.Element | null;

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
    tbar?: React__default.ReactNode;
    children: React__default.ReactNode;
    page?: number;
    setPage?: (page: number) => void;
    hasNext?: boolean;
}
declare const Container: ({ title, icon, tbar, children, page, setPage, hasNext }: ContainerProps) => react_jsx_runtime.JSX.Element;

type Size$1 = 'xs' | 'sm' | 'md' | 'lg';
interface SpinnerProps {
    size?: Size$1;
    message?: string;
}
declare function Spinner({ size, message }: SpinnerProps): react_jsx_runtime.JSX.Element;

interface AnimAIProps {
    message?: string;
}
declare function AnimAI({ message }: AnimAIProps): react_jsx_runtime.JSX.Element;

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
interface DragHereProps {
    size?: Size;
}
declare function DragHere({ size }: DragHereProps): react_jsx_runtime.JSX.Element;

interface PillTagProps {
    children: React.ReactNode;
    onRemove?: () => void;
    grip?: boolean;
}
declare const PillTag: ({ children, onRemove, grip }: PillTagProps) => react_jsx_runtime.JSX.Element;

export { Accordion, Anchor, AnimAI, Button, ButtonGroup, type ButtonProps$1 as ButtonProps, Card, type CardItem, CardList, Checkbox, ColorPicker, ConfirmDialog as Confirm, type ConfirmOptions, Container, ContextMenu, DetailBar, DetailContent, DragHere$1 as DragHereHint, DragHere as DragHereOverlay, EditableTitle, EmailLink, EmptyState, FieldWrapper, Icon, Input, Label, MasterDetail, Modal, Paginator, Panel, PillTag, ProgressRing, PromptDialog as Prompt, type PromptOptions, Radio, Scroll, type Section, SectionIcon, type SectionIconColors, Select, SidebarControls, SidebarFilter, SidebarPaginator, SidebarSort, Skeleton, Spinner, StatCard, TablePanel, Tabs, Toast, ToastContainer, type ToastData, ToastProvider, ToolBack, ToolbarButton, Tooltip, useIsDesktop, useIsMobile, useToast };
