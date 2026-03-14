/**
 * Opens a native file chooser programmatically.
 * Creates a hidden file input and triggers click.
 */
export function openFilePicker(opts: {
  accept?: string
  onFiles: (files: FileList) => void
}): void {
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = true
  input.accept = opts.accept ?? '*'
  input.onchange = e => {
    const target = e.target as HTMLInputElement
    if (target.files) opts.onFiles(target.files)
  }
  input.click()
}
