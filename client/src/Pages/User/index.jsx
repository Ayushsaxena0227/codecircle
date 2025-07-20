import { useEffect, useState } from "react";
import { auth } from "../firebase";

const Profile = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("http://localhost:5000/api/user/profile", {
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
