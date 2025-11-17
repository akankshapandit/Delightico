import { useAuth } from '../context/AuthContext'; // ✅ default import


export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-red-500">Please login to view profile.</p>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
    </div>
  );
}
