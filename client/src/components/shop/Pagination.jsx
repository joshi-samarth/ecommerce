import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page = 1, pages = 1, onPageChange = () => { } }) {
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisible = 5;
        let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
        let endPage = Math.min(pages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            pageNumbers.push(1);
            if (startPage > 2) {
                pageNumbers.push('...');
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        if (endPage < pages) {
            if (endPage < pages - 1) {
                pageNumbers.push('...');
            }
            pageNumbers.push(pages);
        }

        return pageNumbers;
    };

    const handlePrevious = () => {
        if (page > 1) {
            onPageChange(page - 1);
        }
    };

    const handleNext = () => {
        if (page < pages) {
            onPageChange(page + 1);
        }
    };

    const isDarkMode = false;

    return (
        <div className="flex items-center justify-center gap-1">
            <button
                onClick={handlePrevious}
                disabled={page === 1}
                className={`p-2.5 rounded-lg border transition-all ${page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                aria-label="Previous page"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1 px-2">
                {getPageNumbers().map((pageNum, index) => {
                    if (pageNum === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="px-2 py-2 text-gray-400 text-sm">
                                •••
                            </span>
                        );
                    }

                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${pageNum === page
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600'
                                }`}
                            aria-current={pageNum === page ? 'page' : undefined}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={handleNext}
                disabled={page === pages}
                className={`p-2.5 rounded-lg border transition-all ${page === pages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                aria-label="Next page"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
