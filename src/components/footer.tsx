export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-700 dark:text-gray-300 py-8">
      <div className="landing-container text-center">
        <h2 className="text-lg font-extrabold text-[var(--accent)]">
          FeatherPad
        </h2>
        <p className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Karuifeather. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
