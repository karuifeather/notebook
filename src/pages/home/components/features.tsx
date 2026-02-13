import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faCode,
  faLock,
  faFolderOpen,
  faPalette,
  faMobileAlt,
} from '@fortawesome/free-solid-svg-icons';

export default function FeaturesSection() {
  const features = [
    {
      title: 'Notebooks & notes',
      description:
        'Create notebooks and add notes inside them. Edit titles and descriptions; reorder notes by drag-and-drop.',
      icon: faFolderOpen,
    },
    {
      title: 'Blocks',
      description:
        'Notes are lists of blocks: markdown, rich text, code, callouts, images, tables, checklists, and link embeds. Add, delete, or reorder with the gutter.',
      icon: faLayerGroup,
    },
    {
      title: 'Code cells & preview',
      description:
        'Write JavaScript/JSX in code cells. Code is bundled with esbuild and runs in an iframe; switch between preview and console output.',
      icon: faCode,
    },
    {
      title: 'Local-only data',
      description:
        'All data is stored in your browser (localStorage). No account or server; your notebooks never leave your device.',
      icon: faLock,
    },
    {
      title: 'Dark mode & focus',
      description:
        'Toggle dark mode. Use focus mode (shortcut) to hide the sidebar and focus on the current note.',
      icon: faPalette,
    },
    {
      title: 'Works in the browser',
      description:
        'Use FeatherPad in any modern desktop browser. No install required.',
      icon: faMobileAlt,
    },
  ];

  return (
    <section className="relative bg-gradient-to-t from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-10 sm:py-12">
      <div className="landing-container text-center">
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 sm:text-3xl">
          What <span className="text-[var(--accent)]">FeatherPad</span> does
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-landing-narrow mx-auto">
          Everything below is available today. No backend; data stays in your
          browser.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-3 bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-[var(--accent)] text-white rounded-full">
                <FontAwesomeIcon
                  icon={feature.icon}
                  className="w-5 h-5"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
