import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pages, total, limit, onPageChange }) {
    if (pages <= 1) return null;

    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    return (
        <div className="flex items-center justify-between py-4">
            {/* Info */}
            <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{start}</span> to <span className="font-semibold">{end}</span> of{' '}
                <span className="font-semibold">{total}</span> results
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title="Previous page"
                >
                    <ChevronLeft size={18} />
                </button>

                {/* Page numbers */}
                <div className="flex gap-1">
                    {[...Array(pages)].map((_, i) => {
                        const pageNum = i + 1;
                        // Show first, last, current, and 2 neighbors
                        if (
                            pageNum === 1 ||
                            pageNum === pages ||
                            Math.abs(pageNum - page) <= 1 ||
                            (pageNum === 2 && page <= 3) ||
                            (pageNum === pages - 1 && page >= pages - 2)
                        ) {
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => onPageChange(pageNum)}
                                    className={`px-3 py-1 rounded text-sm transition ${pageNum === page
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        } else if (pageNum === 2 || pageNum === pages - 1) {
                            return (
                                <span key={`ellipsis-${pageNum}`} className="px-2 py-1">
                                    ...
                                </span>
                            );
                        }
                        return null;
                    })}
                </div>

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === pages}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title="Next page"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}
