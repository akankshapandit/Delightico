import api from "./api";

// Generate AI-powered post (Instagram/Facebook/WhatsApp)
export const generateAIPost = async (productData) => {
  try {
    const { data } = await api.post("/ai/generate-post", productData);
    return data;
  } catch (error) {
    console.error("AI Post Generation Error:", error);
    throw error;
  }
};
