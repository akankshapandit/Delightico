import express from 'express';
import { uploadProductImages } from '../middleware/upload.js';
import { uploadProductImagesController } from '../controllers/productController.js';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);

// NEW ROUTE: Get product details for AI content generation (Public)
router.get('/:id/ai-content', async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Use your existing getProduct controller to get real product data
    // This assumes getProduct returns the product data
    const product = await getProduct(req, res, () => {});
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ 
      success: true, 
      product: {
        id: product._id || product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        features: product.features || [],
        price: product.price,
        image: product.image,
        inStock: product.inStock
      }
    });

  } catch (error) {
    console.error('Product AI content error:', error);
    res.status(500).json({ success: false, error: 'Failed to get product details' });
  }
});

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

// Image upload route
router.post(
  '/:id/images',
  protect,
  authorize('admin'),
  uploadProductImages,
  uploadProductImagesController
);

export default router;