import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import axios from '../../api/axios';

import CategoryTable from '../../components/admin/categories/CategoryTable';
import CategoryForm from '../../components/admin/categories/CategoryForm';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // Delete confirmation
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, category: null });

    // Fetch categories
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/admin/categories');
            if (res.data.success) {
                setCategories(res.data.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = () => {
        setEditingCategory(null);
        setShowForm(true);
    };

    const handleEditClick = (category) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            setFormLoading(true);
            const isEdit = !!editingCategory;
            const endpoint = isEdit ? `/api/admin/categories/${editingCategory._id}` : '/api/admin/categories';
            const method = isEdit ? 'put' : 'post';

            // Prepare FormData for multipart upload
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('description', formData.description || '');
            submitData.append('isActive', formData.isActive);

            // Add image if it's a new file (not just a URL)
            if (formData.image instanceof File) {
                submitData.append('image', formData.image);
            }

            const res = await axios[method](endpoint, submitData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.data.success) {
                toast.success(isEdit ? 'Category updated' : 'Category created');
                setShowForm(false);
                setEditingCategory(null);
                fetchCategories();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save category');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteClick = (category) => {
        setDeleteConfirm({ isOpen: true, category });
    };

    const handleDeleteConfirm = async () => {
        try {
            if (!deleteConfirm.category?._id) {
                toast.error('Category ID missing');
                return;
            }
            setFormLoading(true);
            const res = await axios.delete(`/api/admin/categories/${deleteConfirm.category._id}`);
            if (res.data.success) {
                toast.success('Category deleted');
                setDeleteConfirm({ isOpen: false, category: null });
                fetchCategories();
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to delete category';
            toast.error(errorMsg);
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                <button
                    onClick={handleCreateClick}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                    <Plus size={18} />
                    Add Category
                </button>
            </div>

            {/* Categories Table */}
            <CategoryTable
                categories={categories}
                loading={loading}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />

            {/* Category Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                {editingCategory ? 'Edit Category' : 'Create Category'}
                            </h2>

                            <CategoryForm
                                category={editingCategory}
                                onSubmit={handleFormSubmit}
                                loading={formLoading}
                                onCancel={() => {
                                    setShowForm(false);
                                    setEditingCategory(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                title="Delete Category"
                message={`Are you sure you want to delete "${deleteConfirm.category?.name}"?${deleteConfirm.category?.productCount > 0
                    ? ` This category has ${deleteConfirm.category.productCount} product(s).`
                    : ''
                    }`}
                confirmLabel="Delete"
                confirmVariant="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteConfirm({ isOpen: false, category: null })}
                loading={formLoading}
            />
        </div>
    );
}
