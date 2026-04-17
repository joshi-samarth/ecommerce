import ProductCard from './ProductCard';
import { Package } from 'lucide-react';

export default function ProductGrid({ products = [], loading = false, emptyMessage = 'No products found' }) {
    // Skeleton loader
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="skeleton aspect-square rounded-xl" />
                ))}
            </div>
        );
    }

    // Empty state
    if (!loading && products.length === 0) {
        return (
            <div className="empty-state py-20">
                <Package size={56} className="mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{emptyMessage}</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
}
