import { useRef } from 'react';
import * as monaco from 'monaco-editor';
import { Editor, OnChange, OnMount, useMonaco } from '@monaco-editor/react';
import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';

import './code-editor.css';

interface MonacoEditorProps {
  defaultValue: string;
  onChange(value: string): void;
}

const MonacoEditor = ({ defaultValue, onChange }: MonacoEditorProps) => {
  // Use a strongly typed ref for Monaco editor
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  // Access Monaco instance for additional customizations if needed
  const monacoInstance = useMonaco();

  // Handle editor mounting
  const handleOnMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Optional: Customize Monaco editor here
    if (monacoInstance) {
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
      });
    }
  };

  // Handle editor changes
  const handleOnChange: OnChange = (value) => {
    if (value) {
      onChange(value);
    } else {
      onChange('');
    }
  };

  // Format code using Prettier
  const onFormatClick = async () => {
    if (editorRef.current) {
      const unformattedCode = editorRef.current.getValue() || '';

      try {
        const formattedCode = (
          await prettier.format(unformattedCode, {
            parser: 'babel',
            plugins: [parserBabel],
            singleQuote: true,
            jsxSingleQuote: true,
            tabWidth: 4,
            semi: true,
          })
        ).replace(/\n$/, '');

        editorRef.current.setValue(formattedCode);
      } catch (error) {
        console.error('Error formatting code:', error);
      }
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
        onChange={handleOnChange}
        height="100%"
        width="100%"
        defaultLanguage="javascript"
        defaultValue={defaultValue}
        theme="vs-dark"
        options={{
          lineNumbers: 'on',
          cursorBlinking: 'smooth',
          cursorStyle: 'block',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          wrappingIndent: 'same',
          fontSize: 16,
          minimap: { enabled: false },
          folding: true,
          lineNumbersMinChars: 3,
          renderWhitespace: 'boundary',
          renderControlCharacters: true,
        }}
      />
    </div>
  );
};

export default MonacoEditor;
