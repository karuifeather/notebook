import './styles/loader.scss';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="pl1">
        <div className="pl1__a"></div>
        <div className="pl1__b"></div>
        <div className="pl1__c"></div>
      </div>
    </div>
  );
};

export default Loader;
