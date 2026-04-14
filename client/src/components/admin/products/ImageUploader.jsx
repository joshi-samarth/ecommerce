import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

export default function ImageUploader({ images = [], onChange, maxImages = 5 }) {
    const [dragActive, setDragActive] = useState(false);
    const [previewImages, setPreviewImages] = useState(
        images.map((img, idx) => ({
            id: `existing-${idx}`,
            src: img,
            type: 'existing',
        }))
    );

    const fileInputRef = useRef(null);

    const handleFiles = (files) => {
        const newFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));

        if (previewImages.length + newFiles.length > maxImages) {
            alert(`Maximum ${maxImages} images allowed`);
            return;
        }

        const newPreviews = newFiles.map((file, idx) => ({
            id: `new-${Date.now()}-${idx}`,
            src: URL.createObjectURL(file),
            type: 'new',
            file,
        }));

        const updated = [...previewImages, ...newPreviews];
        setPreviewImages(updated);

        // Update parent
        const existing = updated.filter((img) => img.type === 'existing').map((img) => img.src);
        const newFileList = updated.filter((img) => img.type === 'new').map((img) => img.file);

        onChange({
            existingImages: existing,
            newFiles: newFileList,
        });
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleRemove = (id) => {
        const updated = previewImages.filter((img) => img.id !== id);
        setPreviewImages(updated);

        // Cleanup object URL for new files
        const removed = previewImages.find((img) => img.id === id);
        if (removed?.type === 'new') {
            URL.revokeObjectURL(removed.src);
        }

        // Update parent
        const existing = updated.filter((img) => img.type === 'existing').map((img) => img.src);
        const newFileList = updated.filter((img) => img.type === 'new').map((img) => img.file);

        onChange({
            existingImages: existing,
            newFiles: newFileList,
        });
    };

    return (
        <div>
            {/* Upload Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                onClick={() => fileInputRef.current?.click()}
            >
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-700 font-semibold">Drag and drop images here</p>
                <p className="text-gray-500 text-sm">or click to browse</p>
                <p className="text-gray-400 text-xs mt-2">Max 5 images, 5MB each</p>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                />
            </div>

            {/* Image Count */}
            {previewImages.length > 0 && (
                <p className="text-sm text-gray-600 mt-4">
                    {previewImages.length} / {maxImages} images
                </p>
            )}

            {/* Previews */}
            <div className="grid grid-cols-4 gap-4 mt-4">
                {previewImages.map((img) => (
                    <div key={img.id} className="relative group">
                        <img src={img.src} alt="preview" className="w-full h-24 object-cover rounded border border-gray-200" />

                        {/* Badge */}
                        <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                            {img.type === 'new' ? 'New' : 'Existing'}
                        </span>

                        {/* Delete Button */}
                        <button
                            onClick={() => handleRemove(img.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
