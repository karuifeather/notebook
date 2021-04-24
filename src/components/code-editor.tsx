import { useRef } from 'react';
import Editor, { OnChange, OnMount } from '@monaco-editor/react';

interface MonacoEditorProps {
  defaultValue: string;
  onChange(value: string): void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  defaultValue,
  onChange,
}) => {
  const editorRef = useRef<any>();

  const handleOnMount: OnMount = (e, m) => {
    editorRef.current = e;
  };

  const handleOnChange: OnChange = (code) =>
    code ? onChange(code) : onChange('');

  const onFormatClick = () => {
    console.log(editorRef.current);
  };

  return (
    <>
      <button onClick={onFormatClick}>Format</button>
      <Editor
        onMount={handleOnMount}
        onChange={handleOnChange}
        height='90vh'
        defaultLanguage='javascript'
        defaultValue={defaultValue}
        theme='vs-dark'
        value={'ji'}
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
    </>
  );
};

export default MonacoEditor;
