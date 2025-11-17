import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg shadow-sm p-4 hover:shadow-md transition">
      <img src={product.image} alt={product.name} className="h-40 w-full object-cover" />
      <h3 className="mt-2 font-semibold">{product.name}</h3>
      <p className="text-gray-600">${product.price}</p>
      <Link
        to={`/products/${product._id}`}
        className="mt-2 inline-block bg-green-600 text-white px-4 py-1 rounded"
      >
        View
      </Link>
    </div>
  );
}
