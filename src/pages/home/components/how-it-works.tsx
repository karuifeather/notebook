import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboard,
  faEdit,
  faShareSquare,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

export default function HowItWorks() {
  const steps = [
    {
      title: 'Create a Notebook',
      description:
        'Start by creating a new notebook for your project, notes, or ideas. Organize everything in one place.',
      icon: faClipboard,
    },
    {
      title: 'Add Notes & Code',
      description:
        'Use rich text blocks and code blocks with syntax highlighting to bring your ideas to life.',
      icon: faEdit,
    },
    {
      title: 'Collaborate & Share',
      description:
        'Invite your team or share with others. Work together in real-time with seamless collaboration tools.',
      icon: faShareSquare,
    },
    {
      title: 'Execute & Succeed',
      description:
        'Turn your ideas into actions. Track your progress and stay organized to achieve your goals.',
      icon: faCheckCircle,
    },
  ];

  return (
    <section className="relative py-16 px-6 bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 ">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-8 w-48 h-48 rounded-full bg-pink-300 dark:bg-pink-700 opacity-50 dark:opacity-70 blur-2xl"></div>
        <div className="absolute top-1/3 right-20 transform -translate-y-1/2 w-64 h-64 rounded-full bg-yellow-300 dark:bg-yellow-600 opacity-40 dark:opacity-60 blur-3xl"></div>
        <div className="absolute bottom-44 left-32 w-48 h-48 rounded-full bg-cyan-300 dark:bg-cyan-700 opacity-40 dark:opacity-60 blur-2xl"></div>
      </div>

      <div className="container mx-auto text-center">
        {/* Section Heading */}
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
          How{' '}
          <span className="text-primary-light dark:text-primary-dark">
            Notes
          </span>{' '}
          Works
        </h2>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Follow these simple steps to turn your ideas into reality.
        </p>

        {/* Timeline */}
        <div className="relative mt-16">
          {/* Vertical Line */}
          <div className="absolute inset-y-0 left-1/2 w-1 bg-gray-300 dark:bg-gray-700 transform -translate-x-1/2"></div>

          {/* Steps */}
          <div className="grid grid-cols-1 ">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center lg:items-${
                  index % 2 === 0 ? 'end' : 'start'
                } relative`}
                data-aos="fade-up"
                data-aos-delay={index * 200}
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-full h-10 w-1 bg-gray-300 dark:bg-gray-700 left-1/2 transform -translate-x-1/2"></div>
                )}

                {/* Icon */}
                <div className="w-28 h-28 flex items-center justify-center rounded-full bg-primary-light dark:bg-primary-dark text-white shadow-lg">
                  <FontAwesomeIcon icon={step.icon} className="w-10 h-10" />
                </div>

                <div
                  className={`relative bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-12 rounded-2xl shadow-xl max-w-lg text-left ${
                    index % 2 === 0 ? 'lg:mr-auto' : 'lg:ml-auto'
                  } mt-8`}
                >
                  {/* Reduced Neon Glow Effect */}
                  <div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-light to-primary-dark opacity-20 blur-md"
                    aria-hidden="true"
                  ></div>

                  {/* Content */}
                  <h3 className="relative text-2xl font-extrabold text-gray-800 dark:text-gray-100 z-10">
                    {step.title}
                  </h3>
                  <p className="relative mt-6 text-lg text-gray-600 dark:text-gray-200 z-10">
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
