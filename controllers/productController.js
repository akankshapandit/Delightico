import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const productData = {
    ...req.body,
    createdBy: req.user.id
  };

  const product = await Product.create(productData);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product
  });
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    status,
    page = 1,
    limit = 10
  } = req.query;

  // Build filter object
  let filter = {};
  if (keyword) {
    filter.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { tags: { $in: [new RegExp(keyword, 'i')] } }
    ];
  }
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Pagination
  const skip = (page - 1) * limit;

  const products = await Product.find(filter)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Product.countDocuments(filter);

  res.json({
    success: true,
    count: products.length,
    total,
    pagination: {
      page: Number(page),
      pages: Math.ceil(total / limit)
    },
    data: products
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('createdBy', 'name email');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Increment views
  product.views += 1;
  await product.save();

  res.json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('createdBy', 'name email');

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await Product.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = asyncHandler(async (req, res) => {
  const products = await Product.find({ 
    category: req.params.category,
    status: 'active'
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Upload product images
// @route   POST /api/products/:id/images
// @access  Private/Admin

// ... keep all your other functions above ...

// @desc    Upload product images
// @route   POST /api/products/:id/images
// @access  Private/Admin
export const uploadProductImagesController = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image'
      });
    }

    // Create image objects - USE CORRECT STRUCTURE
    const newImages = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      public_id: file.filename, // Use filename as public_id
      alt: req.body.alt || product.name
    }));

    // Add images to product
    product.images.push(...newImages);
    await product.save();

    res.json({
      success: true,
      message: `${req.files.length} image(s) uploaded successfully`,
      data: {
        images: product.images
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
