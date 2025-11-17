import api from "./api";

// Get all products
export const getProducts = async () => {
  const { data } = await api.get("/products");
  return data;
};

// ✅ Get single product by ID
export const getProductById = async (productId) => {
  const { data } = await api.get(`/products/${productId}`);
  return data;
};

// Add a new product (Admin only)
export const addProduct = async (productData) => {
  const { data } = await api.post("/products", productData);
  return data;
};

// Delete product (Admin only)
export const deleteProduct = async (productId) => {
  const { data } = await api.delete(`/products/${productId}`);
  return data;
};
