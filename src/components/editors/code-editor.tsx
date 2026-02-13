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
  /** When false, line numbers are hidden. Default true. Used on mobile for a toggle. */
  lineNumbers?: boolean;
  /** When true, editor is in fullscreen; wheel listener is removed so Monaco can scroll. */
  isFullscreen?: boolean;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  defaultValue = '',
  value,
  onChange,
  expanded = false,
  lineNumbers = true,
  isFullscreen = false,
}) => {
  const effectiveValue = value !== undefined ? value : defaultValue;
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const expandedRef = useRef(expanded);
  const isFullscreenRef = useRef(isFullscreen);
  const wheelHandlerRef = useRef<((e: WheelEvent) => void) | null>(null);
  const editorElementRef = useRef<HTMLElement | null>(null);
  const [theme, setTheme] = useState('vs-dark');

  expandedRef.current = expanded;
  isFullscreenRef.current = isFullscreen;

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
      if (
        expandedRef.current &&
        !isFullscreenRef.current &&
        wrapperRef.current
      ) {
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

    // Wheel listener: added in onMount when !fullscreen; effect adds/removes when fullscreen toggles
    const editorElement = editor.getDomNode() ?? null;
    editorElementRef.current = editorElement;
    if (editorElement) {
      const handler = (e: WheelEvent) => {
        if (!editor.hasTextFocus()) {
          e.preventDefault();
          e.stopPropagation();
          window.scrollBy({ top: e.deltaY, behavior: 'smooth' });
        }
      };
      wheelHandlerRef.current = handler;
      if (!isFullscreenRef.current) {
        editorElement.addEventListener('wheel', handler);
      }
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

  const [editorFontSize, setEditorFontSize] = useState(16);

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

  useEffect(() => {
    const getFontSize = () => {
      if (window.matchMedia('(max-width: 380px)').matches) return 11;
      if (window.matchMedia('(max-width: 640px)').matches) return 12;
      return 16;
    };
    setEditorFontSize(getFontSize());
    const mq640 = window.matchMedia('(max-width: 640px)');
    const mq380 = window.matchMedia('(max-width: 380px)');
    const handle = () => setEditorFontSize(getFontSize());
    mq640.addEventListener('change', handle);
    mq380.addEventListener('change', handle);
    return () => {
      mq640.removeEventListener('change', handle);
      mq380.removeEventListener('change', handle);
    };
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) editor.updateOptions({ fontSize: editorFontSize });
  }, [editorFontSize]);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor)
      editor.updateOptions({
        lineNumbers: lineNumbers ? 'relative' : 'off',
      });
  }, [lineNumbers]);

  // Remove wheel listener in fullscreen so Monaco can scroll; re-add when exiting
  useEffect(() => {
    const el = editorElementRef.current;
    const handler = wheelHandlerRef.current;
    if (!el || !handler) return;
    if (isFullscreen) {
      el.removeEventListener('wheel', handler);
      return () => {};
    }
    el.addEventListener('wheel', handler);
    return () => el.removeEventListener('wheel', handler);
  }, [isFullscreen]);

  // When expanded (and not fullscreen), size wrapper to content; when collapsed, clear inline height
  useEffect(() => {
    if (isFullscreen && wrapperRef.current) {
      wrapperRef.current.style.height = '';
    } else if (expanded && editorRef.current && wrapperRef.current) {
      updateExpandedHeight();
    } else if (wrapperRef.current) {
      wrapperRef.current.style.height = '';
    }
  }, [expanded, isFullscreen, updateExpandedHeight]);

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
          lineNumbers: lineNumbers ? 'relative' : 'off',
          cursorBlinking: 'smooth',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          fontSize: editorFontSize,
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
