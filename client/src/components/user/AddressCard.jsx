import React from 'react';

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
    return (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-lg text-gray-800">{address.fullName}</h3>
                {address.isDefault && (
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                        📌 Default
                    </span>
                )}
            </div>

            <div className="space-y-2 text-gray-600 mb-6">
                <p className="text-sm">
                    <span className="font-medium">Phone:</span> {address.phone}
                </p>
                <p className="text-sm">
                    <span className="font-medium">Address:</span> {address.line1}
                    {address.line2 && <>, {address.line2}</>}
                </p>
                <p className="text-sm">
                    <span className="font-medium">Location:</span> {address.city}, {address.state} {address.pincode}
                </p>
                <p className="text-sm">
                    <span className="font-medium">Country:</span> {address.country}
                </p>
            </div>

            <div className="flex gap-2 justify-end">
                <button
                    onClick={() => onEdit(address)}
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition font-medium"
                >
                    ✏️ Edit
                </button>
                {!address.isDefault && (
                    <button
                        onClick={() => onSetDefault(address._id)}
                        className="px-3 py-1 text-sm bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition font-medium"
                    >
                        📌 Set Default
                    </button>
                )}
                <button
                    onClick={() => onDelete(address._id)}
                    className="px-3 py-1 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition font-medium"
                >
                    🗑️ Delete
                </button>
            </div>
        </div>
    );
};

export default AddressCard;
