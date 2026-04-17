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
                <Search className="absolute left-3.5 text-gray-400 pointer-events-none" size={18} />
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="input pl-10 pr-10"
                />
                {inputValue && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        aria-label="Clear search"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}
