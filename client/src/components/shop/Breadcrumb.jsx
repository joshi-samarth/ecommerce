import { Link } from 'react-router-dom';

export default function Breadcrumb({ items = [] }) {
    return (
        <nav className="flex gap-2 text-sm mb-6" aria-label="Breadcrumb">
            <Link to="/" className="text-primary hover:underline">
                Home
            </Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <span className="text-gray-400">/</span>
                    {index < items.length - 1 ? (
                        <Link to={item.href} className="text-primary hover:underline">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-600">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
