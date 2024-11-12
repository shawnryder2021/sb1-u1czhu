import React from 'react';
import { History, Clock } from 'lucide-react';

interface SearchHistoryProps {
  history: Array<{ vin: string; timestamp: number }>;
  onSelect: (vin: string) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ history, onSelect }) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">
      <div className="flex items-center mb-4">
        <History className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Recent Searches</h2>
      </div>
      <div className="space-y-3">
        {history.map(({ vin, timestamp }) => (
          <button
            key={`${vin}-${timestamp}`}
            onClick={() => onSelect(vin)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="font-medium text-gray-900">{vin}</span>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {formatTime(timestamp)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchHistory;