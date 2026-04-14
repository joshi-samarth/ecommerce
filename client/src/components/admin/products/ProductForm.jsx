import { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import { X } from 'lucide-react';
import axios from '../../../api/axios';

export default function ProductForm({ product, onSubmit, loading }) {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        price: '',
        comparePrice: '',
        category: '',
        tags: [],
        tagInput: '',
        stock: '',
        isFeatured: false,
        isActive: true,
    });

    const [categories, setCategories] = useState([]);
    const [imageData, setImageData] = useState({
        existingImages: [],
        newFiles: [],
    });
    const [slugPreview, setSlugPreview] = useState('');

    // Generate slug
    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/admin/categories');
                if (response.data.success) {
                    setCategories(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Populate form if editing
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                slug: product.slug || '',
                description: product.description || '',
                price: product.price || '',
                comparePrice: product.comparePrice || '',
                category: product.category?._id || '',
                tags: product.tags || [],
                tagInput: '',
                stock: product.stock || '',
                isFeatured: product.isFeatured || false,
                isActive: product.isActive !== false,
            });
            setImageData({
                existingImages: product.images || [],
                newFiles: [],
            });
            setSlugPreview(product.slug || '');
        }
    }, [product]);

    // Handle name change and auto-generate slug
    const handleNameChange = (e) => {
        const name = e.target.value;
        setFormData((prev) => ({
            ...prev,
            name,
            ...(product?.name !== name && { slug: '' }), // Clear slug on name change to regenerate
        }));

        const newSlug = generateSlug(name);
        setSlugPreview(newSlug);
    };

    // Handle tag input
    const handleAddTag = () => {
        if (formData.tagInput.trim()) {
            const newTag = formData.tagInput.trim();
            if (!formData.tags.includes(newTag)) {
                setFormData((prev) => ({
                    ...prev,
                    tags: [...prev.tags, newTag],
                    tagInput: '',
                }));
            } else {
                setFormData((prev) => ({ ...prev, tagInput: '' }));
            }
        }
    };

    // Remove tag
    const handleRemoveTag = (tag) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t !== tag),
        }));
    };

    // Calculate discount
    const discountPercent = () => {
        if (formData.comparePrice && formData.price) {
            const compare = parseFloat(formData.comparePrice);
            const price = parseFloat(formData.price);
            if (compare > price) {
                return Math.round(((compare - price) / compare) * 100);
            }
        }
        return 0;
    };

    // Handle submit
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) return;
        if (!formData.description.trim()) return;
        if (!formData.price) return;
        if (!formData.category) return;
        if (!formData.stock) return;

        const submitData = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
            category: formData.category,
            slug: formData.slug || generateSlug(formData.name),
            tags: formData.tags,
            stock: parseInt(formData.stock),
            isFeatured: formData.isFeatured,
            isActive: formData.isActive,
            // Send images data in the correct structure
            images: {
                existingImages: imageData.existingImages,
                newFiles: imageData.newFiles,
            },
        };

        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* BASIC INFO */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

                {/* Name */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={handleNameChange}
                        placeholder="Enter product name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                    />
                    {slugPreview && (
                        <p className="text-xs text-gray-500 mt-2">
                            <span className="font-semibold">Slug preview:</span> {slugPreview}
                        </p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter product description (min 20 characters)"
                        rows="5"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={formData.tagInput}
                            onChange={(e) => setFormData((prev) => ({ ...prev, tagInput: e.target.value }))}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            placeholder="Add tags and press Enter"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Add
                        </button>
                    </div>
                    {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag) => (
                                <div key={tag} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="hover:text-blue-600"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* PRICING */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>

                <div className="grid grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                            placeholder="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    {/* Compare Price */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Compare Price (₹)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.comparePrice}
                            onChange={(e) => setFormData((prev) => ({ ...prev, comparePrice: e.target.value }))}
                            placeholder="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                        {discountPercent() > 0 && (
                            <p className="text-xs text-green-600 mt-2">
                                <span className="font-semibold">{discountPercent()}% discount</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Stock */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
                    <input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                        placeholder="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                    />
                    {parseInt(formData.stock) <= 10 && parseInt(formData.stock) > 0 && (
                        <p className="text-xs text-amber-600 mt-2">⚠️ Low stock warning</p>
                    )}
                </div>
            </div>

            {/* IMAGES */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
                <ImageUploader images={imageData.existingImages} onChange={setImageData} maxImages={5} />
            </div>

            {/* SETTINGS */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>

                <div className="grid grid-cols-2 gap-4">
                    {/* Active */}
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                            className="w-5 h-5 accent-blue-600"
                        />
                        <span className="text-sm font-semibold text-gray-700">
                            {formData.isActive ? '✅ Published' : '❌ Unpublished'}
                        </span>
                    </label>

                    {/* Featured */}
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isFeatured}
                            onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                            className="w-5 h-5 accent-purple-600"
                        />
                        <span className="text-sm font-semibold text-gray-700">
                            {formData.isFeatured ? '⭐ Featured' : 'Not Featured'}
                        </span>
                    </label>
                </div>

                {product && (
                    <p className="text-xs text-gray-500">
                        Last updated: {new Date(product.updatedAt).toLocaleDateString()}
                    </p>
                )}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                >
                    {loading ? 'Saving...' : 'Save Product'}
                </button>
            </div>
        </form>
    );
}
