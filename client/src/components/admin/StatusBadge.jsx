export default function StatusBadge({ status, type = 'product' }) {
    const getStyles = () => {
        switch (type) {
            case 'product':
            case 'coupon':
                if (status === 'active' || status === true) {
                    return 'bg-green-100 text-green-800';
                } else if (status === 'inactive' || status === false) {
                    return 'bg-gray-100 text-gray-800';
                }
                break;

            case 'stock':
                if (status === 'outofstock') {
                    return 'bg-red-100 text-red-800';
                } else if (status === 'lowstock') {
                    return 'bg-amber-100 text-amber-800';
                } else if (status === 'instock') {
                    return 'bg-green-100 text-green-800';
                }
                break;

            case 'featured':
                if (status === true) {
                    return 'bg-purple-100 text-purple-800';
                } else {
                    return 'bg-gray-100 text-gray-800';
                }

            case 'expired':
                return 'bg-red-100 text-red-800';

            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getLabel = () => {
        switch (type) {
            case 'product':
            case 'coupon':
                return status === 'active' || status === true ? 'Active' : 'Inactive';
            case 'stock':
                if (status === 'outofstock') return 'Out of Stock';
                if (status === 'lowstock') return 'Low Stock';
                return 'In Stock';
            case 'featured':
                return status === true ? '⭐ Featured' : 'Not Featured';
            case 'expired':
                return 'Expired';
            default:
                return String(status);
        }
    };

    return (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStyles()}`}>
            {getLabel()}
        </span>
    );
}
