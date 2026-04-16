const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

        // Build filter object
        const filter = { isActive: true };

        // Search filter
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
            ];
        }

        // Category filter
        if (category) {
            const categoryDoc = await Category.findOne({ slug: category });
            if (categoryDoc) {
                filter.category = categoryDoc._id;
            } else {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }
        }

        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) {
                filter.price.$gte = parseFloat(minPrice);
            }
            if (maxPrice) {
                filter.price.$lte = parseFloat(maxPrice);
            }
        }

        // Sorting
        let sortObj = {};
        if (sort) {
            switch (sort) {
                case 'price-asc':
                    sortObj = { price: 1 };
                    break;
                case 'price-desc':
                    sortObj = { price: -1 };
                    break;
                case 'rating':
                    sortObj = { averageRating: -1 };
                    break;
                case 'newest':
                    sortObj = { createdAt: -1 };
                    break;
                case 'sold':
                    sortObj = { sold: -1 };
                    break;
                default:
                    sortObj = { createdAt: -1 };
            }
        } else {
            sortObj = { createdAt: -1 };
        }

        // Pagination
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // Get total count for pagination
        const totalProducts = await Product.countDocuments(filter);

        // Get products
        const products = await Product.find(filter)
            .populate('category', 'name slug')
            .sort(sortObj)
            .skip(skip)
            .limit(limitNum)
            .lean();

        // Get price range
        const priceRange = await Product.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            data: products,
            pagination: {
                totalProducts,
                totalPages: Math.ceil(totalProducts / limitNum),
                currentPage: pageNum,
                productsPerPage: limitNum,
            },
            priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true, isFeatured: true })
            .populate('category', 'name slug')
            .limit(8)
            .lean();

        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get product by slug
// @route   GET /api/products/:slug
// @access  Public
exports.getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        // Try to find product by slug (don't strictly require isActive - show details if accessible)
        const product = await Product.findOne({ slug: slug.toLowerCase() })
            .populate('category', 'name slug')
            .populate('ratings.user', 'name');

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found. Please check the product URL.' 
            });
        }

        // Warn if product is not active but still serve (optional)
        if (!product.isActive) {
            console.warn(`Warning: Accessing inactive product - slug: ${slug}`);
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get price range for all active products
// @route   GET /api/products/price-range
// @access  Public
exports.getPriceRange = async (req, res) => {
    try {
        const priceRange = await Product.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            data: priceRange[0] || { minPrice: 0, maxPrice: 0 },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add review to product
// @route   POST /api/products/:slug/reviews
// @access  Private
exports.addReview = async (req, res) => {
    try {
        const { slug } = req.params;
        const { rating, review } = req.body;
        const userId = req.user._id;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Please provide valid rating (1-5)' });
        }

        const product = await Product.findOne({ slug });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Check if user already reviewed this product
        const existingReview = product.ratings.find((r) => r.user.toString() === userId.toString());
        if (existingReview) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
        }

        // Add new review
        product.ratings.push({
            user: userId,
            rating,
            comment: review || '',
        });

        // Update average rating and number of reviews
        const totalRating = product.ratings.reduce((sum, r) => sum + r.rating, 0);
        product.averageRating = parseFloat((totalRating / product.ratings.length).toFixed(1));
        product.numReviews = product.ratings.length;
        product.updatedAt = new Date();

        await product.save();
        await product.populate('ratings.user', 'name');

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            data: product,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete review from product
// @route   DELETE /api/products/:slug/reviews/:reviewId
// @access  Private
exports.deleteReview = async (req, res) => {
    try {
        const { slug, reviewId } = req.params;
        const userId = req.user._id;

        const product = await Product.findOne({ slug });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Find the review
        const reviewIndex = product.ratings.findIndex((review) => review._id.toString() === reviewId);
        if (reviewIndex === -1) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Check if user owns the review
        if (product.ratings[reviewIndex].user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
        }

        // Remove review
        product.ratings.splice(reviewIndex, 1);

        // Update average rating and number of reviews
        if (product.ratings.length > 0) {
            const totalRating = product.ratings.reduce((sum, review) => sum + review.rating, 0);
            product.averageRating = parseFloat((totalRating / product.ratings.length).toFixed(1));
        } else {
            product.averageRating = 0;
        }
        product.numReviews = product.ratings.length;
        product.updatedAt = new Date();

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully',
            data: product,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Fix products without slugs or set isActive to true (MAINTENANCE ENDPOINT)
// @route   POST /api/products/admin-only/fix-missing-data
// @access  Private/Admin
exports.fixMissingProductData = async (req, res) => {
    try {
        const products = await Product.find({});
        let updated = 0;

        for (const product of products) {
            let needsUpdate = false;

            // Generate slug if missing
            if (!product.slug || product.slug.trim() === '') {
                let slug = (product.name || 'product')
                    .toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-');

                let count = 0;
                let finalSlug = slug;
                let existingProduct = await Product.findOne({ slug: finalSlug, _id: { $ne: product._id } });

                while (existingProduct) {
                    count++;
                    finalSlug = `${slug}-${count}`;
                    existingProduct = await Product.findOne({ slug: finalSlug, _id: { $ne: product._id } });
                }

                product.slug = finalSlug;
                needsUpdate = true;
            }

            // Ensure isActive is set
            if (product.isActive === undefined || product.isActive === null) {
                product.isActive = true;
                needsUpdate = true;
            }

            if (needsUpdate) {
                await product.save();
                updated++;
            }
        }

        res.status(200).json({
            success: true,
            message: `Fixed ${updated} products with missing data`,
            data: {
                totalProducts: products.length,
                productsUpdated: updated,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
