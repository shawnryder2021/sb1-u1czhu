import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, AlertCircle } from 'lucide-react';
import Quagga from '@ericblade/quagga2';

interface VinScannerProps {
  onResult: (result: string) => void;
}

const VinScanner: React.FC<VinScannerProps> = ({ onResult }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [detections, setDetections] = useState<string[]>([]);

  const isValidVin = (code: string) => {
    // Basic VIN validation (17 alphanumeric characters, excluding I, O, Q)
    return /^[A-HJ-NPR-Z0-9]{17}$/.test(code);
  };

  const processResult = (code: string) => {
    if (isValidVin(code)) {
      // Add to detections array
      setDetections(prev => {
        const newDetections = [...prev, code];
        // If we have 3 identical consecutive scans, consider it valid
        if (newDetections.length >= 3 && 
            newDetections.slice(-3).every(d => d === code)) {
          onResult(code);
          Quagga.stop();
          return [];
        }
        // Keep only last 5 detections
        return newDetections.slice(-5);
      });
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      const config = {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: videoRef.current,
          constraints: {
            facingMode: "environment",
            aspectRatio: { min: 1, max: 2 },
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 },
          },
          area: {
            top: "25%",
            right: "10%",
            left: "10%",
            bottom: "25%",
          },
        },
        decoder: {
          readers: [
            "code_128_reader",
            "code_39_reader",
            "upc_reader",
            "upc_e_reader",
            "ean_reader",
            "ean_8_reader"
          ],
          debug: {
            drawBoundingBox: true,
            showPattern: true,
          },
          multiple: false,
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        frequency: 10,
      };

      Quagga.init(config, (err) => {
        if (err) {
          setError("Camera initialization failed. Please ensure you've granted camera permissions.");
          console.error(err);
          return;
        }
        setScanning(true);
        Quagga.start();
      });

      Quagga.onDetected((result) => {
        if (result.codeResult) {
          const code = result.codeResult.code;
          if (code) {
            processResult(code);
          }
        }
      });

      return () => {
        Quagga.stop();
        setScanning(false);
      };
    }
  }, [onResult]);

  return (
    <div className="relative">
      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}
      
      <div 
        ref={videoRef} 
        className="rounded-lg overflow-hidden bg-black"
        style={{ minHeight: '400px' }}
      />
      
      {scanning && (
        <>
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner markers for visual guidance */}
            <div className="absolute top-[25%] left-[10%] w-8 h-8 border-l-2 border-t-2 border-indigo-500"></div>
            <div className="absolute top-[25%] right-[10%] w-8 h-8 border-r-2 border-t-2 border-indigo-500"></div>
            <div className="absolute bottom-[25%] left-[10%] w-8 h-8 border-l-2 border-b-2 border-indigo-500"></div>
            <div className="absolute bottom-[25%] right-[10%] w-8 h-8 border-r-2 border-b-2 border-indigo-500"></div>
            
            {/* Scanning area indicator */}
            <div className="absolute top-[25%] left-[10%] right-[10%] bottom-[25%] border-2 border-dashed border-white/50"></div>
          </div>
          
          {/* Scanning animation */}
          <div 
            className="absolute top-[25%] left-[10%] right-[10%] h-0.5 bg-indigo-500"
            style={{
              animation: 'scan 2s linear infinite',
              boxShadow: '0 0 8px rgba(99, 102, 241, 0.6)',
            }}
          ></div>
        </>
      )}

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(calc(50vh - 25%)); }
          100% { transform: translateY(0); }
        }
      `}</style>

      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-600 text-center">
          {scanning ? (
            "Position the VIN barcode within the frame and hold steady"
          ) : (
            "Initializing camera..."
          )}
        </p>
        <p className="text-xs text-gray-500 text-center">
          For best results, ensure good lighting and a clear view of the barcode
        </p>
      </div>
    </div>
  );
};

export default VinScanner;