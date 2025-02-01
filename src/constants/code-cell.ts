/**
 * Default content for new code cells. Shown when a cell is empty and used as
 * initial content when inserting a new code cell so users see the contract.
 */
export const CODE_CELL_STARTER = `// Preview contract (optional):
// - Export a default React component → we render it in #root.
// - Otherwise we run your code as normal JavaScript (DOM, console, etc.).
//
// export default function App() {
//   return <div>Hello, World!</div>;
// }

document.querySelector('#root').innerHTML = '<p>Uncomment the component above or write your own code.</p>';
`;
