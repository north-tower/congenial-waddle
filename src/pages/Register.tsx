import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light text-black mb-3 tracking-tight">Join</h1>
          <p className="text-gray-600 text-sm">Create a new account to start comparing retailers</p>
        </div>
        <div className="bg-white border border-gray-200 p-8">
          <RegisterForm onSuccess={handleSuccess} />
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-black hover:text-gray-600 underline-offset-4 hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};


