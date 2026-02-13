import { useCallback, useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Editor, OnMount } from '@monaco-editor/react';
import * as prettier from 'prettier/standalone.mjs';
import parserBabel from 'prettier/plugins/babel.mjs';
import parserTypescript from 'prettier/plugins/typescript.mjs';
import * as prettierPluginEstree from 'prettier/plugins/estree.mjs';

import './styles/code-editor.scss';

interface MonacoEditorProps {
  /** Initial value when uncontrolled; use value for controlled (e.g. so external updates like Add NPM modal show in editor). */
  defaultValue?: string;
  /** When set, editor is controlled and will reflect external updates (e.g. insert imports from modal). */
  value?: string;
  onChange: (value: string) => void;
  /** When true, editor grows with content (page scrolls); when false, max-height + internal scroll */
  expanded?: boolean;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  defaultValue = '',
  value,
  onChange,
  expanded = false,
}) => {
  const effectiveValue = value !== undefined ? value : defaultValue;
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const expandedRef = useRef(expanded);
  const [theme, setTheme] = useState('vs-dark');

  expandedRef.current = expanded;

  const updateExpandedHeight = useCallback(() => {
    const editor = editorRef.current;
    const wrapper = wrapperRef.current;
    if (!editor || !wrapper || !expandedRef.current) return;
    const h = editor.getContentHeight();
    wrapper.style.height = `${h}px`;
    editor.layout({ width: wrapper.clientWidth, height: h });
  }, []);

  const handleOnMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.onDidContentSizeChange(() => {
      if (expandedRef.current && wrapperRef.current) {
        const h = editor.getContentHeight();
        wrapperRef.current.style.height = `${h}px`;
        editor.layout({ width: wrapperRef.current.clientWidth, height: h });
      }
    });

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

    // Allow parent page to scroll when editor is not focused
    const editorElement = editor.getDomNode();
    if (editorElement) {
      editorElement.addEventListener('wheel', (e) => {
        if (!editor.hasTextFocus()) {
          e.preventDefault();
          e.stopPropagation();
          // Propagate the scroll event to the parent
          const deltaY = e.deltaY;
          window.scrollBy({ top: deltaY, behavior: 'smooth' });
        }
      });
    }
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

  // When expanded, size wrapper to content; when collapsed, clear inline height
  useEffect(() => {
    if (expanded && editorRef.current && wrapperRef.current) {
      updateExpandedHeight();
    } else if (wrapperRef.current) {
      wrapperRef.current.style.height = '';
    }
  }, [expanded, updateExpandedHeight]);

  return (
    <div
      ref={wrapperRef}
      className={`editor-wrapper ${expanded ? 'editor-wrapper--expanded' : ''}`}
    >
      {/* Format Button */}
      <button
        type="button"
        className="button-format rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface2)] px-3 py-1.5 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-inset"
        onClick={onFormatClick}
      >
        Format
      </button>

      {/* Monaco Editor */}
      <Editor
        onMount={handleOnMount}
        onChange={(v) => onChange(v || '')}
        height="100%"
        width="100%"
        defaultLanguage="javascript"
        value={effectiveValue}
        theme={theme}
        options={{
          lineNumbers: 'relative',
          cursorBlinking: 'smooth',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          fontSize: 16, // Scalable font size
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
