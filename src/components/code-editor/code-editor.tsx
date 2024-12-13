import { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Editor, OnMount } from '@monaco-editor/react';
import * as prettier from 'prettier/standalone.mjs';
import parserBabel from 'prettier/plugins/babel.mjs';
import * as prettierPluginEstree from 'prettier/plugins/estree.mjs';

import './code-editor.css';

interface MonacoEditorProps {
  defaultValue: string;
  onChange(value: string): void;
}

const MonacoEditor = ({ defaultValue, onChange }: MonacoEditorProps) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [theme, setTheme] = useState('vs-dark');

  const handleOnMount: OnMount = (editor) => {
    editorRef.current = editor; // Assign the editor instance to the ref
  };

  const onFormatClick = async () => {
    if (editorRef.current) {
      const unformattedCode = editorRef.current.getValue() || '';

      try {
        // Format code with Prettier
        const formattedCode = await prettier.format(unformattedCode, {
          parser: 'babel',
          // @ts-ignore
          plugins: [parserBabel, prettierPluginEstree],
          singleQuote: true,
          jsxSingleQuote: true,
          tabWidth: 4,
          semi: true,
        });

        // Update editor content with formatted code
        editorRef.current.setValue(formattedCode);
      } catch (error) {
        console.error('Error formatting code:', error);
      }
    } else {
      console.warn('Editor is not initialized.');
    }
  };

  useEffect(() => {
    // Detect user's preferred color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(prefersDark.matches ? 'vs-dark' : 'vs-light');

    const handleChange = (e) => {
      setTheme(e.matches ? 'vs-dark' : 'vs-light');
    };

    prefersDark.addEventListener('change', handleChange);

    return () => {
      prefersDark.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <Editor
        onMount={handleOnMount}
        onChange={(value) => onChange(value || '')}
        height="100%"
        width="100%"
        defaultLanguage="javascript"
        defaultValue={defaultValue}
        theme={theme}
        options={{
          lineNumbers: 'relative',
          cursorBlinking: 'smooth',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          fontSize: 18,
          minimap: { enabled: false },
        }}
      />
    </div>
  );
};

export default MonacoEditor;
