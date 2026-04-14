import { useEffect } from 'react';

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    confirmVariant = 'warning',
    onConfirm,
    onCancel,
}) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onCancel?.();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    const confirmButtonClass =
        confirmVariant === 'danger'
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : confirmVariant === 'warning'
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>

                {/* Message */}
                <p className="text-gray-600 text-sm mb-6">{message}</p>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
                    >
                        {cancelLabel}
                    </button>
                    <button onClick={onConfirm} className={`px-4 py-2 text-sm font-medium rounded transition ${confirmButtonClass}`}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
