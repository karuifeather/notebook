import { Button } from '@/components/button.tsx';

export default function HeroSection() {
  return (
    <section
      className="relative py-10 sm:py-12 text-center"
      style={{
        background: 'linear-gradient(to bottom, var(--bg), var(--surface-2))',
      }}
    >
      <div className="landing-container">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-8 left-10 w-32 h-32 rounded-full opacity-30 dark:opacity-20 blur-2xl bg-[var(--accent)]"></div>
          <div className="absolute bottom-16 right-12 w-40 h-40 rounded-full bg-green-300 dark:bg-green-700 opacity-50 dark:opacity-70 blur-2xl"></div>
        </div>

        {/* Hero Content */}
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 sm:text-4xl lg:text-5xl">
          Your Ideas, <span className="text-[var(--accent)]">FeatherPad</span>
        </h1>
        <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-landing-narrow mx-auto">
          Notes as blocks. Code that runs in the browser. Everything stays on
          your device.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button to="/playground" cta>
            Try now
          </Button>
          <Button to="/app">Create a notebook</Button>
        </div>

        {/* Decorative Graphic */}
        <div className="mt-8">
          <img
            src="/images/editor.gif"
            alt="Preview of FeatherPad"
            className="w-full max-w-3xl mx-auto drop-shadow-lg rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}
