import { useEffect, useState } from "react";
import { auth } from "../../Firebase/firebase";

const Profile = () => {
  const [data, setData] = useState(null);
  const BASE_URL = import.meta.env.VITE_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`${BASE_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      setData(json);
    };

    fetchProfile();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">User Profile</h1>
      {data ? (
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default Profile;
