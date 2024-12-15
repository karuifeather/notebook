import { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Editor, OnMount } from '@monaco-editor/react';
import * as prettier from 'prettier/standalone.mjs';
import parserBabel from 'prettier/plugins/babel.mjs';
import parserTypescript from 'prettier/plugins/typescript.mjs';
import * as prettierPluginEstree from 'prettier/plugins/estree.mjs';

import './styles/code-editor.scss';

interface MonacoEditorProps {
  defaultValue: string;
  onChange(value: string): void;
}

interface MonacoEditorProps {
  defaultValue: string;
  onChange: (value: string) => void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  defaultValue,
  onChange,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [theme, setTheme] = useState('vs-dark');

  const handleOnMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Enable JavaScript diagnostics (error detection)
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    // Configure JavaScript language features
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext, // Modern JavaScript
      allowNonTsExtensions: true, // Allow non-TypeScript files
      noEmit: true, // Prevent output files
      jsx: monaco.languages.typescript.JsxEmit.React, // Enable JSX
      jsxFactory: 'JSXAlone.createElement', // React JSX factory function
      typeRoots: ['node_modules/@types'],
    });

    // Add extra libraries for better IntelliSense (optional)
    monaco.languages.typescript.javascriptDefaults.addExtraLib(`
       declare const React: any;
      declare const ReactDOM: any;
      declare const window: any;
      declare const document: any;
      declare const console: any;
    `);

    // Add custom command for triggering suggestions
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyJ, () => {
      editor.trigger('keyboard', 'editor.action.triggerSuggest', {});
    });
  };

  const onFormatClick = async () => {
    if (editorRef.current) {
      const unformattedCode = editorRef.current.getValue() || '';

      try {
        // Format code with Prettier
        const formattedCode = await prettier.format(unformattedCode, {
          parser: 'babel',
          plugins: [parserBabel, prettierPluginEstree, parserTypescript],
          singleQuote: true,
          jsxSingleQuote: true,
          tabWidth: 2,
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

    const handleChange = (e: MediaQueryListEvent) => {
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
          tabSize: 2,
          automaticLayout: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: { other: true, comments: true, strings: true },
          acceptSuggestionOnEnter: 'on',
          parameterHints: { enabled: true },
          snippetSuggestions: 'bottom',
        }}
      />
    </div>
  );
};

export default MonacoEditor;
