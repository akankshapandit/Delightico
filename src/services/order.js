import api from "./api";

// Get user's cart
export const getCart = async () => {
  const { data } = await api.get("/cart");
  return data;
};

// Update cart (add/remove item or change quantity)
export const updateCart = async (productId, quantity) => {
  const { data } = await api.put("/cart", { productId, quantity });
  return data;
};

// Remove item from cart
export const removeFromCart = async (productId) => {
  const { data } = await api.delete(`/cart/${productId}`);
  return data;
};

// Checkout & create order
export const checkout = async (paymentInfo) => {
  const { data } = await api.post("/orders/checkout", paymentInfo);
  return data;
};
