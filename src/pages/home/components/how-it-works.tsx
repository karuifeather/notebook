import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboard,
  faEdit,
  faPlay,
  faDatabase,
} from '@fortawesome/free-solid-svg-icons';

export default function HowItWorks() {
  const steps = [
    {
      title: 'Create a notebook',
      description:
        'Create a notebook and give it a name. You can set a cover image and add a description.',
      icon: faClipboard,
    },
    {
      title: 'Add notes and blocks',
      description:
        'Add notes inside the notebook. Each note is a list of blocks: markdown, code, rich text, callouts, images, tables, checklists, or embeds. Use the + control to add blocks; drag to reorder.',
      icon: faEdit,
    },
    {
      title: 'Run code',
      description:
        'Code cells bundle on edit. Use bare imports (e.g. lodash); versions are resolved and pinned per note. Preview runs in an iframe; you can view console output too.',
      icon: faPlay,
    },
    {
      title: 'Everything stays local',
      description:
        'Notebooks, notes, and cells are saved to your browser with Redux and localStorage. No server and no account required.',
      icon: faDatabase,
    },
  ];

  return (
    <section
      className="relative py-10 sm:py-12"
      style={{
        background: 'linear-gradient(to bottom, var(--surface-2), var(--bg))',
      }}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-8 left-8 w-32 h-32 rounded-full bg-pink-300 dark:bg-pink-700 opacity-50 dark:opacity-70 blur-2xl"></div>
        <div className="absolute top-1/3 right-12 w-40 h-40 rounded-full bg-yellow-300 dark:bg-yellow-600 opacity-40 dark:opacity-60 blur-3xl"></div>
        <div className="absolute bottom-32 left-24 w-32 h-32 rounded-full bg-[var(--accent)] opacity-30 dark:opacity-20 blur-2xl"></div>
      </div>

      <div className="landing-container text-center">
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 sm:text-3xl">
          How <span className="text-[var(--accent)]">FeatherPad</span> works
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-landing-narrow mx-auto">
          Create notebooks, add notes and blocks, run code in the browser. All
          data is stored locally.
        </p>

        <div className="relative mt-8">
          <div
            className="absolute inset-y-0 left-1/2 w-px transform -translate-x-1/2 hidden lg:block"
            style={{ backgroundColor: 'var(--border)' }}
          ></div>

          <div className="grid grid-cols-1 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center lg:flex-row lg:items-stretch lg:justify-center lg:${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} relative gap-4`}
                data-aos="fade-up"
                data-aos-delay={index * 200}
              >
                <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-md lg:relative lg:top-0 lg:translate-y-0">
                  <FontAwesomeIcon icon={step.icon} className="w-6 h-6" />
                </div>

                <div
                  className="relative border p-5 sm:p-6 rounded-xl shadow-md w-full max-w-lg text-left"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-200">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
