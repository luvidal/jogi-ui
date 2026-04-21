// @jogi/ui — UI component library

// ── Hooks & Context ──
export { useToast, ToastProvider } from './hooks'
export { createDialogContext } from './hooks/dialog'
export { useIsMobile, useIsDesktop } from './hooks/device'

// ── Types ──
export type { Section, CardItem } from './types'
export type { ToastData } from './common/toast'

// ── Icon ──
export { default as Icon } from './common/icon'

// ── Forms ──
export { default as Button } from './forms/button'
export { default as Checkbox } from './forms/checkbox'
export { default as ColorPicker } from './forms/colorpicker'
export { default as FieldWrapper } from './forms/fieldwrapper'
export { default as Input } from './forms/input'
export { default as Radio } from './forms/radio'
export { default as Select } from './forms/select'
export { default as ComputedField } from './forms/computedfield'
export { default as NumberField } from './forms/numberfield'
export { default as TextField } from './forms/textfield'
export { default as SelectField } from './forms/selectfield'

// ── Common ──
export { default as Modal } from './common/modal'
export { default as ModalOverlayPanel } from './common/modaloverlaypanel'
export { default as ModalToolbar } from './common/modaltoolbar'
export { default as ModalFormLayout } from './common/modalformlayout'
export { default as Tooltip } from './common/tooltip'
export { default as Label } from './common/label'
export { default as SectionSeparator } from './common/sectionseparator'
export { default as Skeleton } from './common/skeleton'
export { default as EmptyState } from './common/emptystate'
export { default as Confirm } from './common/confirm'
export type { ConfirmOptions } from './common/confirm'
export { default as Prompt } from './common/prompt'
export type { PromptOptions } from './common/prompt'
export { default as ContextMenu } from './common/contextmenu'
export { default as CardList } from './common/cardlist'
export { default as MasterDetail } from './common/masterdetail'
export { default as StatCard } from './common/statcard'
export { SidebarFilter, SidebarSort, SidebarPaginator } from './common/sidebarcontrols'
export { default as DetailBar } from './common/detailbar'
export { default as Card } from './common/card'
export { default as Anchor } from './common/anchor'
export { default as ProgressRing } from './common/progressring'
export { default as DetailContent } from './common/detailcontent'
export { default as DragHereHint } from './common/dragherehint'
export { ToastContainer } from './common/toast'

// ── Section (Accordion) ──
export { default as Accordion } from './section'

// ── Header ──
export { default as ToolbarButton } from './header/toolbarbutton'
export { default as ToolBack } from './header/toolback'
export { default as EditableTitle } from './header/editabletitle'
export { default as EmailLink } from './header/emaillink'
export { default as ButtonGroup } from './header/buttongroup'

// ── Tabs ──
export { default as Tabs } from './tabs'

// ── Panel ──
export { default as Panel } from './panel'
export { default as TablePanel } from './panel/tablepanel'

// ── Container ──
export { default as Container, Scroll } from './container'

// ── Animations ──
export { default as Spinner } from './animations/spinner'
export { default as DragHereOverlay } from './animations/draghereoverlay'

// ── Display ──
export { default as PillTag } from './pilltag'

// ── Records ──
export { useRecords } from './hooks/userecords'
export type { SortOption, UseRecordsOptions, RefreshActions, UseRecordsReturn } from './hooks/userecords'

// ── Multi-select ──
export { useMultiSelect } from './hooks/usemultiselect'
export type { MultiSelectState } from './hooks/usemultiselect'
export { useFenceSelect } from './hooks/usefenceselect'
export type { FenceRect, UseFenceSelectOptions, UseFenceSelectResult } from './hooks/usefenceselect'
export { MultiselectToolbar } from './common/multiselecttoolbar'

// ── File Utilities ──
export { captureDataTransfer, resolveFiles } from './common/folderutils'
export type { CapturedTransfer } from './common/folderutils'
export { openFilePicker } from './common/filepicker'

// ── Upload ──
export { useUploadFlow } from './upload/useuploadflow'
export { default as UploadCards } from './upload/uploadcards'
export type { FileUploadItem, FileStatus, UploadFlowOptions, UploadFlowLabels, UploadToast, UploadSummary } from './upload/useuploadflow'
export type { UploadCardsLabels } from './upload/uploadcards'
