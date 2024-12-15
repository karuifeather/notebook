import { useState } from 'react';
import { BubbleMenu, Editor } from '@tiptap/react';
import './styles/bubble-menu.scss';

export const BubbleMenuBar = ({ editor }: { editor: Editor }) => {
  const [color, setColor] = useState('#000000'); // Default color

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="bubble-menu"
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <i className="fas fa-bold"></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <i className="fas fa-italic"></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'is-active' : ''}
      >
        <i className="fas fa-underline"></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        <i className="fas fa-strikethrough"></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        <i className="fas fa-code"></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <i className="fas fa-list-ul"></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        <i className="fas fa-list-ol"></i>
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
      >
        <i className="fas fa-align-left"></i>
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
      >
        <i className="fas fa-align-center"></i>
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
      >
        <i className="fas fa-align-right"></i>
      </button>
      <div className="color-picker-wrapper">
        {/* Color Picker Icon */}
        <button
          onClick={() => editor.chain().focus().setColor(color).run()}
          className={`color-picker-btn ${editor.isActive('textStyle') ? 'is-active' : ''}`}
          title="Apply Selected Color"
        >
          <i className="fas fa-palette"></i>
        </button>

        {/* Color Picker Input */}
        <input
          type="color"
          value={color}
          onChange={(e) => {
            const newColor = e.target.value;
            setColor(newColor);
          }}
          className="color-picker-input"
          aria-label="Pick a text color"
        />
      </div>
    </BubbleMenu>
  );
};

export default BubbleMenuBar;
