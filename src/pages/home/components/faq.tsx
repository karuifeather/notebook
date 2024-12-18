import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Is it free?',
      answer: 'Yes, Notes is free to use with all core features.',
    },
    {
      question: 'Can I use it offline?',
      answer:
        'Yes, you can use Notes offline. Changes made offline will sync automatically when you reconnect to the internet.',
    },
    {
      question: 'What platforms are supported?',
      answer: 'Notes works seamlessly on web browsers on bigger screens.',
    },
    {
      question: 'Can I collaborate with others?',
      answer:
        'Absolutely! Notes allows real-time collaboration with team members, making it perfect for projects and teamwork.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Your data is encrypted and securely stored. We prioritize your privacy and security at all times.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto text-center">
        {/* Section Heading */}
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 sm:text-5xl">
          Frequently Asked{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Questions
          </span>
        </h2>
        <p className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Got questions? We’ve got answers.
        </p>

        {/* FAQ List */}
        <div className="mt-12 max-w-3xl mx-auto divide-y divide-gray-200 dark:divide-gray-700">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="py-6"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Question */}
              <button
                className="flex justify-between items-center w-full cursor-pointer text-left group px-6 py-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-md"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {faq.question}
                </h3>
                <FontAwesomeIcon
                  icon={openIndex === index ? faChevronUp : faChevronDown}
                  className={`text-gray-500 dark:text-gray-400 w-5 h-5 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer */}
              <div
                className={`mt-4 text-gray-600 dark:text-gray-400 text-base overflow-hidden transition-all duration-500 ${
                  openIndex === index
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
