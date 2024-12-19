import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLightbulb,
  faCode,
  faUsers,
  faMobileAlt,
} from '@fortawesome/free-solid-svg-icons';

export default function FeaturesSection() {
  const features = [
    {
      title: 'Modern Design',
      description:
        'Experience a sleek and intuitive interface designed to make creativity effortless and enjoyable.',
      icon: faLightbulb,
    },
    {
      title: 'Code-First Workflow',
      description:
        'Seamlessly integrate text and code with rich syntax highlighting and developer-friendly tools.',
      icon: faCode,
    },
    {
      title: 'Collaborative Tools',
      description:
        'Work in real-time with your team, sharing notes, blocks, and ideas without barriers.',
      icon: faUsers,
    },
    {
      title: 'Responsive Experience',
      description:
        'Access your notebooks anytime, anywhere with a design optimized for all devices.',
      icon: faMobileAlt,
    },
  ];

  return (
    <section className="relative bg-gradient-to-t from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto text-center">
        {/* Section Heading */}
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 sm:text-5xl">
          Why Choose{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Notes?
          </span>
        </h2>
        <p className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          From brainstorming to execution, Notes empowers your creativity with
          powerful features.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-2"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg">
                <FontAwesomeIcon
                  icon={feature.icon}
                  className="w-8 h-8"
                  aria-hidden="true"
                />
              </div>
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {feature.title}
              </h3>
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
