import { useState, useEffect } from "react";
import { getProducts, addProduct, deleteProduct } from "../services/product";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", image: "", description: "" });

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const newProduct = await addProduct(form);
    setProducts([...products, newProduct]);
    setForm({ name: "", price: "", image: "", description: "" });
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setProducts(products.filter((p) => p._id !== id));
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        {/* Add Product Form */}
        <form onSubmit={handleAdd} className="space-y-3 mb-6 bg-gray-100 p-4 rounded">
          <input
            type="text"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          ></textarea>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Add Product
          </button>
        </form>

        {/* Products List */}
        <h2 className="text-xl font-semibold mb-2">All Products</h2>
        <ul>
          {products.map((p) => (
            <li key={p._id} className="flex justify-between items-center border-b py-2">
              <div>
                <strong>{p.name}</strong> – ${p.price}
              </div>
              <button onClick={() => handleDelete(p._id)} className="text-red-500">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
