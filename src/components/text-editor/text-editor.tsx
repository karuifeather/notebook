import React, { useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import MarkdownIt from 'markdown-it';
import TurndownService from 'turndown';

import './text-editor.css';
import { Cell } from '@/state/index.ts';
import { useActions } from '@/hooks/use-actions.ts';
import { BubbleMenuBar } from '@/components/bubble-menu/bubble-menu.tsx';

interface TextEditorProps {
  cell: Cell;
}

const md = new MarkdownIt();
const turndownService = new TurndownService();

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
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
      TextStyle,
      Color,
    ],
    content: cell.content ? md.render(cell.content) : '<p>Click to edit</p>',
    onUpdate: ({ editor }) => {
      if (!throttlingRef.current) {
        // Save content immediately on first call
        const markdownContent = turndownService.turndown(editor.getHTML());
        updateCell(cell.id, markdownContent);

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
