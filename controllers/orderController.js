import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Get order details by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({ orderId: orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.customer.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    // Fetch complete product details for each item
    const itemsWithProductDetails = await Promise.all(
      order.items.map(async (item) => {
        try {
          const product = await Product.findById(item.productId);
          if (product) {
            return {
              ...item.toObject(),
              productDetails: {
                name: product.name,
                description: product.description,
                images: product.images,
                category: product.category,
                weight: product.weight
              }
            };
          }
          return item;
        } catch (error) {
          console.error('Error fetching product:', error);
          return item;
        }
      })
    );

    const orderWithDetails = {
      ...order.toObject(),
      items: itemsWithProductDetails
    };

    res.json({
      success: true,
      data: orderWithDetails
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order details'
    });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await Order.find({ 'customer.userId': userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};