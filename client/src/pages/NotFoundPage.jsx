import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-indigo-600 mb-4">404</h1>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Sorry, the page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                <button
                    onClick={() => navigate('/')}
                    className="btn btn-primary inline-flex items-center gap-2"
                >
                    <Home size={18} />
                    Go Back Home
                </button>

                <p className="text-sm text-gray-500 mt-8">
                    Error Code: 404 | Page Not Found
                </p>
            </div>
        </div>
    );
};

export default NotFoundPage;
