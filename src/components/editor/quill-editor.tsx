'use client';

import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import './quill-editor.css';
import { QuillBinding } from 'y-quill';
import type * as Y from 'yjs';
import { markdownShortcutBindings } from './markdown-shortcuts';

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  ['link', 'blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
];

export function QuillEditor({ ytext }: { ytext: Y.Text }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Bubble theme = a floating selection toolbar (closer to Notion's inline
    // toolbar) instead of a fixed top bar. Block-level formatting on an empty
    // line (no selection to trigger the bubble) comes from the "# "/"- "/"1. "
    // typing shortcuts below instead.
    const quill = new Quill(container, {
      theme: 'bubble',
      placeholder: 'Start writing…',
      modules: {
        toolbar: TOOLBAR_OPTIONS,
        keyboard: { bindings: markdownShortcutBindings },
      },
    });

    // No Awareness passed — cursor position comes from the backend's own
    // { type: 'cursor' } message, not the Yjs awareness protocol (see LAT-E12).
    const binding = new QuillBinding(ytext, quill);

    return () => {
      binding.destroy();
      container.innerHTML = '';
    };
  }, [ytext]);

  return (
    <div
      ref={containerRef}
      className="lattice-editor flex flex-1 flex-col [&_.ql-container]:flex-1 [&_.ql-container]:overflow-y-auto [&_.ql-editor]:min-h-[50vh]"
    />
  );
}
