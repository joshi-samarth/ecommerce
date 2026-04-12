import { Search, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function SearchBar({
    value = '',
    onChange = () => { },
    onSearch = () => { },
    placeholder = 'Search products...',
}) {
    const [inputValue, setInputValue] = useState(value);
    const debounceTimer = useRef(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);

        // Debounce the search
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            onSearch(newValue);
        }, 400);
    };

    const handleClear = () => {
        setInputValue('');
        onChange('');
        onSearch('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            onSearch(inputValue);
        }
    };

    return (
        <div className="relative flex-1">
            <div className="relative flex items-center">
                <Search className="absolute left-3 text-gray-400" size={20} />
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {inputValue && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Clear search"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>
        </div>
    );
}
