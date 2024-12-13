import { useRef } from 'react';
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
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null); // Explicitly allow null

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
        theme="vs-dark"
        options={{
          lineNumbers: 'on',
          cursorBlinking: 'smooth',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          fontSize: 16,
          minimap: { enabled: false },
        }}
      />
    </div>
  );
};

export default MonacoEditor;
