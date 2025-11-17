import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-200 p-4">
      <ul className="space-y-2">
        <li>
          <Link to="/admin">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/ai">AI Marketing</Link>
        </li>
      </ul>
    </aside>
  );
}
