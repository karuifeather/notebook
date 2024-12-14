import CellList from '@/components/cell-list/cell-list.tsx';

export default function TryNow() {
  return (
    <div className={'min-h-[80vh] container mx-auto flex flex-col py-12'}>
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Main Area */}
        <main className="flex-1 p-8 bg-white dark:bg-gray-900">
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-8">
            Welcome to Notes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Hit the{' '}
            <span className="font-bold text-primary-light dark:text-primary-dark">
              +
            </span>{' '}
            button to create a new cell. Start typing in the editor below to see
            how it works!
          </p>
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
            <CellList />
          </div>
        </main>
      </div>
    </div>
  );
}
