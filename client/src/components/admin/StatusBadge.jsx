export default function StatusBadge({ status, type = 'product' }) {
    const getStyles = () => {
        switch (type) {
            case 'product':
            case 'coupon':
                if (status === 'active' || status === true) {
                    return 'badge badge-success';
                } else if (status === 'inactive' || status === false) {
                    return 'badge badge-secondary';
                }
                break;

            case 'stock':
                if (status === 'outofstock') {
                    return 'badge badge-danger';
                } else if (status === 'lowstock') {
                    return 'badge badge-warning';
                } else if (status === 'instock') {
                    return 'badge badge-success';
                }
                break;

            case 'featured':
                if (status === true) {
                    return 'badge badge-primary text-sm';
                } else {
                    return 'badge badge-secondary';
                }

            case 'expired':
                return 'badge badge-danger';

            default:
                return 'badge badge-secondary';
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
                return status === true ? '★ Featured' : 'Not Featured';
            case 'expired':
                return 'Expired';
            default:
                return String(status);
        }
    };

    return (
        <span className={`inline-block font-semibold ${getStyles()}`}>
            {getLabel()}
        </span>
    );
}
