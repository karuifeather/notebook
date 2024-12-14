import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

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

  const toggleFAQ = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 px-6">
      <div className="container mx-auto text-center">
        {/* Section Heading */}
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
          Frequently Asked{' '}
          <span className="text-primary-light dark:text-primary-dark">
            Questions
          </span>
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Got questions? We’ve got answers.
        </p>

        {/* FAQ List */}
        <div className="mt-12 max-w-3xl mx-auto divide-y divide-gray-200 dark:divide-gray-700">
          {faqs.map((faq, index) => (
            <div key={index} className="py-6 text-left">
              {/* Question */}
              <div
                className="flex justify-between items-center cursor-pointer group"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary-light dark:group-hover:text-primary-dark transition">
                  {faq.question}
                </h3>
                <FontAwesomeIcon
                  icon={openIndex === index ? faChevronUp : faChevronDown}
                  className="text-gray-500 dark:text-gray-400 w-5 h-5 transition-transform duration-300"
                />
              </div>

              {/* Answer */}
              <div
                className={`mt-4 text-gray-600 dark:text-gray-400 text-sm overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? 'max-h-40 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
                style={{
                  transitionProperty: 'max-height, opacity',
                }}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
