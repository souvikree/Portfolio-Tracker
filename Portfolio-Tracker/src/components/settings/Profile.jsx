import { User } from "lucide-react";
import SettingSection from "./SettingSection";
import { useState, useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const userInfo = JSON.parse(localStorage.getItem("user-info"));
	console.log(userInfo);
      setUser(userInfo);
    
  }, []);

  if (!user) {
    return (
      <SettingSection icon={User} title={"Profile"}>
        <p className="text-gray-400">No user information available. Please sign in.</p>
      </SettingSection>
    );
  }

  return (
    <SettingSection icon={User} title={"Profile"}>
      <div className="flex flex-col sm:flex-row items-center mb-6">
        <img
          src={user.image }
          alt="Profile"
          className="rounded-full w-20 h-20 object-cover mr-4"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-100">{user.name}</h3>
          <p className="text-gray-400">{user.email}</p>
        </div>
      </div>

      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto">
        Edit Profile
      </button>
    </SettingSection>
  );
};

export default Profile;
