import React, { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import { Cell } from '../state/index.ts';
import { useActions } from '../hooks/use-actions.ts';

import './text-editor.css';
import { BubbleMenuBar } from './bubble-menu/bubble-menu.tsx';
import Placeholder from '@tiptap/extension-placeholder';
import Paragraph from '@tiptap/extension-paragraph';
import TextStyle from '@tiptap/extension-text-style';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { updateCell } = useActions();
  const throttlingRef = useRef(false); // To manage the throttling state
  const timerRef = useRef<number | null>(null); // To store the timeout reference

  // Initialize TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing here...', // Customize placeholder text
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'], // Enable text alignment for headings and paragraphs
      }),
      Highlight,
      Typography,
      Underline,
      Document,
      Paragraph,
      Text,
      TextStyle,
      Color,
    ],
    content: cell.content || '*Click to edit*',
    onUpdate: ({ editor }) => {
      if (!throttlingRef.current) {
        // Save content immediately on first call
        const htmlContent = editor.getHTML();
        updateCell(cell.id, htmlContent);

        // Start throttling
        throttlingRef.current = true;

        // Reset throttling state after 500ms
        timerRef.current = window.setTimeout(() => {
          throttlingRef.current = false;
        }, 500);
      }
    },
  });

  useEffect(() => {
    return () => {
      // Cleanup timeout on unmount
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!editor) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {editor && <BubbleMenuBar editor={editor} />}

      <EditorContent editor={editor} />
    </>
  );
};

export default TextEditor;
