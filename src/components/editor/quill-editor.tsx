'use client';

import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import './quill-editor.css';
import { QuillBinding } from 'y-quill';
import type * as Y from 'yjs';
import { markdownShortcutBindings } from './markdown-shortcuts';
import type { RemoteCursor } from '@/lib/hooks/use-presence';

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  ['link', 'blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
];

function buildCursorFlag(cursor: RemoteCursor, quill: Quill): HTMLDivElement | null {
  const maxIndex = Math.max(0, quill.getLength() - 1);
  const position = Math.min(Math.max(cursor.position, 0), maxIndex);
  const bounds = quill.getBounds(position, 0);
  if (!bounds) return null;

  const flag = document.createElement('div');
  flag.style.cssText = `position:absolute; left:${bounds.left}px; top:${bounds.top}px; height:${bounds.height}px; border-left:2px solid ${cursor.color};`;

  const label = document.createElement('span');
  label.textContent = cursor.email || cursor.userId;
  label.style.cssText = `position:absolute; top:-1.2em; left:-2px; white-space:nowrap; font-size:11px; line-height:1.4; padding:0 4px; border-radius:3px; color:white; background:${cursor.color};`;
  flag.appendChild(label);

  return flag;
}

interface QuillEditorProps {
  ytext: Y.Text;
  remoteCursors: RemoteCursor[];
  onSelectionChange: (position: number | null) => void;
}

export function QuillEditor({ ytext, remoteCursors, onSelectionChange }: QuillEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const cursorsRef = useRef<RemoteCursor[]>(remoteCursors);
  const onSelectionChangeRef = useRef(onSelectionChange);

  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
  });

  // Mount Quill once per ytext. The remote-cursor overlay is a sibling of
  // Quill's own .ql-editor (not a child of it) — Quill's MutationObserver
  // watches .ql-editor's subtree and reconciles it back into its own Blot
  // model, so foreign nodes appended inside it can break on the next update.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const quill = new Quill(container, {
      theme: 'bubble',
      placeholder: 'Start writing…',
      modules: {
        toolbar: TOOLBAR_OPTIONS,
        keyboard: { bindings: markdownShortcutBindings },
      },
    });
    quillRef.current = quill;

    const binding = new QuillBinding(ytext, quill);

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:absolute; inset:0; overflow:hidden; pointer-events:none;';
    quill.container.appendChild(overlay);
    overlayRef.current = overlay;

    function renderCursors() {
      overlay.innerHTML = '';
      for (const cursor of cursorsRef.current) {
        const flag = buildCursorFlag(cursor, quill);
        if (flag) overlay.appendChild(flag);
      }
    }
    renderCursors();

    // getBounds() reflects .ql-editor's current scroll position at call time
    // (it's derived from getBoundingClientRect), so re-running it on scroll
    // keeps flags in sync even without new cursor data arriving.
    quill.root.addEventListener('scroll', renderCursors);
    quill.on('selection-change', (range) => {
      onSelectionChangeRef.current(range ? range.index : null);
    });

    return () => {
      quill.root.removeEventListener('scroll', renderCursors);
      binding.destroy();
      container.innerHTML = '';
      quillRef.current = null;
      overlayRef.current = null;
    };
  }, [ytext]);

  useEffect(() => {
    cursorsRef.current = remoteCursors;
    const quill = quillRef.current;
    const overlay = overlayRef.current;
    if (!quill || !overlay) return;

    overlay.innerHTML = '';
    for (const cursor of remoteCursors) {
      const flag = buildCursorFlag(cursor, quill);
      if (flag) overlay.appendChild(flag);
    }
  }, [remoteCursors]);

  return (
    <div
      ref={containerRef}
      className="lattice-editor relative flex flex-1 flex-col [&_.ql-editor]:min-h-[50vh]"
    />
  );
}
