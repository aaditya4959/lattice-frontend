import Quill from 'quill';

interface BindingThis {
  quill: Quill;
}
interface BindingRange {
  index: number;
}
interface BindingContext {
  prefix: string;
}

// Deletes the matched "# "/"- "/"1. " prefix and applies the corresponding line
// format at the position it used to start — not at the pre-deletion cursor
// index, which would point past the now-shorter line.
function lineShortcut(format: string, value: string | number) {
  return function (this: BindingThis, range: BindingRange, context: BindingContext) {
    const start = range.index - context.prefix.length;
    this.quill.deleteText(start, context.prefix.length, Quill.sources.USER);
    this.quill.formatLine(start, 1, format, value, Quill.sources.USER);
    return false;
  };
}

function headerBinding(level: 1 | 2 | 3) {
  return {
    key: ' ',
    collapsed: true,
    prefix: new RegExp(`^#{${level}}$`),
    handler: lineShortcut('header', level),
  };
}

// Notion-style typing shortcuts ("# ", "## ", "- ", "1. ") using Quill's public
// keyboard-module binding API (prefix regex + handler) — not a third-party plugin.
export const markdownShortcutBindings = {
  header1: headerBinding(1),
  header2: headerBinding(2),
  header3: headerBinding(3),
  bulletList: {
    key: ' ',
    collapsed: true,
    prefix: /^[-*]$/,
    handler: lineShortcut('list', 'bullet'),
  },
  orderedList: {
    key: ' ',
    collapsed: true,
    prefix: /^\d+\.$/,
    handler: lineShortcut('list', 'ordered'),
  },
};
