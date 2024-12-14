import CellList from '@/components/cell-list/cell-list.tsx';
import { Cell } from '@/state/cell.ts';

export default function TryNow() {
  function generateUniqueId(): string {
    return `cell_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  }

  const cells: Cell[] = [
    {
      id: generateUniqueId(),
      type: 'text',
      content: `# Welcome to Unfeathered Notes! 🚀\n\nExplore the powerful features of this app. Create, edit, and organize your notes effortlessly.\n\n### Key Features:\n- **Rich Text Editing**: Style your text with headings, bold, italics, and more.\n- **Code Blocks**: Write and execute code snippets with syntax highlighting.\n- **Dynamic Cells**: Rearrange, add, or delete cells to suit your workflow.\n\nLet's dive in! 👇`,
    },
    {
      id: generateUniqueId(),
      type: 'text',
      content: `## Rich Text Editor\n\nThis is an example of a **rich text cell**. You can format your content with:\n\n- **Bold Text**\n- _Italics_\n- [Links](https://unfeathered.com)\n- Lists:\n  - Bullet Points\n  - Numbered Items\n\nTry editing this text to see how it works!`,
    },
    {
      id: generateUniqueId(),
      type: 'code',
      content: `// Example: JavaScript Function\n// Define a function to greet users\nfunction greetUser(name) {\n  return \`Welcome, \${name}!\`;\n}\n\n// Call the function\nconsole.log(greetUser('Unfeathered User'));`,
    },
    {
      id: generateUniqueId(),
      type: 'text',
      content: `## Dynamic Cell Layout\n\nYou can rearrange cells by dragging and dropping them. This allows you to structure your notes in the way that best suits your workflow.\n\n💡 **Pro Tip**: Add new cells by clicking the **+** button!`,
    },
    {
      id: generateUniqueId(),
      type: 'code',
      content: `// Example: Looping through an array\nconst items = ['Rich Text', 'Code Blocks', 'Dynamic Layout'];\n\nitems.forEach((item, index) => {\n  console.log(\`\${index + 1}. \${item}\`);\n});`,
    },
    {
      id: generateUniqueId(),
      type: 'text',
      content: `## Markdown Support\n\nUnfeathered Notes supports **Markdown** syntax for easy formatting. You can use:\n\n- \`Inline Code\`\n- ### Headings\n- Blockquotes:\n> This is a blockquote!\n\nStart writing your notes using Markdown and see how it renders!`,
    },
    {
      id: generateUniqueId(),
      type: 'code',
      content: `// Example: Styling with Tailwind CSS\nconst buttonStyle = {\n  className: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',\n};\n\nconsole.log('Styled with Tailwind CSS:', buttonStyle);`,
    },
    {
      id: generateUniqueId(),
      type: 'text',
      content: `## Ready to Start?\n\nThat’s a brief overview of Unfeathered Notes. Try exploring its features:\n\n1. Edit any cell by clicking on it.\n2. Rearrange cells to customize your layout.\n3. Add new cells to expand your notes.\n\nStart creating your masterpiece now! 🎉`,
    },
  ];

  return (
    <div className={'min-h-[80vh] container mx-auto flex flex-col py-12'}>
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Main Area */}
        <main className="flex-1 p-8 bg-white dark:bg-gray-900">
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-8">
            Welcome to Notes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Hit the{' '}
            <span className="font-bold text-primary-light dark:text-primary-dark">
              +
            </span>{' '}
            button to create a new cell. Start typing in the editor below to see
            how it works!
          </p>
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
            <CellList cells={cells} />
          </div>
        </main>
      </div>
    </div>
  );
}
