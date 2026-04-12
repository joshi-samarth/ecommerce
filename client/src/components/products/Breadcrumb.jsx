import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function Breadcrumb({ items = [] }) {
    if (items.length === 0) return null;

    return (
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link to="/" className="hover:text-blue-600 transition-colors">
                Home
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <span>/</span>
                    {item.link ? (
                        <Link to={item.link} className="hover:text-blue-600 transition-colors">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 font-semibold">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}

Breadcrumb.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            link: PropTypes.string,
        })
    ),
};
