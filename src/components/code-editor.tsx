import './code-editor.css';
import { useRef } from 'react';
import Editor, { OnChange, OnMount } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';

interface MonacoEditorProps {
  defaultValue: string;
  onChange(value: string): void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  defaultValue,
  onChange,
}) => {
  const editorRef = useRef<any>();

  const handleOnMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleOnChange: OnChange = (code) =>
    code ? onChange(code) : onChange('');

  const onFormatClick = () => {
    const unformattedCode = editorRef.current.getValue();

    try {
      const formattedCode = prettier
        .format(unformattedCode, {
          parser: 'babel',
          plugins: [parser],
          singleQuote: true,
          jsxSingleQuote: true,
          tabWidth: 4,
          semi: true,
        })
        .replace(/\n$/, '');

      editorRef.current.setValue(formattedCode);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className='editor-wrapper'>
      <button
        className='button button-format is-primary is-small'
        onClick={onFormatClick}
      >
        Format
      </button>
      <Editor
        onMount={handleOnMount}
        onChange={handleOnChange}
        height='45vh'
        defaultLanguage='javascript'
        defaultValue={defaultValue}
        theme='vs-dark'
        options={{
          lineNumbers: 'relative',
          cursorBlinking: 'smooth',
          cursorStyle: 'block',
          scrollBeyondLastLine: false,
          wordWrap: 'wordWrapColumn',
          wrappingIndent: 'same',
          fontSize: 16,
          showUnused: false,
          showDeprecated: true,
          minimap: { enabled: false },
          folding: false,
          lineNumbersMinChars: 3,
        }}
      />
    </div>
  );
};

export default MonacoEditor;
