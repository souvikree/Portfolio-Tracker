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
      <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 rounded-lg p-6 shadow-lg w-full sm:w-auto">
        <img
          src={user.image}
          alt="Profile"
          className="rounded-full w-24 h-24 object-cover mb-4 sm:mb-0 sm:mr-4 border-4 border-white shadow-lg"
        />
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-semibold text-gray-100 mb-1">{user.name}</h3>
          <p className="text-sm text-gray-300">{user.email}</p>
        </div>
      </div>

      {/* <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-200 w-full sm:w-auto mt-4">
        Edit Profile
      </button> */}
    </SettingSection>
  );
};

export default Profile;
