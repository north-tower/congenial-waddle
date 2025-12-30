import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface DataManagementProps {
  onRefresh?: () => void;
  onClearCache?: () => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({
  onRefresh,
  onClearCache,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-normal text-black mb-6 tracking-tight">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-6 border border-gray-200">
            <div>
              <h4 className="font-normal text-black mb-1">Refresh Data</h4>
              <p className="text-sm text-gray-600">Reload all data from the database</p>
            </div>
            <Button variant="outline" onClick={onRefresh}>
              Refresh
            </Button>
          </div>

          <div className="flex items-center justify-between p-6 border border-gray-200">
            <div>
              <h4 className="font-normal text-black mb-1">Clear Cache</h4>
              <p className="text-sm text-gray-600">Clear all cached data</p>
            </div>
            <Button variant="outline" onClick={onClearCache}>
              Clear Cache
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};


