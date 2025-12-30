import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { uploadApi } from '../../api/upload';

interface CSVUploadProps {
  onUpload?: (file: File) => Promise<void>;
  title?: string;
  description?: string;
}

export const CSVUpload: React.FC<CSVUploadProps> = ({
  onUpload,
  title = 'Upload CSV File',
  description = 'Select a CSV file to upload',
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess(false);

    try {
      if (onUpload) {
        await onUpload(file);
      } else {
        await uploadApi.uploadCSV(file);
      }
      setSuccess(true);
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-normal text-black tracking-tight">{title}</h3>
          <p className="text-sm text-gray-600 mt-2">{description}</p>
        </div>

        <div>
          <label
            htmlFor="csv-upload"
            className="block text-xs text-black mb-2 uppercase tracking-wider"
          >
            Select CSV File
          </label>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:border-black file:text-sm file:font-normal file:bg-white file:text-black hover:file:bg-gray-50 file:uppercase file:tracking-wider"
          />
        </div>

        {file && (
          <div className="text-sm text-gray-600">
            Selected: <span className="font-normal text-black">{file.name}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
            File uploaded successfully!
          </div>
        )}

        <Button
          variant="primary"
          onClick={handleUpload}
          disabled={!file || isUploading}
          isLoading={isUploading}
        >
          Upload
        </Button>
      </div>
    </Card>
  );
};


