// Quill's toolbar buttons are bare SVG icons with no accessible name by
// default. Label them from their `ql-*` format class after mount, once —
// the toolbar DOM is built at construction time (even for the bubble theme,
// where it just stays hidden until a selection is made), not recreated later.

const BUTTON_LABELS: Record<string, string> = {
  bold: 'Bold',
  italic: 'Italic',
  underline: 'Underline',
  strike: 'Strikethrough',
  link: 'Link',
  blockquote: 'Blockquote',
  'code-block': 'Code block',
  clean: 'Clear formatting',
};

const LIST_LABELS: Record<string, string> = {
  ordered: 'Numbered list',
  bullet: 'Bulleted list',
};

function pickerLabel(el: HTMLElement): string | null {
  if (el.classList.contains('ql-header')) return 'Text style';
  if (el.classList.contains('ql-background')) return 'Background color';
  if (el.classList.contains('ql-color')) return 'Text color';
  return null;
}

export function labelToolbarButtons(root: HTMLElement) {
  root.querySelectorAll('button').forEach((node) => {
    const el = node as HTMLElement;
    const format = Array.from(el.classList)
      .find((c) => c.startsWith('ql-') && c !== 'ql-active')
      ?.replace('ql-', '');
    if (!format) return;

    if (format === 'list') {
      const value = el.getAttribute('value');
      el.setAttribute('aria-label', (value && LIST_LABELS[value]) || 'List');
      return;
    }

    const label = BUTTON_LABELS[format];
    if (label) el.setAttribute('aria-label', label);
  });

  root.querySelectorAll('.ql-picker').forEach((node) => {
    const el = node as HTMLElement;
    const label = pickerLabel(el);
    if (!label) return;
    el.querySelector('.ql-picker-label')?.setAttribute('aria-label', label);
  });
}
