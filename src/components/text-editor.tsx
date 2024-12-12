import React, { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';

import './text-editor.css';
import { Cell } from '../state/index.ts';
import { useActions } from '../hooks/use-actions.ts';

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);
  const { updateCell } = useActions();

  // Initialize TipTap editor with Markdown extension
  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    content: cell.content || '# Click to edit',
    onUpdate: ({ editor }) => {
      const markdownContent = editor.storage.markdown.getMarkdown();
      updateCell(cell.id, markdownContent);
    },
    editable: editing,
  });

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target instanceof Node &&
        ref.current.contains(event.target)
      ) {
        return;
      }
      setEditing(false);
    };

    document.addEventListener('click', listener, { capture: true });

    return () => {
      document.removeEventListener('click', listener, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(cell.content || '# Click to edit');
    }
  }, [cell.content, editor]);

  if (!editor) {
    return <div>Loading...</div>;
  }

  return (
    <div ref={ref} className="text-editor">
      {editing ? (
        <EditorContent editor={editor} />
      ) : (
        <div
          className="card-content"
          onClick={() => setEditing(true)}
          dangerouslySetInnerHTML={{
            __html: editor.storage.markdown.getHTML(),
          }}
        />
      )}
    </div>
  );
};

export default TextEditor;
