import { Button } from '@/components/button.tsx';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 py-16 px-4 sm:px-6 lg:px-8 text-center">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-16 left-10 w-40 h-40 rounded-full bg-blue-300 dark:bg-blue-700 opacity-50 dark:opacity-70 blur-2xl"></div>
        <div className="absolute bottom-20 right-16 w-48 h-48 rounded-full bg-green-300 dark:bg-green-700 opacity-50 dark:opacity-70 blur-2xl"></div>
      </div>

      {/* Hero Content */}
      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 sm:text-5xl lg:text-6xl">
        Your Ideas,{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          Unfeathered
        </span>
      </h1>
      <p className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Unfeathered Notes is a modern notebook for coding, creativity, and
        collaboration—lightweight, powerful, and beautifully designed.
      </p>

      {/* Call-to-Action Buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button to="/app/create-notebook" cta>
          Get Started
        </Button>
        <Button to="/playground">Try Now</Button>
      </div>

      {/* Decorative Graphic */}
      <div className="mt-12">
        <img
          src="/images/editor.png"
          alt="Preview of Unfeathered Notes"
          className="w-full max-w-4xl mx-auto drop-shadow-lg rounded-lg"
        />
      </div>
    </section>
  );
}
