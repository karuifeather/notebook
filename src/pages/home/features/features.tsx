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
    <section className="relative bg-gradient-to-t from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-16 px-6">
      <div className="container mx-auto px-6 text-center">
        {/* Section Heading */}
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
          Why Choose{' '}
          <span className="text-primary-light dark:text-primary-dark">
            Notes?
          </span>
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          From brainstorming to execution, Notes empowers your creativity with
          powerful features.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              {/* Icon */}
              <FontAwesomeIcon
                icon={feature.icon}
                className="w-12 h-12 text-primary-light dark:text-primary-dark"
              />
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
