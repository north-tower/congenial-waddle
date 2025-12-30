import React from 'react';
import { CSVUpload } from '../components/admin/CSVUpload';
import { DataManagement } from '../components/admin/DataManagement';

export const Admin: React.FC = () => {
  // Note: Backend doesn't have role-based access control yet
  // All authenticated users can access admin routes
  // If you need role-based access, update the backend to include role field

  const handleRefresh = () => {
    // TODO: Implement data refresh
    console.log('Refreshing data');
  };

  const handleClearCache = () => {
    // TODO: Implement cache clearing
    console.log('Clearing cache');
  };

  // Show admin panel to all authenticated users
  // Add role check here if backend adds role field

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-light text-black mb-3 tracking-tight">Admin Panel</h1>
          <p className="text-gray-600 text-sm">Manage retailers, countries, and comparison data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 p-8">
            <CSVUpload
              title="Upload Retailer Data"
              description="Upload a CSV file containing retailer shipping data"
            />
          </div>
          <div className="bg-white border border-gray-200 p-8">
            <DataManagement onRefresh={handleRefresh} onClearCache={handleClearCache} />
          </div>
        </div>
      </div>
    </div>
  );
};


