import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronLeft } from 'lucide-react';
import axios from '../../api/axios';

import ProductForm from '../../components/admin/products/ProductForm';

export default function AdminProductFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(id ? true : false);

    // Fetch product if editing
    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/admin/products`);
            // Filter the product from the list (since there's no single product endpoint in the spec)
            const fetchedProduct = res.data.data.find((p) => p._id === id);
            if (fetchedProduct) {
                setProduct(fetchedProduct);
            } else {
                toast.error('Product not found');
                navigate('/admin/products');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch product');
            navigate('/admin/products');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            const isEdit = !!id;
            const endpoint = isEdit ? `/api/admin/products/${id}` : '/api/admin/products';
            const method = isEdit ? 'put' : 'post';

            // Prepare FormData for multipart upload
            const submitData = new FormData();

            // Add text fields
            submitData.append('name', formData.name);
            submitData.append('description', formData.description);
            submitData.append('price', formData.price);
            submitData.append('comparePrice', formData.comparePrice || '');
            submitData.append('category', formData.category);
            submitData.append('tags', formData.tags.join(','));
            submitData.append('stock', formData.stock);
            submitData.append('isFeatured', formData.isFeatured);
            submitData.append('isActive', formData.isActive);

            // Add existing images for edit
            if (isEdit && formData.images?.existingImages) {
                submitData.append('existingImages', JSON.stringify(formData.images.existingImages));
            }

            // Add new image files
            if (formData.images?.newFiles) {
                formData.images.newFiles.forEach((file) => {
                    submitData.append('images', file);
                });
            }

            const res = await axios[method](endpoint, submitData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.data.success) {
                toast.success(isEdit ? 'Product updated' : 'Product created');
                navigate('/admin/products');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save product');
        }
    };

    if (id && loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/admin/products')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-3xl font-bold text-gray-900">
                    {id ? 'Edit Product' : 'Create Product'}
                </h1>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <ProductForm
                    product={product}
                    onSubmit={handleSubmit}
                    loading={loading}
                    onCancel={() => navigate('/admin/products')}
                />
            </div>
        </div>
    );
}
