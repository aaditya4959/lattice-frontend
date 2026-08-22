'use client';

import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { QuillBinding } from 'y-quill';
import type * as Y from 'yjs';

// Baseline toolbar for LAT-E10 (core wiring) — theming/UX polish is LAT-E11.
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

    const quill = new Quill(container, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR_OPTIONS },
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
      className="flex flex-1 flex-col [&_.ql-container]:flex-1 [&_.ql-container]:overflow-y-auto [&_.ql-editor]:min-h-[50vh]"
    />
  );
}
