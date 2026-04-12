import ProductCard from './ProductCard';
import { Package } from 'lucide-react';

export default function ProductGrid({ products = [], loading = false, emptyMessage = 'No products found' }) {
    // Skeleton loader
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-lg animate-pulse aspect-square" />
                ))}
            </div>
        );
    }

    // Empty state
    if (!loading && products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <Package size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">{emptyMessage}</p>
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
