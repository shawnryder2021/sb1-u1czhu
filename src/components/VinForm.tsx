import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface VinFormProps {
  onSubmit: (vin: string) => void;
  loading: boolean;
}

const VinForm: React.FC<VinFormProps> = ({ onSubmit, loading }) => {
  const [vin, setVin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vin.length === 17) {
      onSubmit(vin);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-2">
          Vehicle Identification Number (VIN)
        </label>
        <div className="relative">
          <input
            type="text"
            id="vin"
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter 17-character VIN"
            maxLength={17}
            pattern="[A-HJ-NPR-Z0-9]{17}"
            required
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {vin.length}/17 characters
        </p>
      </div>

      <button
        type="submit"
        disabled={vin.length !== 17 || loading}
        className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white ${
          loading || vin.length !== 17
            ? 'bg-indigo-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
        } transition-colors duration-200`}
      >
        {loading ? (
          <Loader2 className="animate-spin h-5 w-5" />
        ) : (
          <>
            <Search className="h-5 w-5 mr-2" />
            Decode VIN
          </>
        )}
      </button>
    </form>
  );
};

export default VinForm;