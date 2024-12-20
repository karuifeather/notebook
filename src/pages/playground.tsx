import Footer from '@/components/footer.tsx';
import Header from '@/components/header.tsx';
import NoteView from '@/components/notes/note-view.tsx';
import { useActions } from '@/hooks/use-actions.ts';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import { insertCellAfter } from '@/state/action-creators/index.ts';
import { Cell, store } from '@/state/index.ts';
import { randomId } from '@/utils/randomId.ts';
import { use, useEffect, useRef } from 'react';

const cells: Cell[] = [
  {
    id: '2',
    type: 'markdown',
    content: `# Welcome to Unfeathered Notes! 🚀\n\n### Key Features:\n- **Rich Text Editing**\n- **Code Blocks**\n- **Dynamic Cells**\n\nLet's dive in! 👇`,
  },
  {
    id: '1',
    type: 'code',
    content: `function greetUser(name) {\n  return \`Welcome, \${name}!\`;\n}\nconsole.log(greetUser('Unfeathered User'));`,
  },
];

export default function Playground() {
  const { createNote, createPlayground } = useActions();
  const playgroundCreated = useTypedSelector(
    (state) => state.temp.playground.created
  );

  const playgroundId = useTypedSelector((state) => state.temp.playground.id);

  const noteIdRef = useRef(playgroundCreated ? playgroundId : randomId());
  const noteId = noteIdRef.current;

  useEffect(() => {
    if (!playgroundCreated) {
      createNote('playground', {
        id: noteId,
        title: 'New Note',
        description: 'This is a new note',
        dependencies: [],
      });
      createPlayground(noteId);

      const initializeCells = () => {
        cells.forEach((cell) => {
          store.dispatch(
            insertCellAfter(noteId, cell.id, cell.type, cell.content)
          );
        });
      };
      initializeCells();
    }
  }, [createNote, createPlayground, noteId, playgroundCreated]);

  return (
    <>
      <Header />
      <NoteView playgroundNoteId={noteId} />
      <Footer />
    </>
  );
}
