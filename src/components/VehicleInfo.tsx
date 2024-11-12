import React from 'react';
import { VehicleData } from '../types';
import { Car, Gauge, Info, Battery, Shield, Scale, Cog, Fuel } from 'lucide-react';

interface VehicleInfoProps {
  data: VehicleData;
}

const VehicleInfo: React.FC<VehicleInfoProps> = ({ data }) => {
  const sections = [
    {
      title: 'Basic Information',
      icon: Car,
      fields: [
        { key: 'Make', value: data['Make'] },
        { key: 'Model', value: data['Model'] },
        { key: 'Model Year', value: data['Model Year'] },
        { key: 'Trim', value: data['Trim'] },
        { key: 'Series', value: data['Series'] },
        { key: 'Body Class', value: data['Body Class'] },
        { key: 'Vehicle Type', value: data['Vehicle Type'] },
      ],
    },
    {
      title: 'Engine Specifications',
      icon: Gauge,
      fields: [
        { key: 'Engine Type', value: data['Engine Model'] },
        { key: 'Displacement (L)', value: data['Displacement (L)'] },
        { key: 'Cylinders', value: data['Engine Number of Cylinders'] },
        { key: 'Engine Configuration', value: data['Engine Configuration'] },
        { key: 'Engine Power (HP)', value: data['Engine Power (HP)'] },
        { key: 'Valve Train Design', value: data['Valve Train Design'] },
        { key: 'Fuel Type', value: data['Fuel Type - Primary'] },
        { key: 'Fuel Injection Type', value: data['Fuel Injection Type'] },
        { key: 'Alternative Fuel', value: data['Alternative Fuel Type'] },
      ],
    },
    {
      title: 'Transmission & Drive',
      icon: Cog,
      fields: [
        { key: 'Transmission Style', value: data['Transmission Style'] },
        { key: 'Transmission Speeds', value: data['Transmission Speeds'] },
        { key: 'Drive Type', value: data['Drive Type'] },
        { key: 'Axles', value: data['Axles'] },
        { key: 'Brake System', value: data['Brake System Type'] },
      ],
    },
    {
      title: 'Dimensions & Capacity',
      icon: Scale,
      fields: [
        { key: 'Doors', value: data['Doors'] },
        { key: 'Seating Capacity', value: data['Seat Belts - All'] },
        { key: 'Wheelbase', value: data['Wheelbase'] },
        { key: 'Gross Weight Rating', value: data['Gross Vehicle Weight Rating'] },
        { key: 'Curb Weight', value: data['Curb Weight'] },
        { key: 'Wheel Size Front', value: data['Wheel Size Front (in)'] },
        { key: 'Wheel Size Rear', value: data['Wheel Size Rear (in)'] },
      ],
    },
    {
      title: 'Safety Features',
      icon: Shield,
      fields: [
        { key: 'Anti-lock Braking', value: data['Anti-Lock Braking System (ABS)'] },
        { key: 'Electronic Stability Control', value: data['Electronic Stability Control (ESC)'] },
        { key: 'Traction Control', value: data['Traction Control'] },
        { key: 'Airbag Locations', value: data['Airbag Locations'] },
        { key: 'Driver Assist', value: data['Driver Assistance'] },
        { key: 'Adaptive Cruise Control', value: data['Adaptive Cruise Control'] },
        { key: 'Parking Assist', value: data['Parking Assist'] },
      ],
    },
    {
      title: 'Manufacturing Details',
      icon: Info,
      fields: [
        { key: 'Manufacturer', value: data['Manufacturer Name'] },
        { key: 'Plant City', value: data['Plant City'] },
        { key: 'Plant State', value: data['Plant State'] },
        { key: 'Plant Country', value: data['Plant Country'] },
        { key: 'Plant Company', value: data['Plant Company Name'] },
        { key: 'Production Sequence', value: data['Sequential Number'] },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Information</h2>
      
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center mb-4">
              <section.icon className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
            </div>
            <dl className="space-y-2">
              {section.fields.map(
                ({ key, value }) =>
                  value && value !== 'Not Applicable' && (
                    <div key={key} className="flex flex-col">
                      <dt className="text-sm font-medium text-gray-500">{key}</dt>
                      <dd className="text-sm text-gray-900">{value}</dd>
                    </div>
                  )
              )}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleInfo;