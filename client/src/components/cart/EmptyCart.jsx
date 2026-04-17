import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

export default function EmptyCart() {
    const navigate = useNavigate();

    return (
        <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3 className="empty-state h3">Your cart is empty</h3>
            <p className="empty-state p">Looks like you haven't added anything yet.</p>
            <button
                onClick={() => navigate('/products')}
                className="btn btn-primary"
            >
                Shop Now
            </button>
        </div>
    );
}
