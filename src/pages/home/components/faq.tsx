import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Is it free?',
      answer:
        'Yes. FeatherPad runs in your browser and does not require an account or payment.',
    },
    {
      question: 'Can I use it offline?',
      answer:
        'Yes. All data is stored in your browser (localStorage). The app works offline; there is no server sync.',
    },
    {
      question: 'Where is my data stored?',
      answer:
        'Only in your browser. Notebooks, notes, and cells are persisted with redux-persist to localStorage. Nothing is sent to a server.',
    },
    {
      question: 'What platforms are supported?',
      answer: 'Any modern desktop browser. Best experience on larger screens.',
    },
    {
      question: 'Can I collaborate with others or share a notebook?',
      answer:
        'Not yet. There is no real-time collaboration or sharing. Each user’s data stays in their own browser.',
    },
    {
      question: 'Is my data encrypted?',
      answer:
        'Data is stored in your browser’s localStorage; it is not encrypted by the app. Use your device’s security (e.g. locked profile) if you need protection.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-10 sm:py-12">
      <div className="landing-container landing-container--narrow text-center">
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 sm:text-3xl">
          Frequently asked{' '}
          <span className="text-[var(--accent)]">questions</span>
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Straight answers about what FeatherPad does today.
        </p>

        <div className="mt-6 divide-y divide-gray-200 dark:divide-gray-700">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="py-4"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <button
                className="flex justify-between items-center w-full cursor-pointer text-left group px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-sm"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 group-hover:text-[var(--accent)] transition-colors">
                  {faq.question}
                </h3>
                <FontAwesomeIcon
                  icon={openIndex === index ? faChevronUp : faChevronDown}
                  className={`text-gray-500 dark:text-gray-400 w-4 h-4 transition-transform duration-300 shrink-0 ml-2 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`mt-2 text-gray-600 dark:text-gray-400 text-sm overflow-hidden transition-all duration-500 ${
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
