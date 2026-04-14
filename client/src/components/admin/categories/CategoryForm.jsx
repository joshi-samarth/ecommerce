import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CategoryForm({ category, onSubmit, loading, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        isActive: true,
        image: null,
        imagePreview: '',
    });

    const [slugPreview, setSlugPreview] = useState('');

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                slug: category.slug || '',
                description: category.description || '',
                isActive: category.isActive !== false,
                image: null,
                imagePreview: category.image || '',
            });
        }
    }, [category]);

    const handleNameChange = (e) => {
        const name = e.target.value;
        setFormData((prev) => ({ ...prev, name }));
        const newSlug = generateSlug(name);
        setSlugPreview(newSlug);
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file),
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim()) return;

        const submitData = {
            name: formData.name,
            description: formData.description,
            isActive: formData.isActive,
            image: formData.image,
            imagePreview: formData.imagePreview,
        };

        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name *</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="Enter category name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                />
                {slugPreview && (
                    <p className="text-xs text-gray-500 mt-1">
                        <span className="font-semibold">Slug:</span> {slugPreview}
                    </p>
                )}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter category description"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
            </div>

            {/* Image */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
                <div className="flex gap-4">
                    {formData.imagePreview && (
                        <div className="relative">
                            <img src={formData.imagePreview} alt="preview" className="w-24 h-24 object-cover rounded border border-gray-300" />
                            <button
                                type="button"
                                onClick={() => setFormData((prev) => ({ ...prev, image: null, imagePreview: '' }))}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
            </div>

            {/* Active */}
            <label className="flex items-center gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="w-5 h-5 accent-blue-600"
                />
                <span className="text-sm font-semibold text-gray-700">
                    {formData.isActive ? '✅ Active' : '❌ Inactive'}
                </span>
            </label>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                >
                    {loading ? 'Saving...' : 'Save Category'}
                </button>
            </div>
        </form>
    );
}
