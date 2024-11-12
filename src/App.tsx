import React, { useState } from 'react';
import { Search, Car, AlertCircle, History, Camera } from 'lucide-react';
import VinForm from './components/VinForm';
import VehicleInfo from './components/VehicleInfo';
import SearchHistory from './components/SearchHistory';
import VinScanner from './components/VinScanner';
import { VehicleData } from './types';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [searchHistory, setSearchHistory] = useState<Array<{vin: string; timestamp: number}>>(() => {
    const saved = localStorage.getItem('vinHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const decodeVin = async (vin: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`
      );
      const data = await response.json();
      
      if (data.Results) {
        const results = data.Results.reduce((acc: any, item: any) => {
          if (item.Value && item.Value !== '0' && item.Value !== 'Not Applicable') {
            acc[item.Variable] = item.Value;
          }
          return acc;
        }, {});
        setVehicleData(results);
        
        // Add to history
        const newHistory = [{ vin, timestamp: Date.now() }, ...searchHistory.slice(0, 9)];
        setSearchHistory(newHistory);
        localStorage.setItem('vinHistory', JSON.stringify(newHistory));
      } else {
        setError('Unable to decode VIN. Please check the number and try again.');
      }
    } catch (err) {
      setError('An error occurred while decoding the VIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (vin: string) => {
    decodeVin(vin);
  };

  const handleScanResult = (result: string) => {
    setShowScanner(false);
    if (result) {
      decodeVin(result);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Car className="h-12 w-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            VIN Decoder Pro
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your Vehicle Identification Number (VIN) to get detailed information about your vehicle
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowScanner(!showScanner)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
              >
                <Camera className="h-4 w-4 mr-2" />
                {showScanner ? 'Hide Scanner' : 'Scan VIN'}
              </button>
            </div>
            
            {showScanner ? (
              <VinScanner onResult={handleScanResult} />
            ) : (
              <VinForm onSubmit={decodeVin} loading={loading} />
            )}
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {vehicleData && <VehicleInfo data={vehicleData} />}

          {searchHistory.length > 0 && (
            <div className="mt-8">
              <SearchHistory history={searchHistory} onSelect={handleHistoryClick} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;