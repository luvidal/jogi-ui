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

interface ButtonProps$1 extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: string;
    text?: string;
    /** Shows inline spinner and disables interaction */
    loading?: boolean;
}
declare const Button: ({ icon, text, loading, className, ...props }: ButtonProps$1) => react_jsx_runtime.JSX.Element;

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
    className?: string;
    visible?: boolean;
    children: ReactNode;
}
declare function FieldWrapper({ label, className, visible, children }: FieldWrapperProps): react_jsx_runtime.JSX.Element | null;

interface Props$a {
    label?: string;
    readOnly?: boolean;
    onChange?: (value: string) => void;
    value?: string;
    className?: string;
    visible?: boolean;
}
type InputProps = Props$a & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'readOnly'>;
declare const Input: ({ label, className, readOnly, onChange, value, visible, ...rest }: InputProps) => react_jsx_runtime.JSX.Element;

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
declare const Select: ({ label, value, placeholder, options, className, onChange }: Props$8) => react_jsx_runtime.JSX.Element;

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

interface TextFieldProps {
    label: string;
    value: string | undefined;
    onChange?: (v: string | undefined) => void;
    readOnly?: boolean;
    placeholder?: string;
    fullWidth?: boolean;
}
declare const TextField: ({ label, value, onChange, readOnly, placeholder, fullWidth }: TextFieldProps) => react_jsx_runtime.JSX.Element;

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

type ModalSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs';
interface Props$7 {
    title?: string;
    icon?: string;
    children?: React.ReactNode;
    onClose: () => void;
    size?: ModalSize;
    headerActions?: React.ReactNode;
}
declare const Modal: ({ title, icon, children, onClose, size: sizeProp, headerActions }: Props$7) => react_jsx_runtime.JSX.Element;

type TooltipProps = {
    text: string;
};
declare const Tooltip: ({ text }: TooltipProps) => react_jsx_runtime.JSX.Element;

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
    compact?: boolean;
    /** Set of checked item IDs for multi-select mode */
    checkedIds?: Set<string>;
    /** Callback when an item's checkbox is toggled */
    onCheck?: (id: string, checked: boolean) => void;
}
declare function CardList({ items, selectedId, onSelect, compact, checkedIds, onCheck }: Props$3): react_jsx_runtime.JSX.Element | null;

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
}
/**
 * Accordion — collapsible sections with colored headers.
 *
 * Colors are provided per section via `section.colors`. Falls back to neutral gray.
 * Only one section can be open at a time (mutual exclusivity).
 */
declare const Accordion: ({ sections, forceExpanded }: AccordionProps) => react_jsx_runtime.JSX.Element;

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
    icon: string;
    label: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    active?: boolean;
    variant?: 'dark' | 'light';
}
declare const ToolbarButton: ({ icon, label, onClick, active, variant, disabled, ...rest }: ButtonProps) => react_jsx_runtime.JSX.Element;

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
    /** Shorter label shown on mobile (sm breakpoint and below) */
    shortLabel?: string;
    icon?: string;
    content?: ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    activeTab?: string;
    onChange?: (tabId: string) => void;
    onRefresh?: (tabId: string) => void;
    storageKey?: string;
    children?: ReactNode;
    className?: string;
}
declare const Tabs: ({ tabs, activeTab: controlledActive, onChange, onRefresh, storageKey, children, className }: TabsProps) => react_jsx_runtime.JSX.Element | null;

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

export { Accordion, Anchor, Button, ButtonGroup, Card, type CardItem, CardList, Checkbox, ColorPicker, ComputedField, ConfirmDialog as Confirm, type ConfirmOptions, Container, ContextMenu, DetailBar, DetailContent, DragHere$1 as DragHereHint, DragHere as DragHereOverlay, EditableTitle, EmailLink, EmptyState, FieldWrapper, Icon, Input, MasterDetail, Modal, NumberField, Panel, PillTag, ProgressRing, PromptDialog as Prompt, type PromptOptions, Radio, Scroll, type Section, Select, SelectField, SidebarFilter, SidebarPaginator, SidebarSort, Skeleton, Spinner, StatCard, TablePanel, Tabs, TextField, ToastContainer, type ToastData, ToastProvider, ToolBack, ToolbarButton, Tooltip, useToast };
