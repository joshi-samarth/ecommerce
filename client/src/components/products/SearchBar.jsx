import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

export default function SearchBar({ onSearch = null, placeholder = 'Search products...' }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Debounce search with 400ms delay
    const handleInputChange = useCallback((value) => {
        setSearchTerm(value);

        // Debounce timer
        const timer = setTimeout(() => {
            if (onSearch) {
                onSearch(value);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [onSearch]);

    const handleClear = () => {
        setSearchTerm('');
        if (onSearch) {
            onSearch('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchTerm);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Clear search"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </form>
    );
}

SearchBar.propTypes = {
    onSearch: PropTypes.func,
    placeholder: PropTypes.string,
};
